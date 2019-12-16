/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-mapreduce" />
/// <reference types="pouchdb-replication" />
import { AddressDto, IccTimeTableXApi, UserDto } from 'icc-api'
import { IccCalendarItemXApi } from 'icc-api/dist/icc-x-api/icc-calendar-item-x-api'
import { IccContactXApi } from 'icc-api/dist/icc-x-api/icc-contact-x-api'
import { IccCryptoXApi } from 'icc-api/dist/icc-x-api/icc-crypto-x-api'
import { IccHcpartyXApi } from 'icc-api/dist/icc-x-api/icc-hcparty-x-api'
import { IccPatientXApi } from 'icc-api/dist/icc-x-api/icc-patient-x-api'
import { IccUserXApi } from 'icc-api/dist/icc-x-api/icc-user-x-api'
import { Moment } from 'moment'
import { IccAccesslogXApi } from 'icc-api/dist/icc-x-api/icc-accesslog-x-api'
export declare namespace iccapipouched {
	interface IccApiPouched {
		readonly host: string
		readonly headers: {
			[key: string]: string
		}
		readonly database: PouchDB.Database
		readonly latestSync: number
		readonly patienticc: IccPatientXApi
		readonly calendaritemicc: IccCalendarItemXApi
		readonly timetableicc: IccTimeTableXApi
		readonly usericc: IccUserXApi
		readonly cryptoicc: IccCryptoXApi
		readonly hcpartyicc: IccHcpartyXApi
		readonly contacticc: IccContactXApi
		readonly accesslogicc: IccAccesslogXApi
		init(localDatabaseName?: string): Promise<void>
		sync(crypto: IccCryptoXApi, max?: number): Promise<void>
		search<T>(term: string, limit: number): Promise<Array<any>>
		moment(timestamp: number | string): Moment | null
	}
	class PatientStubCore {
		firstName?: string
		lastName?: string
		gender?: string
		maidenName?: string
		spouseName?: string
		dateOfBirth?: number
		externalId?: string
		addresses?: Array<AddressDto>
	}
	type PatientStub = PatientStubCore & PouchDB.Core.ExistingDocument<PatientStubCore>
	function newIccApiPouched(
		host: string,
		username: string,
		password: string,
		headers?: {
			[key: string]: string
		},
		latestSync?: number,
		cryptedKeys?: {
			[key: string]: Array<string>
		}
	): IccApiPouched
	function loadCurrentUserWithSessionCookie(host: string): Promise<UserDto>
}
