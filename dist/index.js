'use strict'
var __awaiter =
	(this && this.__awaiter) ||
	function(thisArg, _arguments, P, generator) {
		return new (P || (P = Promise))(function(resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value))
				} catch (e) {
					reject(e)
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value))
				} catch (e) {
					reject(e)
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: new P(function(resolve) {
							resolve(result.value)
					  }).then(fulfilled, rejected)
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next())
		})
	}
Object.defineProperty(exports, '__esModule', { value: true })
const icc_api_1 = require('icc-api')
const pouchdb_1 = require('pouchdb')
const _ = require('lodash')
const icc_code_x_api_1 = require('icc-api/dist/icc-x-api/icc-code-x-api')
const icc_calendar_item_x_api_1 = require('icc-api/dist/icc-x-api/icc-calendar-item-x-api')
const icc_contact_x_api_1 = require('icc-api/dist/icc-x-api/icc-contact-x-api')
const icc_crypto_x_api_1 = require('icc-api/dist/icc-x-api/icc-crypto-x-api')
const icc_document_x_api_1 = require('icc-api/dist/icc-x-api/icc-document-x-api')
const icc_form_x_api_1 = require('icc-api/dist/icc-x-api/icc-form-x-api')
const icc_hcparty_x_api_1 = require('icc-api/dist/icc-x-api/icc-hcparty-x-api')
const icc_helement_x_api_1 = require('icc-api/dist/icc-x-api/icc-helement-x-api')
const icc_patient_x_api_1 = require('icc-api/dist/icc-x-api/icc-patient-x-api')
const icc_receipt_x_api_1 = require('icc-api/dist/icc-x-api/icc-receipt-x-api')
const icc_user_x_api_1 = require('icc-api/dist/icc-x-api/icc-user-x-api')
const icc_invoice_x_api_1 = require('icc-api/dist/icc-x-api/icc-invoice-x-api')
const icc_message_x_api_1 = require('icc-api/dist/icc-x-api/icc-message-x-api')
const icc_accesslog_x_api_1 = require('icc-api/dist/icc-x-api/icc-accesslog-x-api')
const moment = require('moment')
var iccapipouched
;(function(iccapipouched) {
	class PatientStubCore {}
	class IccApiPouchedImpl {
		constructor(host, username, password, headers, latestSync, cryptedKeys) {
			this._database = null
			this._hcpIdForUserIdCache = null
			this._userIdsWithRoleCache = null
			this._host = host
			this._headers = Object.assign(
				{ Authorization: `Basic ${btoa(`${username}:${password}`)}` },
				headers || {}
			)
			this._latestSync = latestSync || 0
			this._insuranceicc = new icc_api_1.iccInsuranceApi(this._host, this._headers)
			this._authicc = new icc_api_1.iccAuthApi(this._host, this._headers)
			this._entityreficc = new icc_api_1.iccEntityrefApi(this._host, this._headers)
			this._calendaritemtypeicc = new icc_api_1.iccCalendarItemTypeApi(
				this._host,
				this._headers
			)
			this._usericc = new icc_user_x_api_1.IccUserXApi(this._host, this._headers)
			this._codeicc = new icc_code_x_api_1.IccCodeXApi(this._host, this._headers)
			this._hcpartyiccLight = new icc_api_1.iccHcpartyApi(this._host, this._headers)
			this._hcpartyicc = new icc_hcparty_x_api_1.IccHcpartyXApi(this._host, this._headers)
			this._cryptoicc = new icc_crypto_x_api_1.IccCryptoXApi(
				this._host,
				this._headers,
				this._hcpartyicc,
				new icc_api_1.iccPatientApi(this._host, this._headers)
			)
			this._timetableicc = new icc_api_1.IccTimeTableXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._accesslogicc = new icc_accesslog_x_api_1.IccAccesslogXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._calendaritemicc = new icc_calendar_item_x_api_1.IccCalendarItemXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._receipticc = new icc_receipt_x_api_1.IccReceiptXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._contacticc = new icc_contact_x_api_1.IccContactXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._documenticc = new icc_document_x_api_1.IccDocumentXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._formicc = new icc_form_x_api_1.IccFormXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._helementicc = new icc_helement_x_api_1.IccHelementXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._invoiceicc = new icc_invoice_x_api_1.IccInvoiceXApi(
				this._host,
				this._headers,
				this._cryptoicc,
				this._entityreficc
			)
			this._classificationicc = new icc_api_1.IccClassificationXApi(
				this._host,
				this._headers,
				this._cryptoicc
			)
			this._patienticc = new icc_patient_x_api_1.IccPatientXApi(
				this._host,
				this._headers,
				this._cryptoicc,
				this._contacticc,
				this._formicc,
				this._helementicc,
				this._invoiceicc,
				this._documenticc,
				this._hcpartyicc,
				this._classificationicc,
				this._calendaritemicc,
				(cryptedKeys && cryptedKeys['patient']) || undefined
			)
			this._messageicc = new icc_message_x_api_1.IccMessageXApi(
				this._host,
				this._headers,
				this._cryptoicc,
				this._insuranceicc,
				this._entityreficc,
				this._invoiceicc,
				this._documenticc,
				this._receipticc,
				this._patienticc
			)
		}
		init(localDatabaseName) {
			return __awaiter(this, void 0, void 0, function*() {
				if (!localDatabaseName) {
					const user = yield this.usericc.getCurrentUser()
					if (!user) {
						throw new Error(
							'A valid user must be set to init a pouchdb structure when no database name is set'
						)
					}
					localDatabaseName = `icc-local-database.${user.id}`
				}
				this._database = new pouchdb_1.default(localDatabaseName)
				const ddoc = {
					_id: '_design/Patient',
					views: {
						by_search_string: {
							map:
								'function(doc) {\n' +
								'const emitNormalizedSubstrings = (txt, doc, latinMap, acc) => {\n' +
								'let r = txt.toLowerCase().replace(/[^A-Za-z0-9]/g, a => {\n' +
								"return latinMap[a] || ''\n" +
								'})\n' +
								'for (let i = 0; i <= r.length - 3; i++) {\n' +
								'acc[r.substr(i, r.length - i)] = 1\n' +
								'}\n' +
								'}\n' +
								"const latinMap = {'á': 'a','ă': 'a','ắ': 'a','ặ': 'a','ằ': 'a','ẳ': 'a','ẵ': 'a','ǎ': 'a','â': 'a','ấ': 'a','ậ': 'a','ầ': 'a','ẩ': 'a','ẫ': 'a','ä': 'a','ǟ': 'a','ȧ': 'a',\n" +
								"'ǡ': 'a','ạ': 'a','ȁ': 'a','à': 'a','ả': 'a','ȃ': 'a','ā': 'a','ą': 'a','ᶏ': 'a','ẚ': 'a','å': 'a','ǻ': 'a','ḁ': 'a','ⱥ': 'a','ã': 'a','ꜳ': 'aa','æ': 'ae',\n" +
								"'ǽ': 'ae','ǣ': 'ae','ꜵ': 'ao','ꜷ': 'au','ꜹ': 'av','ꜻ': 'av','ꜽ': 'ay','ḃ': 'b','ḅ': 'b','ɓ': 'b','ḇ': 'b','ᵬ': 'b','ᶀ': 'b','ƀ': 'b','ƃ': 'b','ɵ': 'o',\n" +
								"'ć': 'c','č': 'c','ç': 'c','ḉ': 'c','ĉ': 'c','ɕ': 'c','ċ': 'c','ƈ': 'c','ȼ': 'c','ď': 'd','ḑ': 'd','ḓ': 'd','ȡ': 'd','ḋ': 'd','ḍ': 'd','ɗ': 'd','ᶑ': 'd',\n" +
								"'ḏ': 'd','ᵭ': 'd','ᶁ': 'd','đ': 'd','ɖ': 'd','ƌ': 'd','ı': 'i','ȷ': 'j','ɟ': 'j','ʄ': 'j','ǳ': 'dz','ǆ': 'dz','é': 'e','ĕ': 'e','ě': 'e','ȩ': 'e','ḝ': 'e',\n" +
								"'ê': 'e','ế': 'e','ệ': 'e','ề': 'e','ể': 'e','ễ': 'e','ḙ': 'e','ë': 'e','ė': 'e','ẹ': 'e','ȅ': 'e','è': 'e','ẻ': 'e','ȇ': 'e','ē': 'e','ḗ': 'e','ḕ': 'e',\n" +
								"'ⱸ': 'e','ę': 'e','ᶒ': 'e','ɇ': 'e','ẽ': 'e','ḛ': 'e','ꝫ': 'et','ḟ': 'f','ƒ': 'f','ᵮ': 'f','ᶂ': 'f','ǵ': 'g','ğ': 'g','ǧ': 'g','ģ': 'g','ĝ': 'g','ġ': 'g',\n" +
								"'ɠ': 'g','ḡ': 'g','ᶃ': 'g','ǥ': 'g','ḫ': 'h','ȟ': 'h','ḩ': 'h','ĥ': 'h','ⱨ': 'h','ḧ': 'h','ḣ': 'h','ḥ': 'h','ɦ': 'h','ẖ': 'h','ħ': 'h','ƕ': 'hv','í': 'i',\n" +
								"'ĭ': 'i','ǐ': 'i','î': 'i','ï': 'i','ḯ': 'i','ị': 'i','ȉ': 'i','ì': 'i','ỉ': 'i','ȋ': 'i','ī': 'i','į': 'i','ᶖ': 'i','ɨ': 'i','ĩ': 'i','ḭ': 'i','ꝺ': 'd',\n" +
								"'ꝼ': 'f','ᵹ': 'g','ꞃ': 'rq','ꞅ': 's','ꞇ': 't','ꝭ': 'is','ǰ': 'j','ĵ': 'j','ʝ': 'j','ɉ': 'j','ḱ': 'k','ǩ': 'k','ķ': 'k','ⱪ': 'k','ꝃ': 'k','ḳ': 'k','ƙ': 'k',\n" +
								"'ḵ': 'k','ᶄ': 'k','ꝁ': 'k','ꝅ': 'k','ĺ': 'l','ƚ': 'l','ɬ': 'l','ľ': 'l','ļ': 'l','ḽ': 'l','ȴ': 'l','ḷ': 'l','ḹ': 'l','ⱡ': 'l','ꝉ': 'l','ḻ': 'l','ŀ': 'l','ɫ': 'l',\n" +
								"'ᶅ': 'l','ɭ': 'l','ł': 'l','ǉ': 'lj','ſ': 's','ẜ': 's','ẛ': 's','ẝ': 's','ß': 'ss','ḿ': 'm','ṁ': 'm','ṃ': 'm','ɱ': 'm','ᵯ': 'm','ᶆ': 'm','ń': 'n','ň': 'n','ņ': 'n','ṋ': 'n',\n" +
								"'ȵ': 'n','ṅ': 'n','ṇ': 'n','ǹ': 'n','ɲ': 'n','ṉ': 'n','ƞ': 'n','ᵰ': 'n','ᶇ': 'n','ɳ': 'n','ñ': 'n','ǌ': 'nj','ó': 'o','ŏ': 'o','ǒ': 'o','ô': 'o','ố': 'o','ộ': 'o',\n" +
								"'ồ': 'o','ổ': 'o','ỗ': 'o','ö': 'o','ȫ': 'o','ȯ': 'o','ȱ': 'o','ọ': 'o','ő': 'o','ȍ': 'o','ò': 'o','ỏ': 'o','ơ': 'o','ớ': 'o','ợ': 'o','ờ': 'o','ở': 'o','ỡ': 'o',\n" +
								"'ȏ': 'o','ꝋ': 'o','ꝍ': 'o','ⱺ': 'o','ō': 'o','ṓ': 'o','ṑ': 'o','ǫ': 'o','ǭ': 'o','ø': 'o','ǿ': 'o','õ': 'o','ṍ': 'o','ṏ': 'o','ȭ': 'o','ƣ': 'oi','ꝏ': 'oo',\n" +
								"'ɛ': 'e','ᶓ': 'e','ɔ': 'o','ᶗ': 'o','ȣ': 'ou','ṕ': 'p','ṗ': 'p','ꝓ': 'p','ƥ': 'p','ᵱ': 'p','ᶈ': 'p','ꝕ': 'p','ᵽ': 'p','ꝑ': 'p','ꝙ': 'q','ʠ': 'q','ɋ': 'q',\n" +
								"'ꝗ': 'q','ŕ': 'r','ř': 'r','ŗ': 'r','ṙ': 'r','ṛ': 'r','ṝ': 'r','ȑ': 'r','ɾ': 'r','ᵳ': 'r','ȓ': 'r','ṟ': 'r','ɼ': 'r','ᵲ': 'r','ᶉ': 'r','ɍ': 'r','ɽ': 'r',\n" +
								"'ↄ': 'c','ꜿ': 'c','ɘ': 'e','ɿ': 'r','ś': 's','ṥ': 's','š': 's','ṧ': 's','ş': 's','ŝ': 's','ș': 's','ṡ': 's','ṣ': 's','ṩ': 's','ʂ': 's','ᵴ': 's','ᶊ': 's',\n" +
								"'ȿ': 's','ɡ': 'g','ᴑ': 'o','ᴓ': 'o','ᴝ': 'u','ť': 't','ţ': 't','ṱ': 't','ț': 't','ȶ': 't','ẗ': 't','ⱦ': 't','ṫ': 't','ṭ': 't','ƭ': 't','ṯ': 't','ᵵ': 't',\n" +
								"'ƫ': 't','ʈ': 't','ŧ': 't','ᵺ': 'th','ɐ': 'a','ᴂ': 'ae','ǝ': 'e','ᵷ': 'g','ɥ': 'h','ʮ': 'h','ʯ': 'h','ᴉ': 'i','ʞ': 'k','ꞁ': 'l','ɯ': 'm','ɰ': 'm','ᴔ': 'oe',\n" +
								"'ɹ': 'r','ɻ': 'r','ɺ': 'r','ⱹ': 'r','ʇ': 't','ʌ': 'v','ʍ': 'w','ʎ': 'y','ꜩ': 'tz','ú': 'u','ŭ': 'u','ǔ': 'u','û': 'u','ṷ': 'u','ü': 'u','ǘ': 'u','ǚ': 'u',\n" +
								"'ǜ': 'u','ǖ': 'u','ṳ': 'u','ụ': 'u','ű': 'u','ȕ': 'u','ù': 'u','ủ': 'u','ư': 'u','ứ': 'u','ự': 'u','ừ': 'u','ử': 'u','ữ': 'u','ȗ': 'u','ū': 'u','ṻ': 'u',\n" +
								"'ų': 'u','ᶙ': 'u','ů': 'u','ũ': 'u','ṹ': 'u','ṵ': 'u','ᵫ': 'ue','ꝸ': 'um','ⱴ': 'v','ꝟ': 'v','ṿ': 'v','ʋ': 'v','ᶌ': 'v','ⱱ': 'v','ṽ': 'v','ꝡ': 'vy','ẃ': 'w',\n" +
								"'ŵ': 'w','ẅ': 'w','ẇ': 'w','ẉ': 'w','ẁ': 'w','ⱳ': 'w','ẘ': 'w','ẍ': 'x','ẋ': 'x','ᶍ': 'x','ý': 'y','ŷ': 'y','ÿ': 'y','ẏ': 'y','ỵ': 'y','ỳ': 'y','ƴ': 'y',\n" +
								"'ỷ': 'y','ỿ': 'y','ȳ': 'y','ẙ': 'y','ɏ': 'y','ỹ': 'y','ź': 'z','ž': 'z','ẑ': 'z','ʑ': 'z','ⱬ': 'z','ż': 'z','ẓ': 'z','ȥ': 'z','ẕ': 'z','ᵶ': 'z','ᶎ': 'z',\n" +
								"'ʐ': 'z','ƶ': 'z','ɀ': 'z','ﬀ': 'ff','ﬃ': 'ffi','ﬄ': 'ffl','ﬁ': 'fi','ﬂ': 'fl','ĳ': 'ij','œ': 'oe','ﬆ': 'st','ₐ': 'a','ₑ': 'e','ᵢ': 'i','ⱼ': 'j',\n" +
								"'ₒ': 'o','ᵣ': 'r','ᵤ': 'u','ᵥ': 'v','ₓ': 'x'}\n" +
								'const acc = {}\n' +
								'if (doc.lastName || doc.firstName) {\n' +
								"emitNormalizedSubstrings((doc.lastName ? doc.lastName : '') + (doc.firstName ? doc.firstName : ''), doc, latinMap, acc)\n" +
								'}\n' +
								'if (doc.maidenName && doc.maidenName !== doc.lastName) {\n' +
								'emitNormalizedSubstrings(doc.maidenName, doc, latinMap, acc)\n' +
								'}\n' +
								'if (doc.spouseName && doc.spouseName !== doc.lastName) {\n' +
								'emitNormalizedSubstrings(doc.spouseName, doc, latinMap, acc)\n' +
								'}\n' +
								'const terms = Object.keys(acc)\n' +
								'terms.sort().forEach(function(t, idx) {\n' +
								'if (idx === terms.length - 1 || !(terms[idx + 1].indexOf(t) === 0)) {\n' +
								'emit(t, 1)\n' +
								'}\n' +
								'})' +
								'}'
						}
					}
				}
				this.database
					.get(ddoc._id)
					.then(dd => {
						if (!_.isEqual(ddoc.views, dd.views)) {
							const newDdoc = Object.assign(ddoc, { _rev: dd._rev })
							console.log('Updating Design doc to', newDdoc)
							return this.database.put(newDdoc).catch(e => console.log(e))
						}
					})
					.catch(() => {
						console.log('Creating ddoc')
						// TODO : fix any (definition in pouchDB is bad)
						this.database.put(ddoc).catch(e => console.log(e))
					})
			})
		}
		get host() {
			return this._host
		}
		get headers() {
			return this._headers
		}
		get database() {
			if (!this._database) {
				throw new Error('You must call init on iccapi before using the Pouchdb database')
			}
			return this._database
		}
		get latestSync() {
			return this._latestSync
		}
		get authicc() {
			return this._authicc
		}
		get patienticc() {
			return this._patienticc
		}
		get calendaritemicc() {
			return this._calendaritemicc
		}
		get timetableicc() {
			return this._timetableicc
		}
		get usericc() {
			return this._usericc
		}
		get hcpartyicc() {
			return this._hcpartyicc
		}
		get contacticc() {
			return this._contacticc
		}
		get cryptoicc() {
			return this._cryptoicc
		}
		get accesslogicc() {
			return this._accesslogicc
		}
		getPatient(id) {
			return __awaiter(this, void 0, void 0, function*() {
				const currentUser = yield this._usericc.getCurrentUser()
				if (!currentUser) {
					throw new Error('You are not logged in')
				}
				return this._patienticc.getPatientWithUser(currentUser, id)
			})
		}
		// TODO fix any to PatientStub
		search(term, limit) {
			return __awaiter(this, void 0, void 0, function*() {
				return this.database
					.query('Patient/by_search_string', {
						startkey: term,
						endkey: term + '\ufff0',
						limit: limit || 100,
						include_docs: true
					})
					.then(result => {
						return result.rows.map(
							r =>
								r.doc &&
								new icc_api_1.PatientDto(
									Object.assign(r.doc, { id: r.doc._id, rev: undefined })
								)
						)
					})
			})
		}
		sync(crypto, ts = 0, max = 10000) {
			return __awaiter(this, void 0, void 0, function*() {
				const currentUser = yield this._usericc.getCurrentUser()
				if (currentUser) {
					const paginator = (key, docId, limit) =>
						__awaiter(this, void 0, void 0, function*() {
							const pl = yield this.patienticc.listOfPatientsModifiedAfterWithUser(
								currentUser,
								this.latestSync,
								key || ts,
								docId || undefined,
								limit || 100
							)
							max -= pl.rows.length
							return {
								rows: pl.rows,
								nextKey: pl.nextKeyPair && pl.nextKeyPair.startKey,
								nextDocId: pl.nextKeyPair && pl.nextKeyPair.startKeyDocId,
								done: !pl.nextKeyPair || max <= 0
							}
						})
					const patList = yield this.getRowsUsingPagination(paginator)
					yield _.sortBy(patList, pat => -(pat.modified || 0)).reduce(
						(prev, remotePat) =>
							__awaiter(this, void 0, void 0, function*() {
								try {
									yield prev
								} catch (e) {
									console.log(e)
								}
								const keysToKeep = [
									'firstName',
									'lastName',
									'maidenName',
									'spouseName',
									'gender',
									'active',
									'dateOfBirth',
									'externalId',
									'addresses'
								]
								const filtered = Object.assign(
									keysToKeep
										.filter(key => Object.keys(remotePat).includes(key))
										.reduce((obj, key) => {
											return Object.assign({}, obj, { [key]: remotePat[key] })
										}, {}),
									{ _id: remotePat.id, upstreamRev: remotePat.rev }
								)
								if (
									remotePat.publicKey &&
									(!remotePat.delegations || !remotePat.delegations[remotePat.id])
								) {
									try {
										const [
											delSfks,
											ecKeys
										] = yield crypto.extractDelegationsSFKsAndEncryptionSKs(
											remotePat,
											currentUser.healthcarePartyId
										)
										remotePat =
											(yield this.patienticc.modifyPatientWithUser(
												currentUser,
												yield crypto.addDelegationsAndEncryptionKeys(
													null,
													remotePat,
													currentUser.healthcarePartyId,
													remotePat.id,
													delSfks[0],
													ecKeys[0]
												)
											)) || remotePat
									} catch (e) {
										console.warn('Cannot share patient', remotePat.id)
									}
								}
								if (filtered._id && filtered.lastName) {
									let localPat = null
									try {
										localPat = yield this.database.get(filtered._id)
									} catch (_a) {
										console.log(`Adding doc ${filtered._id}`)
										yield this.database.put(Object.assign(filtered))
									}
									if (localPat) {
										console.log(`Updating doc ${localPat._id}`)
										const localRev = localPat.upstreamRev
											? +localPat.upstreamRev.split('-')[0]
											: 0
										const remoteRev = remotePat.rev
											? +remotePat.rev.split('-')[0]
											: 0
										if (localRev < remoteRev) {
											yield this.database.put(
												Object.assign(filtered, { _rev: localPat._rev })
											)
										}
									}
								}
							}),
						Promise.resolve()
					)
				}
				console.log('sync done')
			})
		}
		getHcpIdForUserId(userId) {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this._hcpIdForUserIdCache) {
					this._hcpIdForUserIdCache = this.usericc
						.listUsers(undefined, undefined, '100')
						.then(({ rows }) =>
							rows.reduce((map, user) => {
								user.healthcarePartyId && (map[user.id] = user.healthcarePartyId)
								return map
							}, {})
						)
				}
				return (yield this._hcpIdForUserIdCache)[userId]
			})
		}
		getUserIdsWithRole(role, getRoles = user => user.roles || []) {
			return __awaiter(this, void 0, void 0, function*() {
				if (!this._userIdsWithRoleCache) {
					this._userIdsWithRoleCache = this.usericc
						.listUsers(undefined, undefined, '100')
						.then(({ rows }) =>
							rows.reduce((map, user) => {
								;(getRoles(user) || []).reduce((map, role) => {
									// tslint:disable-next-line:semicolon
									;(map[role] || (map[role] = [])).push(user.id)
									return map
								}, map)
								return map
							}, {})
						)
				}
				return (yield this._userIdsWithRoleCache)[role]
			})
		}
		getRowsUsingPagination(paginator, filter, startIdx, endIdx, cache) {
			return __awaiter(this, void 0, void 0, function*() {
				const executePaginator = (latestResult, acc, limit) =>
					__awaiter(this, void 0, void 0, function*() {
						const newResult = yield paginator(
							latestResult.nextKey,
							latestResult.nextDocId,
							endIdx && startIdx ? endIdx - startIdx : undefined
						)
						const rows =
							(filter
								? newResult.rows && newResult.rows.filter(filter)
								: newResult.rows) || []
						acc.push(...rows)
						if (newResult.done || (limit && acc.length >= limit)) {
							return {
								rows: acc,
								nextKey: newResult.nextKey,
								nextDocId: newResult.nextDocId,
								done: false
							}
						} else {
							return executePaginator(newResult, acc, limit)
						}
					})
				if (cache && startIdx && endIdx) {
					// Go through cache and build a list of existing rows (RowsChunks) and missing rows (MissingRowChunks)
					// The cache is a sparse structure sorted by index
					// At first, the cache is empty rows is going to be equal to [] and everything will be missing (see empty rows situation below)
					const [rows, lastKey, lastDocId, lastEndIdx] = cache.reduce(
						([rows, lastKey, lastDocId, lastEndIdx, lastTreatedIdx], chunk) => {
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
									rows.push({
										missing: [startOfZoi, endIdx],
										lastEndIdx,
										lastKey,
										lastDocId
									})
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
											rows: chunk.rows.slice(
												startOfZoi - chunk.startIdx,
												chunk.endIdx - chunk.startIdx
											),
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
											rows: chunk.rows.slice(
												startOfZoi - chunk.startIdx,
												endOfZoi - chunk.startIdx
											),
											nextKey: null,
											nextDocId: null
										})
										lastTreatedIdx = endOfZoi
									}
								} else {
									//  [--zoi--]
									//        [-chunk-]
									if (chunk.endIdx >= endOfZoi) {
										rows.push({
											missing: [startOfZoi, chunk.startIdx],
											lastEndIdx,
											lastKey,
											lastDocId
										})
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
										rows.push({
											missing: [startOfZoi, chunk.startIdx],
											lastEndIdx,
											lastKey,
											lastDocId
										})
										rows.push({
											startIdx: chunk.startIdx,
											endIdx: chunk.endIdx,
											rows: chunk.rows.slice(
												0,
												chunk.endIdx - chunk.startIdx
											),
											nextKey: null,
											nextDocId: null
										})
										lastTreatedIdx = chunk.endIdx
									}
								}
							}
							return [
								rows,
								chunk.nextKey,
								chunk.nextDocId,
								chunk.endIdx,
								lastTreatedIdx
							]
						},
						[[], null, null, 0, startIdx || 0]
					)
					if (!rows.length) {
						rows.push({
							missing: [startIdx, endIdx],
							lastKey: lastKey,
							lastDocId: lastDocId,
							lastEndIdx: lastEndIdx
						})
					} else {
						const lastRow = _.last(rows)
						if (
							lastRow &&
							lastRow.rows &&
							lastRow.startIdx + lastRow.rows.length < endIdx
						) {
							rows.push({
								missing: [lastRow.startIdx + lastRow.rows.length, endIdx],
								lastKey: lastKey,
								lastDocId: lastDocId,
								lastEndIdx: lastEndIdx
							})
						}
					}
					// Once we we have determined which where the missing chunks. Go fetch them based on the lastKey/lastDocId + the limit computed with the lastEndIndex
					yield Promise.all(
						rows
							.filter(r => r.missing)
							.map(r =>
								__awaiter(this, void 0, void 0, function*() {
									const missing = r
									const { rows, nextKey, nextDocId } = yield executePaginator(
										{
											nextKey: missing.lastKey,
											nextDocId: missing.lastDocId,
											rows: [],
											done: false
										},
										[],
										missing.missing[1] - missing.lastEndIdx
									)
									missing.rows = rows.slice(
										missing.missing[0] - missing.lastEndIdx,
										missing.missing[1] - missing.lastEndIdx
									)
									cache[missing.lastEndIdx] = {
										rows,
										startIdx: missing.missing[0],
										endIdx: missing.missing[1],
										nextKey,
										nextDocId
									}
								})
							)
					)
					return _.flatMap(rows, r => r.rows)
				} else {
					const { rows } = yield executePaginator(
						{
							nextKey: null,
							nextDocId: null,
							rows: [],
							done: false
						},
						[],
						undefined
					)
					return rows
				}
			})
		}
		moment(epochOrLongCalendar) {
			if (!epochOrLongCalendar && epochOrLongCalendar !== 0) {
				return null
			}
			if (epochOrLongCalendar >= 18000101 && epochOrLongCalendar < 25400000) {
				return moment('' + epochOrLongCalendar, 'YYYYMMDD')
			} else if (epochOrLongCalendar >= 18000101000000) {
				return moment('' + epochOrLongCalendar, 'YYYYMMDDHHmmss')
			} else {
				return moment(epochOrLongCalendar) // epoch or string
			}
		}
	}
	/*
        Factory method
    */
	function newIccApiPouched(host, username, password, headers, latestSync, cryptedKeys) {
		return new IccApiPouchedImpl(host, username, password, headers, latestSync, cryptedKeys)
	}
	iccapipouched.newIccApiPouched = newIccApiPouched
	function loadCurrentUserWithSessionCookie(host) {
		return new icc_user_x_api_1.IccUserXApi(host, {}).getCurrentUser()
	}
	iccapipouched.loadCurrentUserWithSessionCookie = loadCurrentUserWithSessionCookie
})((iccapipouched = exports.iccapipouched || (exports.iccapipouched = {})))
//# sourceMappingURL=index.js.map