import { assert } from 'chai'
import { iccapipouched } from '../src'

describe('iccapipouched', () => {
	describe('newIccApiPouched', function() {
		it('should return an object', function() {
			// TODO: Q AD
			// host: svc.backendblallbalbla
			// headers minimum authorization en basic
			// lastsync c'est ici
			const iccApiPouched = iccapipouched.newIccApiPouched()
			assert.equal(typeof iccApiPouched, 'object')
		})
	})
})
