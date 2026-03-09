import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb } from '../helpers/setup.js'

describe('User endpoints (integration)', () => {
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

	it('POST /user/register - deve registrar novo usuário e retornar token', async () => {
		const res = await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'new@test.com', password: 'password123', name: 'Test' },
		})

		expect(res.statusCode).toBe(201)
		const body = res.json()
		expect(body.token).toBeDefined()
		expect(body.user.email).toBe('new@test.com')
	})

	it('POST /user/register - deve retornar 409 ao registrar email duplicado', async () => {
		await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'dup@test.com', password: 'password123' },
		})

		const res = await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'dup@test.com', password: 'password123' },
		})

		expect(res.statusCode).toBe(409)
	})

	it('POST /user/login - deve fazer login com credenciais válidas', async () => {
		await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'login@test.com', password: 'password123' },
		})

		const res = await app.inject({
			method: 'POST',
			url: '/user/login',
			payload: { email: 'login@test.com', password: 'password123' },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json().token).toBeDefined()
	})

	it('POST /user/login - deve retornar 401 com senha incorreta', async () => {
		await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'login2@test.com', password: 'password123' },
		})

		const res = await app.inject({
			method: 'POST',
			url: '/user/login',
			payload: { email: 'login2@test.com', password: 'wrong' },
		})

		expect(res.statusCode).toBe(401)
	})

	it('GET /user/me - deve retornar dados do usuário autenticado', async () => {
		const regRes = await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'me@test.com', password: 'password123' },
		})
		const token = regRes.json().token

		const res = await app.inject({
			method: 'GET',
			url: '/user/me',
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json().email).toBe('me@test.com')
	})
})
