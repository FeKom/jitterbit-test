import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb } from '../helpers/setup.js'

describe('E2E: Auth flow', () => {
	const app = buildApp()

	beforeAll(async () => {
		await app.ready()
	})

	beforeEach(async () => {
		await cleanDb()
	})

	afterAll(async () => {
		await cleanDb()
		await app.close()
	})

	it('deve executar fluxo completo: register → login → access /me → access sem token → 401', async () => {
		// 1. Register
		const registerRes = await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'auth-e2e@test.com', password: 'password123', name: 'Auth User' },
		})
		expect(registerRes.statusCode).toBe(201)
		const registerBody = registerRes.json()
		expect(registerBody.token).toBeDefined()
		expect(registerBody.user.email).toBe('auth-e2e@test.com')

		// 2. Login
		const loginRes = await app.inject({
			method: 'POST',
			url: '/user/login',
			payload: { email: 'auth-e2e@test.com', password: 'password123' },
		})
		expect(loginRes.statusCode).toBe(200)
		const token = loginRes.json().token

		// 3. Access /me with token
		const meRes = await app.inject({
			method: 'GET',
			url: '/user/me',
			headers: { authorization: `Bearer ${token}` },
		})
		expect(meRes.statusCode).toBe(200)
		expect(meRes.json().email).toBe('auth-e2e@test.com')

		// 4. Access protected route without token → 401
		const noTokenRes = await app.inject({
			method: 'GET',
			url: '/user/me',
		})
		expect(noTokenRes.statusCode).toBe(401)

		// 5. Access protected route with invalid token → 401
		const badTokenRes = await app.inject({
			method: 'GET',
			url: '/user/me',
			headers: { authorization: 'Bearer invalid-token' },
		})
		expect(badTokenRes.statusCode).toBe(401)

		// 6. Access order route without token → 401
		const orderNoAuth = await app.inject({
			method: 'GET',
			url: '/order',
		})
		expect(orderNoAuth.statusCode).toBe(401)
	})
})
