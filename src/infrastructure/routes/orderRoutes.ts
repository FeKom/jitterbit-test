import {
	mapOrderInput,
	mapOrderOutput,
	mapUpdateInput,
} from '../../domain/orders/mapper/orderMapper.js'
import * as orderService from '../../domain/orders/service/orderService.js'
import type { CreateOrderInput, UpdateOrderInput } from '../../domain/orders/type.js'
import type { Server } from '../types.js'

export default async function orderRoutes(server: Server) {
	// CREATE
	server.post<{ Body: CreateOrderInput }>('/order', async (request, reply) => {
		const mapped = mapOrderInput(request.body)
		const order = await orderService.createOrder(mapped)

		return reply.status(201).send(mapOrderOutput(order))
	})

	// READ ALL
	server.get('/order', async () => {
		const orders = await orderService.getAll()

		return orders.map(mapOrderOutput)
	})

	// READ BY ID
	server.get<{ Params: { orderId: string } }>('/order/:orderId', async (request) => {
		const order = await orderService.getById(request.params.orderId)

		return mapOrderOutput(order)
	})

	// UPDATE
	server.put<{ Params: { orderId: string }; Body: UpdateOrderInput }>(
		'/order/:orderId',
		async (request) => {
			const mapped = mapUpdateInput(request.body)
			const order = await orderService.updateOrder(request.params.orderId, mapped)

			return mapOrderOutput(order)
		},
	)

	// DELETE
	server.delete<{ Params: { orderId: string } }>('/order/:orderId', async (request, reply) => {
		await orderService.deleteOrder(request.params.orderId)

		return reply.status(204).send()
	})
}
