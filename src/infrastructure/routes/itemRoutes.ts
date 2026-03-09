import {
	mapItemInput,
	mapItemOutput,
	mapUpdateItemInput,
} from '../../domain/items/mapper/itemMapper.js'
import * as itemsService from '../../domain/items/service/itemsService.js'
import type { CreateItemInput, UpdateItemInput } from '../../domain/items/type.js'
import { handleError } from '../errors/appError.js'
import type { Server } from '../types.js'

const itemOutputSchema = {
	type: 'object',
	properties: {
		id: { type: 'number' },
		orderId: { type: 'string' },
		productId: { type: 'number' },
		quantity: { type: 'number' },
		price: { type: 'string' },
	},
}

const errorResponseSchema = {
	type: 'object',
	properties: {
		statusCode: { type: 'number' },
		message: { type: 'string' },
	},
}

export default async function itemRoutes(server: Server) {
	// CREATE
	server.post<{ Params: { orderId: string }; Body: CreateItemInput }>(
		'/order/:orderId/item',
		{
			schema: {
				tags: ['Items'],
				summary: 'Criar item em um pedido',
				params: {
					type: 'object',
					required: ['orderId'],
					properties: {
						orderId: { type: 'string' },
					},
				},
				body: {
					type: 'object',
					required: ['idItem', 'quantidadeItem', 'valorItem'],
					properties: {
						idItem: { type: 'string' },
						quantidadeItem: { type: 'number' },
						valorItem: { type: 'number' },
					},
				},
				response: {
					201: itemOutputSchema,
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const mapped = mapItemInput(request.params.orderId, request.body)
				const item = await itemsService.createItem(mapped)

				return reply.status(201).send(mapItemOutput(item))
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// READ ALL BY ORDER
	server.get<{ Params: { orderId: string } }>(
		'/order/:orderId/item',
		{
			schema: {
				tags: ['Items'],
				summary: 'Listar itens de um pedido',
				params: {
					type: 'object',
					required: ['orderId'],
					properties: {
						orderId: { type: 'string' },
					},
				},
				response: {
					200: { type: 'array', items: itemOutputSchema },
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const items = await itemsService.getByOrderId(request.params.orderId)

				return items.map(mapItemOutput)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// READ BY ID
	server.get<{ Params: { id: string } }>(
		'/item/:id',
		{
			schema: {
				tags: ['Items'],
				summary: 'Buscar item por ID',
				params: {
					type: 'object',
					required: ['id'],
					properties: {
						id: { type: 'string' },
					},
				},
				response: {
					200: itemOutputSchema,
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const item = await itemsService.getById(Number(request.params.id))

				return mapItemOutput(item)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// UPDATE
	server.put<{ Params: { id: string }; Body: UpdateItemInput }>(
		'/item/:id',
		{
			schema: {
				tags: ['Items'],
				summary: 'Atualizar item',
				params: {
					type: 'object',
					required: ['id'],
					properties: {
						id: { type: 'string' },
					},
				},
				body: {
					type: 'object',
					properties: {
						quantidadeItem: { type: 'number' },
						valorItem: { type: 'number' },
					},
				},
				response: {
					200: itemOutputSchema,
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const mapped = mapUpdateItemInput(request.body)
				const item = await itemsService.updateItem(Number(request.params.id), mapped)

				return mapItemOutput(item)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	// DELETE
	server.delete<{ Params: { id: string } }>(
		'/item/:id',
		{
			schema: {
				tags: ['Items'],
				summary: 'Deletar item',
				params: {
					type: 'object',
					required: ['id'],
					properties: {
						id: { type: 'string' },
					},
				},
				response: {
					204: { type: 'null', description: 'Item deletado' },
					404: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				await itemsService.deleteItem(Number(request.params.id))

				return reply.status(204).send()
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)
}
