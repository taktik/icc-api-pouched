import {
	iccAccesslogApi,
	iccAuthApi,
	iccBemikronoApi,
	iccBeresultexportApi,
	iccBeresultimportApi,
	iccCalendarItemApi,
	iccCalendarItemTypeApi,
	IccClassificationXApi,
	iccDoctemplateApi,
	iccEntityrefApi,
	iccEntitytemplateApi,
	iccGenericApi,
	iccHcpartyApi,
	iccIcureApi,
	iccInsuranceApi,
	iccReplicationApi,
	iccTarificationApi,
	PatientDto,
	PatientPaginatedList,
	UserDto
} from 'icc-api'
import PouchDB from 'pouchdb'
import { XHR } from 'icc-api/icc-api/api/XHR'
import _ from 'lodash'

import { IccBedrugsXApi } from 'icc-api/dist/icc-x-api/icc-bedrugs-x-api'
import { IccBekmehrXApi } from 'icc-api/dist/icc-x-api/icc-bekmehr-x-api'
import { IccCodeXApi } from 'icc-api/dist/icc-x-api/icc-code-x-api'
import { IccContactXApi } from 'icc-api/dist/icc-x-api/icc-contact-x-api'
import { IccCryptoXApi } from 'icc-api/dist/icc-x-api/icc-crypto-x-api'
import { IccDocumentXApi } from 'icc-api/dist/icc-x-api/icc-document-x-api'
import { IccFormXApi } from 'icc-api/dist/icc-x-api/icc-form-x-api'
import { IccHcpartyXApi } from 'icc-api/dist/icc-x-api/icc-hcparty-x-api'
import { IccHelementXApi } from 'icc-api/dist/icc-x-api/icc-helement-x-api'
import { IccPatientXApi } from 'icc-api/dist/icc-x-api/icc-patient-x-api'
import { IccReceiptXApi } from 'icc-api/dist/icc-x-api/icc-receipt-x-api'
import { IccUserXApi } from 'icc-api/dist/icc-x-api/icc-user-x-api'
import { IccInvoiceXApi } from 'icc-api/dist/icc-x-api/icc-invoice-x-api'
import { IccMessageXApi } from 'icc-api/dist/icc-x-api/icc-message-x-api'

export namespace iccapipouched {

	type PaginatorFunction<X> = (key: any, docId: string | null, limit: number | undefined) => Promise<PaginatorResponse<X>>
	type PaginatorExecutor<X> = (latestPaginatorFunctionResult: PaginatorResponse<X>, acc: any[], limit: number | undefined) => Promise<PaginatorResponse<X>>

	interface PaginatorResponse<X> {
		rows: Array<X>
		nextKey: any | null
		nextDocId: string | null
		done: boolean
	}

	interface RowsChunk<X> {
		startIdx: number
		endIdx: number
		rows: Array<X>
		nextKey: any | null
		nextDocId: string | null
	}

	interface MissingRowsChunk<X> {
		missing: [number, number]
		lastEndIdx: number,
		lastKey: any | null,
		lastDocId: string | null,
		rows?: Array<X> // Is going to be filled when we go through all missing rows chunks
	}

	export interface IccApiPouched {
		sync(): Promise<void>

		search<T>(term: string): Promise<T>
	}

	class IccApiPouchedImpl implements IccApiPouched {
		private readonly _host: string
		private readonly _headers: Array<XHR.Header>
		private readonly _database: PouchDB.Database
		private readonly _lastSync: number

