import { assert } from 'chai'
import { iccapipouched } from '../src'

describe('iccapipouched', () => {
	describe('newIccApiPouched', function() {
		it('should return an object', function() {
			const login = 'abdemo'
			const password = 'knalou'
			const host = 'https://backend.svc.icure.cloud/rest/v1'
			const headers: any = {
				'cache-control': 'no-cache',
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
			const lastSync = 1559563185
			const databaseName = undefined
			const iccApiPouched = iccapipouched.newIccApiPouched(host, login, password, headers, lastSync, databaseName)

			assert.equal(typeof iccApiPouched, 'object')
		})
	}),
	describe('syncPatients', function() {
		this.timeout(120000)
		it('should sync a list of patients', async function() {
			const login = 'abdemo'
			const password = 'knalou'
			const host = 'https://backend.svc.icure.cloud/rest/v1'
			const headers: any = {
				'cache-control': 'no-cache',
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
			const lastSync = 0
			const databaseName = undefined
			const iccApiPouched = iccapipouched.newIccApiPouched(host, login, password, headers, lastSync, databaseName)

			await iccApiPouched.sync(500)

			const pats = await iccApiPouched.search('du')
			console.log('Search results', pats)
			assert.isAbove(pats.length, 10)
		})
	})
})
