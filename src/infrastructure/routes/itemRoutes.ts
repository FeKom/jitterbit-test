import {
	mapItemInput,
	mapItemOutput,
	mapUpdateItemInput,
} from '../../domain/items/mapper/itemMapper.js'
import * as itemsService from '../../domain/items/service/itemsService.js'
import type { CreateItemInput, UpdateItemInput } from '../../domain/items/type.js'
import { handleError } from '../errors/appError.js'
import type { Server } from '../types.js'

export default async function itemRoutes(server: Server) {
	// CREATE
	server.post<{ Params: { orderId: string }; Body: CreateItemInput }>(
		'/order/:orderId/item',
		async (request, reply) => {
			try {
				const mapped = mapItemInput(request.params.orderId, request.body)
				const item = await itemsService.createItem(mapped)

				return reply.status(201).send(mapItemOutput(item))
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode).send({ statusCode, message })
			}
		},
	)

	// READ ALL BY ORDER
	server.get<{ Params: { orderId: string } }>('/order/:orderId/item', async (request, reply) => {
		try {
			const items = await itemsService.getByOrderId(request.params.orderId)

			return items.map(mapItemOutput)
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return reply.status(statusCode).send({ statusCode, message })
		}
	})

	// READ BY ID
	server.get<{ Params: { id: string } }>('/item/:id', async (request, reply) => {
		try {
			const item = await itemsService.getById(Number(request.params.id))

			return mapItemOutput(item)
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return reply.status(statusCode).send({ statusCode, message })
		}
	})

	// UPDATE
	server.put<{ Params: { id: string }; Body: UpdateItemInput }>(
		'/item/:id',
		async (request, reply) => {
			try {
				const mapped = mapUpdateItemInput(request.body)
				const item = await itemsService.updateItem(Number(request.params.id), mapped)

				return mapItemOutput(item)
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode).send({ statusCode, message })
			}
		},
	)

	// DELETE
	server.delete<{ Params: { id: string } }>('/item/:id', async (request, reply) => {
		try {
			await itemsService.deleteItem(Number(request.params.id))

			return reply.status(204).send()
		} catch (error) {
			const { statusCode, message } = handleError(error)
			return reply.status(statusCode).send({ statusCode, message })
		}
	})
}