		private readonly _accesslogicc: iccAccesslogApi
		private readonly _authicc: iccAuthApi
		private readonly _bemikronoicc: iccBemikronoApi
		private readonly _onlineBeMikronoicc: iccBemikronoApi
		private readonly _beresultexporticc: iccBeresultexportApi
		private readonly _beresultimporticc: iccBeresultimportApi
		private readonly _doctemplateicc: iccDoctemplateApi
		private readonly _entitytemplateicc: iccEntitytemplateApi
		private readonly _genericicc: iccGenericApi
		private readonly _icureicc: iccIcureApi
		private readonly _insuranceicc: iccInsuranceApi
		private readonly _replicationicc: iccReplicationApi
		private readonly _tarificationicc: iccTarificationApi
		private readonly _entityreficc: iccEntityrefApi
		private readonly _calendaritemicc: iccCalendarItemApi
		private readonly _calendaritemtypeicc: iccCalendarItemTypeApi
		private readonly _usericc: IccUserXApi
		private readonly _codeicc: IccCodeXApi
		private readonly _bedrugsicc: IccBedrugsXApi
		private readonly _hcpartyiccLight: iccHcpartyApi
		private readonly _hcpartyicc: IccHcpartyXApi
		private readonly _cryptoicc: IccCryptoXApi
		private readonly _receipticc: IccReceiptXApi
		private readonly _contacticc: IccContactXApi
		private readonly _documenticc: IccDocumentXApi
		private readonly _formicc: IccFormXApi
		private readonly _helementicc: IccHelementXApi
		private readonly _invoiceicc: IccInvoiceXApi
		private readonly _classificationicc: IccClassificationXApi
		private readonly _patienticc: IccPatientXApi
		private readonly _messageicc: IccMessageXApi
		private readonly _bekmehricc: IccBekmehrXApi

		constructor(host: string, headers: Array<XHR.Header>, lastSync: number, databaseName?: string) {
			this._database = new PouchDB(databaseName || 'icc-local-database')
			this._host = host
			this._headers = headers
			this._lastSync = lastSync

			this._accesslogicc = new iccAccesslogApi(this._host, this._headers)
			this._authicc = new iccAuthApi(this._host, this._headers)
			this._bemikronoicc = new iccBemikronoApi(this._host, this._headers)
			this._onlineBeMikronoicc = new iccBemikronoApi(this._host && this._host.match(/https:\/\/backend.(.+).icure.cloud.+/) ? this._host : 'https://backend.svc.icure.cloud/rest/v1', this._headers)
			this._beresultexporticc = new iccBeresultexportApi(this._host, this._headers)
			this._beresultimporticc = new iccBeresultimportApi(this._host, this._headers)
			this._doctemplateicc = new iccDoctemplateApi(this._host, this._headers)
			this._entitytemplateicc = new iccEntitytemplateApi(this._host, this._headers)
			this._genericicc = new iccGenericApi(this._host, this._headers)
			this._icureicc = new iccIcureApi(this._host, this._headers)
			this._insuranceicc = new iccInsuranceApi(this._host, this._headers)
			this._replicationicc = new iccReplicationApi(this._host, this._headers)
			this._tarificationicc = new iccTarificationApi(this._host, this._headers)
			this._entityreficc = new iccEntityrefApi(this._host, this._headers)
			this._calendaritemicc = new iccCalendarItemApi(this._host, this._headers)
			this._calendaritemtypeicc = new iccCalendarItemTypeApi(this._host, this._headers)
			this._usericc = new IccUserXApi(this._host, this._headers)
			this._codeicc = new IccCodeXApi(this._host, this._headers)
			this._bedrugsicc = new IccBedrugsXApi(this._host, this._headers)
			this._hcpartyiccLight = new iccHcpartyApi(this._host, this._headers)
			this._hcpartyicc = new IccHcpartyXApi(this._host, this._headers)
			this._cryptoicc = new IccCryptoXApi(this._host, this._headers, this._hcpartyicc)
			this._receipticc = new IccReceiptXApi(this._host, this._headers, this._cryptoicc)
			this._contacticc = new IccContactXApi(this._host, this._headers, this._cryptoicc)
			this._documenticc = new IccDocumentXApi(this._host, this._headers, this._cryptoicc)
			this._formicc = new IccFormXApi(this._host, this._headers, this._cryptoicc)
			this._helementicc = new IccHelementXApi(this._host, this._headers, this._cryptoicc)
			this._invoiceicc = new IccInvoiceXApi(this._host, this._headers, this._cryptoicc, this._entityreficc)
			this._classificationicc = new IccClassificationXApi(this._host, this._headers, this._cryptoicc)
			this._patienticc = new IccPatientXApi(this._host, this._headers, this._cryptoicc, this._contacticc, this._helementicc, this._invoiceicc, this._documenticc, this._hcpartyicc, this._classificationicc)
			this._messageicc = new IccMessageXApi(this._host, this._headers, this._cryptoicc, this._insuranceicc, this._entityreficc, this._invoiceicc, this._documenticc, this._receipticc, this._patienticc)
			this._bekmehricc = new IccBekmehrXApi(this._host, this._headers, this._contacticc, this._helementicc)
		}

