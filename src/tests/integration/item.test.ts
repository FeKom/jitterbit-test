import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb, getAuthToken } from '../helpers/setup.js'

describe('Item endpoints (integration)', () => {
	const app = buildApp()
	let token: string

	beforeAll(async () => {
		await app.ready()
	})

	beforeEach(async () => {
		await cleanDb()
		token = await getAuthToken(app)

		await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: {
				numeroPedido: 'ORD-ITEM',
				valorTotal: 100,
				dataCriacao: '2024-01-01T00:00:00.000Z',
				items: [],
			},
		})
	})

	afterAll(async () => {
		await cleanDb()
		await app.close()
	})

	const itemPayload = { idItem: '42', quantidadeItem: 3, valorItem: 29.9 }

	it('POST /order/:orderId/item - deve criar item', async () => {
		const res = await app.inject({
			method: 'POST',
			url: '/order/ORD-ITEM/item',
			headers: { authorization: `Bearer ${token}` },
			payload: itemPayload,
		})

		expect(res.statusCode).toBe(201)
		expect(res.json().productId).toBe(42)
		expect(res.json().price).toBe('29.90')
	})

	it('POST /order/:orderId/item - deve retornar 404 para pedido inexistente', async () => {
		const res = await app.inject({
			method: 'POST',
			url: '/order/NOT-FOUND/item',
			headers: { authorization: `Bearer ${token}` },
			payload: itemPayload,
		})

		expect(res.statusCode).toBe(404)
	})

	it('GET /order/:orderId/item - deve listar itens do pedido', async () => {
		await app.inject({
			method: 'POST',
			url: '/order/ORD-ITEM/item',
			headers: { authorization: `Bearer ${token}` },
			payload: itemPayload,
		})

		const res = await app.inject({
			method: 'GET',
			url: '/order/ORD-ITEM/item',
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json()).toHaveLength(1)
	})

	it('PUT /item/:id - deve atualizar item', async () => {
		const createRes = await app.inject({
			method: 'POST',
			url: '/order/ORD-ITEM/item',
			headers: { authorization: `Bearer ${token}` },
			payload: itemPayload,
		})
		const itemId = createRes.json().id

		const res = await app.inject({
			method: 'PUT',
			url: `/item/${itemId}`,
			headers: { authorization: `Bearer ${token}` },
			payload: { quantidadeItem: 10, valorItem: 50 },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json().quantity).toBe(10)
	})

	it('DELETE /item/:id - deve deletar item', async () => {
		const createRes = await app.inject({
			method: 'POST',
			url: '/order/ORD-ITEM/item',
			headers: { authorization: `Bearer ${token}` },
			payload: itemPayload,
		})
		const itemId = createRes.json().id

		const res = await app.inject({
			method: 'DELETE',
			url: `/item/${itemId}`,
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(204)
	})
})
