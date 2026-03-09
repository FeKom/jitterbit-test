import {
	mapOrderInput,
	mapOrderOutput,
	mapUpdateInput,
} from '../../domain/orders/mapper/orderMapper.js'
import * as orderService from '../../domain/orders/service/orderService.js'
import type { CreateOrderInput, UpdateOrderInput } from '../../domain/orders/type.js'
import { handleError } from '../errors/appError.js'
import type { Server } from '../types.js'

const itemSchema = {
	type: 'object',
	properties: {
		idItem: { type: 'string' },
		quantidadeItem: { type: 'number' },
		valorItem: { type: 'number' },
	},
	required: ['idItem', 'quantidadeItem', 'valorItem'],
}

const orderOutputSchema = {
	type: 'object',
	properties: {
		orderId: { type: 'string' },
		value: { type: 'string' },
		creationDate: { type: 'string', format: 'date-time' },
		items: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					productId: { type: 'number' },
					quantity: { type: 'number' },
					price: { type: 'string' },
				},
			},
		},
	},
}

const errorResponseSchema = {
	type: 'object',
	properties: {
		statusCode: { type: 'number' },
		message: { type: 'string' },
	},
}

export default async function orderRoutes(server: Server) {
	// CREATE
	server.post<{ Body: CreateOrderInput }>(
		'/order',
		{
			schema: {
				tags: ['Orders'],
				summary: 'Criar pedido',
				body: {
					type: 'object',
					required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
					properties: {
						numeroPedido: { type: 'string' },
						valorTotal: { type: 'number' },
						dataCriacao: { type: 'string', format: 'date-time' },
						items: { type: 'array', items: itemSchema },
					},
				},
				response: {
					201: orderOutputSchema,
					409: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const mapped = mapOrderInput(request.body)
				const order = await orderService.createOrder(mapped)

				return reply.status(201).send(mapOrderOutput(order))
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// READ ALL
	server.get(
		'/order',
		{
			schema: {
				tags: ['Orders'],
				summary: 'Listar todos os pedidos',
				response: {
					200: { type: 'array', items: orderOutputSchema },
					500: errorResponseSchema,
				},
			},
		},
		async (_request, reply) => {
			try {
				const orders = await orderService.getAll()

				return orders.map(mapOrderOutput)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// READ BY ID
	server.get<{ Params: { orderId: string } }>(
		'/order/:orderId',
		{
			schema: {
				tags: ['Orders'],
				summary: 'Buscar pedido por ID',
				params: {
					type: 'object',
					required: ['orderId'],
					properties: {
						orderId: { type: 'string' },
					},
				},
				response: {
					200: orderOutputSchema,
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const order = await orderService.getById(request.params.orderId)

				return mapOrderOutput(order)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// UPDATE
	server.put<{ Params: { orderId: string }; Body: UpdateOrderInput }>(
		'/order/:orderId',
		{
			schema: {
				tags: ['Orders'],
				summary: 'Atualizar pedido',
				params: {
					type: 'object',
					required: ['orderId'],
					properties: {
						orderId: { type: 'string' },
					},
				},
				body: {
					type: 'object',
					properties: {
						valorTotal: { type: 'number' },
						dataCriacao: { type: 'string', format: 'date-time' },
						items: { type: 'array', items: itemSchema },
					},
				},
				response: {
					200: orderOutputSchema,
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const mapped = mapUpdateInput(request.body)
				const order = await orderService.updateOrder(request.params.orderId, mapped)

				return mapOrderOutput(order)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// DELETE
	server.delete<{ Params: { orderId: string } }>(
		'/order/:orderId',
		{
			schema: {
				tags: ['Orders'],
				summary: 'Deletar pedido',
				params: {
					type: 'object',
					required: ['orderId'],
					properties: {
						orderId: { type: 'string' },
					},
				},
				response: {
					204: { type: 'null', description: 'Pedido deletado' },
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				await orderService.deleteOrder(request.params.orderId)

				return reply.status(204).send()
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)
}