		get host(): string {
			return this._host
		}

		get headers(): Array<XHR.Header> {
			return this._headers
		}

		get database(): PouchDB.Database {
			return this._database
		}

		get lastSync(): number {
			return this._lastSync
		}

		get patienticc(): IccPatientXApi {
			return this._patienticc
		}

		async search<T>(term: string): Promise<PatientPaginatedList | any> {
			// TODO: search in local

		}

		async sync(): Promise<void> {
			const currentUser = this._usericc.getCurrentUser()
			// TODO: Q AD throw exception if not logged in
			if (currentUser instanceof UserDto) {

				const paginator = async (key: number, docId: string) => {
					const pl = await this.patienticc.listOfPatientsModifiedAfterWithUser(currentUser, this.lastSync, key, docId, 1000)
					return {
						rows: pl.rows,
						nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
						nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
						done: !pl.nextKeyPair
					}
				}

				const patList = await this.getRowsUsingPagination(paginator)
				patList && patList.forEach((pat: any) => {

					const keysToKeep = ['firstName', 'lastName', 'maidenName', 'spouseName', 'phoneNumber']

					const filtered = Object.keys(pat)
						.filter(key => keysToKeep.includes(key))
						.reduce((obj, key) => {
							return { ...obj, [key]: pat[key as keyof PatientDto] }
						}, {})

					// pat.firstName
					// pat.lastName
					// pat.maidenName
					// pat.spouseName
					//
					// pat.phoneNumber
					// pat.status
					// pat.upcomingInjectionNumber
					// pat.upcomingInjectionDose
					// pat.upcomingInjectionDate
				})

			}
		}

