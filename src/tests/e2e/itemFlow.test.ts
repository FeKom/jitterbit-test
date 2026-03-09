import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb, getAuthToken } from '../helpers/setup.js'

describe('E2E: Item flow', () => {
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

	it('deve executar fluxo completo: login → create order → add item → get items → update item → delete item', async () => {
		// 1. Get auth
		const token = await getAuthToken(app)
		const headers = { authorization: `Bearer ${token}` }

		// 2. Create order
		const orderRes = await app.inject({
			method: 'POST',
			url: '/order',
			headers,
			payload: {
				numeroPedido: 'E2E-ITEM-001',
				valorTotal: 100,
				dataCriacao: '2024-06-01T12:00:00.000Z',
				items: [],
			},
		})
		expect(orderRes.statusCode).toBe(201)

		// 3. Add item to order
		const itemRes = await app.inject({
			method: 'POST',
			url: '/order/E2E-ITEM-001/item',
			headers,
			payload: { idItem: '55', quantidadeItem: 3, valorItem: 33.33 },
		})
		expect(itemRes.statusCode).toBe(201)
		const itemId = itemRes.json().id
		expect(itemRes.json().productId).toBe(55)
		expect(itemRes.json().quantity).toBe(3)
		expect(itemRes.json().price).toBe('33.33')

		// 4. Get items by order
		const listRes = await app.inject({
			method: 'GET',
			url: '/order/E2E-ITEM-001/item',
			headers,
		})
		expect(listRes.statusCode).toBe(200)
		expect(listRes.json()).toHaveLength(1)

		// 5. Get item by ID
		const getRes = await app.inject({
			method: 'GET',
			url: `/item/${itemId}`,
			headers,
		})
		expect(getRes.statusCode).toBe(200)
		expect(getRes.json().id).toBe(itemId)

		// 6. Update item
		const updateRes = await app.inject({
			method: 'PUT',
			url: `/item/${itemId}`,
			headers,
			payload: { quantidadeItem: 10, valorItem: 99.99 },
		})
		expect(updateRes.statusCode).toBe(200)
		expect(updateRes.json().quantity).toBe(10)
		expect(updateRes.json().price).toBe('99.99')

		// 7. Delete item
		const deleteRes = await app.inject({
			method: 'DELETE',
			url: `/item/${itemId}`,
			headers,
		})
		expect(deleteRes.statusCode).toBe(204)

		// 8. Verify deleted
		const verifyRes = await app.inject({
			method: 'GET',
			url: `/item/${itemId}`,
			headers,
		})
		expect(verifyRes.statusCode).toBe(404)
	})
})
