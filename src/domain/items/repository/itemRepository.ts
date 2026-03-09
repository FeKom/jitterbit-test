import prisma from '../../../lib/prisma.js'
import type { CreateItemDto, UpdateItemDto } from '../type.js'

export async function create(data: CreateItemDto) {
	return prisma.item.create({
		data: {
			orderId: data.orderId,
			productId: data.productId,
			quantity: data.quantity,
			price: data.price,
		},
	})
}

export async function findByOrderId(orderId: string) {
	return prisma.item.findMany({
		where: { orderId },
	})
}

export async function findById(id: number) {
	return prisma.item.findUnique({
		where: { id },
	})
}

export async function update(id: number, data: UpdateItemDto) {
	return prisma.item.update({
		where: { id },
		data: {
			...(data.quantity !== undefined && { quantity: data.quantity }),
			...(data.price !== undefined && { price: data.price }),
		},
	})
}

export async function remove(id: number) {
	return prisma.item.delete({ where: { id } })
}