		// TODO: Q AD
		async getRowsUsingPagination<X>(paginator: PaginatorFunction<X>, filter?: (value: X, idx: number, array: Array<X>) => boolean, startIdx?: number, endIdx?: number, cache?: Array<RowsChunk<X>>): Promise<Array<X>> {
			const executePaginator: PaginatorExecutor<X> = async (latestResult: PaginatorResponse<X>, acc: Array<X>, limit: number | undefined) => {
				const newResult = await paginator(latestResult.nextKey, latestResult.nextDocId, endIdx && startIdx ? endIdx - startIdx : undefined)
				const rows = (filter ? newResult.rows && newResult.rows.filter(filter) : newResult.rows) || []
				acc.push(...rows)
				if (newResult.done || (limit && (acc.length >= limit))) {
					return {
						rows: acc,
						nextKey: newResult.nextKey,
						nextDocId: newResult.nextDocId,
						done: false
					}
				} else {
					return executePaginator(newResult, acc, limit)
				}
			}

			if (cache && startIdx && endIdx) {
				// Go through cache and build a list of existing rows (RowsChunks) and missing rows (MissingRowChunks)
				// The cache is a sparse structure sorted by index
				// At first, the cache is empty rows is going to be equal to [] and everything will be missing (see empty rows situation below)
				const [rows, lastKey, lastDocId, lastEndIdx] = cache.reduce(([rows, lastKey, lastDocId, lastEndIdx, lastTreatedIdx]: [Array<RowsChunk<X> | MissingRowsChunk<X>>, any | null, string | null, number, number] , chunk) => {

					const startOfZoi = lastTreatedIdx
					const endOfZoi = endIdx

					if (chunk.endIdx <= startOfZoi) {
						//           [--zoi--] // Zone of interest starts at startOfZoi, ends at endIdx
						// [-chunk-]
						// Doesn't look like anything to me
					} else if (chunk.startIdx >= endIdx) {
						// [--zoi--]
						//           [-chunk-]
						if (startOfZoi < endIdx) {
							rows.push({ missing: [startOfZoi, endIdx], lastEndIdx, lastKey, lastDocId })
							lastTreatedIdx = endOfZoi
						}
					} else {
						if (chunk.startIdx <= lastTreatedIdx) {
							if (chunk.endIdx <= endIdx) {
								//       [--zoi--]
								// [-chunk-]
								rows.push({
									startIdx: startOfZoi,
									endIdx: chunk.endIdx,
									rows: chunk.rows.slice(startOfZoi - chunk.startIdx, chunk.endIdx - chunk.startIdx),
									nextKey: null,
									nextDocId: null
								})
								lastTreatedIdx = chunk.endIdx
							} else {
								//       [--zoi--]
								// [------chunk------]
								rows.push({
									startIdx: startOfZoi,
									endIdx: endOfZoi,
									rows: chunk.rows.slice(startOfZoi - chunk.startIdx, endOfZoi - chunk.startIdx),
									nextKey: null,
									nextDocId: null
								})
								lastTreatedIdx = endOfZoi
							}
						} else {
							//  [--zoi--]
							//        [-chunk-]
							if (chunk.endIdx >= endOfZoi) {
								rows.push({ missing: [startOfZoi, chunk.startIdx], lastEndIdx, lastKey, lastDocId })
								rows.push({
									startIdx: chunk.startIdx,
									endIdx: endOfZoi,
									rows: chunk.rows.slice(0, endOfZoi - chunk.startIdx),
									nextKey: null,
									nextDocId: null
								})
								lastTreatedIdx = endOfZoi
							} else {
								//  [-------zoi-------]
								//       [-chunk-]
								rows.push({ missing: [startOfZoi, chunk.startIdx], lastEndIdx, lastKey, lastDocId })
								rows.push({
									startIdx: chunk.startIdx,
									endIdx: chunk.endIdx,
									rows: chunk.rows.slice(0, chunk.endIdx - chunk.startIdx),
									nextKey: null,
									nextDocId: null
								})
								lastTreatedIdx = chunk.endIdx
							}
						}
					}
					return [rows, chunk.nextKey, chunk.nextDocId, chunk.endIdx, lastTreatedIdx]
				}, [[], null, null, 0, startIdx || 0])
				if (!rows.length) {
					rows.push({
						missing: [startIdx, endIdx],
						lastKey: lastKey,
						lastDocId: lastDocId,
						lastEndIdx: lastEndIdx
					})
				} else {
					const lastRow = _.last<any>(rows)
					if (lastRow && lastRow.rows && lastRow.startIdx + lastRow.rows.length < endIdx) {
						rows.push({
							missing: [lastRow.startIdx + lastRow.rows.length, endIdx],
							lastKey: lastKey,
							lastDocId: lastDocId,
							lastEndIdx: lastEndIdx
						})
					}
				}

				// Once we we have determined which where the missing chunks. Go fetch them based on the lastKey/lastDocId + the limit computed with the lastEndIndex
				await Promise.all(rows.filter((r: any) => r.missing).map(async (r: any) => {
					const missing = r as MissingRowsChunk<X>
					const { rows, nextKey, nextDocId } = await executePaginator({
						nextKey: missing.lastKey,
						nextDocId: missing.lastDocId,
						rows: [],
						done: false
					}, [], missing.missing[1] - missing.lastEndIdx)

					missing.rows = rows.slice(missing.missing[0] - missing.lastEndIdx, missing.missing[1] - missing.lastEndIdx)
					cache[missing.lastEndIdx] = { rows, startIdx: missing.missing[0], endIdx: missing.missing[1], nextKey, nextDocId }
				}))
				return _.flatMap(rows, (r: MissingRowsChunk<X> | RowsChunk<X>) => r.rows!!)
			} else {
				const { rows } = await executePaginator({ nextKey: null, nextDocId: null, rows: [], done: false }, [], undefined)
				return rows
			}
		}
	}

	/*
		Factory method
	*/
	export function newIccApiPouched(host: string, headers: Array<XHR.Header>, lastSync: number, databaseName?: string): IccApiPouched {
		return new IccApiPouchedImpl(host, headers, lastSync, databaseName)
	}
}
