import { AppError } from '../../../infrastructure/errors/appError.js'
import * as orderRepository from '../../orders/repository/orderRepository.js'
import * as itemRepository from '../repository/itemRepository.js'
import type { CreateItemDto, UpdateItemDto } from '../type.js'

export async function createItem(data: CreateItemDto) {
	const order = await orderRepository.findById(data.orderId)

	if (!order) {
		throw new AppError(404, `Pedido '${data.orderId}' não encontrado`)
	}

	return itemRepository.create(data)
}

export async function getByOrderId(orderId: string) {
	const order = await orderRepository.findById(orderId)

	if (!order) {
		throw new AppError(404, `Pedido '${orderId}' não encontrado`)
	}

	return itemRepository.findByOrderId(orderId)
}

export async function getById(id: number) {
	const item = await itemRepository.findById(id)

	if (!item) {
		throw new AppError(404, `Item '${id}' não encontrado`)
	}

	return item
}

export async function updateItem(id: number, data: UpdateItemDto) {
	await getById(id)

	return itemRepository.update(id, data)
}

export async function deleteItem(id: number) {
	await getById(id)

	return itemRepository.remove(id)
}
