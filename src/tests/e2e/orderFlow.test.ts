import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb } from '../helpers/setup.js'

describe('E2E: Order flow', () => {
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

	it('deve executar fluxo completo: register → login → create order → get → update → delete', async () => {
		// 1. Register
		const registerRes = await app.inject({
			method: 'POST',
			url: '/user/register',
			payload: { email: 'e2e-order@test.com', password: 'password123', name: 'E2E User' },
		})
		expect(registerRes.statusCode).toBe(201)

		// 2. Login
		const loginRes = await app.inject({
			method: 'POST',
			url: '/user/login',
			payload: { email: 'e2e-order@test.com', password: 'password123' },
		})
		expect(loginRes.statusCode).toBe(200)
		const token = loginRes.json().token

		const headers = { authorization: `Bearer ${token}` }

		// 3. Create order
		const createRes = await app.inject({
			method: 'POST',
			url: '/order',
			headers,
			payload: {
				numeroPedido: 'E2E-001',
				valorTotal: 250,
				dataCriacao: '2024-06-01T12:00:00.000Z',
				items: [
					{ idItem: '1', quantidadeItem: 2, valorItem: 100 },
					{ idItem: '2', quantidadeItem: 1, valorItem: 50 },
				],
			},
		})
		expect(createRes.statusCode).toBe(201)
		expect(createRes.json().orderId).toBe('E2E-001')
		expect(createRes.json().items).toHaveLength(2)

		// 4. Get order
		const getRes = await app.inject({
			method: 'GET',
			url: '/order/E2E-001',
			headers,
		})
		expect(getRes.statusCode).toBe(200)
		expect(getRes.json().orderId).toBe('E2E-001')
		expect(getRes.json().value).toBe('250.00')

		// 5. Update order
		const updateRes = await app.inject({
			method: 'PUT',
			url: '/order/E2E-001',
			headers,
			payload: { valorTotal: 500 },
		})
		expect(updateRes.statusCode).toBe(200)
		expect(updateRes.json().value).toBe('500.00')

		// 6. Delete order
		const deleteRes = await app.inject({
			method: 'DELETE',
			url: '/order/E2E-001',
			headers,
		})
		expect(deleteRes.statusCode).toBe(204)

		// 7. Verify deleted
		const verifyRes = await app.inject({
			method: 'GET',
			url: '/order/E2E-001',
			headers,
		})
		expect(verifyRes.statusCode).toBe(404)
	})
})
