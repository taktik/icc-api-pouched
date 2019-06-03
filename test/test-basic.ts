import { assert } from 'chai'
import { iccapipouched } from '../src'
import { XHR } from 'icc-api/icc-api/api/XHR'

describe('iccapipouched', () => {
	describe('newIccApiPouched', function() {
		it('should return an object', function() {
			const login = 'abdemo'
			const password = 'knalou'
			const host = 'https://backend.svc.icure.cloud/rest/v1/'
			const b64 = btoa(`${ login }:${ password }`)
			const headers: Array<XHR.Header> = {
				'cache-control': 'no-cache',
				Authorization: `Basic ${ b64 }`,
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
			const lastSync = 1559563185
			const databaseName = undefined
			const iccApiPouched = iccapipouched.newIccApiPouched(host, headers, lastSync, databaseName)
			assert.equal(typeof iccApiPouched, 'object')
		})
	})
})
