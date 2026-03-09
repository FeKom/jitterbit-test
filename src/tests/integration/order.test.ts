import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { buildApp, cleanDb, getAuthToken } from '../helpers/setup.js'

describe('Order endpoints (integration)', () => {
	const app = buildApp()
	let token: string

	beforeAll(async () => {
		await app.ready()
	})

	beforeEach(async () => {
		await cleanDb()
		token = await getAuthToken(app)
	})

	afterAll(async () => {
		await cleanDb()
		await app.close()
	})

	const orderPayload = {
		numeroPedido: 'ORD-001',
		valorTotal: 150.5,
		dataCriacao: '2024-01-15T10:00:00.000Z',
		items: [{ idItem: '10', quantidadeItem: 2, valorItem: 75.25 }],
	}

	it('POST /order - deve criar pedido com sucesso', async () => {
		const res = await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		expect(res.statusCode).toBe(201)
		expect(res.json().orderId).toBe('ORD-001')
		expect(res.json().value).toBe('150.50')
	})

	it('POST /order - deve retornar 409 ao criar pedido duplicado', async () => {
		await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		const res = await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		expect(res.statusCode).toBe(409)
	})

	it('GET /order - deve listar pedidos', async () => {
		await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		const res = await app.inject({
			method: 'GET',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json()).toHaveLength(1)
	})

	it('GET /order/:orderId - deve retornar 404 para pedido inexistente', async () => {
		const res = await app.inject({
			method: 'GET',
			url: '/order/NOT-FOUND',
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(404)
	})

	it('PUT /order/:orderId - deve atualizar pedido existente', async () => {
		await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		const res = await app.inject({
			method: 'PUT',
			url: '/order/ORD-001',
			headers: { authorization: `Bearer ${token}` },
			payload: { valorTotal: 999.99 },
		})

		expect(res.statusCode).toBe(200)
		expect(res.json().value).toBe('999.99')
	})

	it('DELETE /order/:orderId - deve deletar pedido existente', async () => {
		await app.inject({
			method: 'POST',
			url: '/order',
			headers: { authorization: `Bearer ${token}` },
			payload: orderPayload,
		})

		const res = await app.inject({
			method: 'DELETE',
			url: '/order/ORD-001',
			headers: { authorization: `Bearer ${token}` },
		})

		expect(res.statusCode).toBe(204)
	})
})
