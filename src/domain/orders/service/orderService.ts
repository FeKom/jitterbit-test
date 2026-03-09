import * as orderRepository from '../repository/orderRepository.js'
import type { CreateOrderDto, UpdateOrderDto } from '../type.js'

export async function createOrder(data: CreateOrderDto) {
	const existing = await orderRepository.findById(data.orderId)

	if (existing) {
		throw { statusCode: 409, message: `Order ${data.orderId} already exists` }
	}

	return orderRepository.create(data)
}

export async function getAll() {
	return orderRepository.findAll()
}

export async function getById(orderId: string) {
	const order = await orderRepository.findById(orderId)

	if (!order) {
		throw { statusCode: 404, message: `Order ${orderId} not found` }
	}

	return order
}

export async function updateOrder(orderId: string, data: UpdateOrderDto) {
	await getById(orderId)

	return orderRepository.update(orderId, data)
}

export async function deleteOrder(orderId: string) {
	await getById(orderId)

	return orderRepository.remove(orderId)
}
