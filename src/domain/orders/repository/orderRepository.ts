import prisma from '../../../lib/prisma.js'
import type { CreateOrderDto, UpdateOrderDto } from '../type.js'

export async function create(data: CreateOrderDto) {
	return prisma.order.create({
		data: {
			orderId: data.orderId,
			value: data.value,
			creationDate: new Date(data.creationDate),
			items: {
				create: data.items.map((item) => ({
					productId: item.productId,
					quantity: item.quantity,
					price: item.price,
				})),
			},
		},
		include: { items: true },
	})
}

export async function findAll() {
	return prisma.order.findMany({
		include: { items: true },
		orderBy: { creationDate: 'desc' },
	})
}

export async function findById(orderId: string) {
	return prisma.order.findUnique({
		where: { orderId },
		include: { items: true },
	})
}

export async function update(orderId: string, data: UpdateOrderDto) {
	return prisma.$transaction(async (tx) => {
		if (data.items) {
			await tx.item.deleteMany({ where: { orderId } })
		}

		return tx.order.update({
			where: { orderId },
			data: {
				...(data.value !== undefined && { value: data.value }),
				...(data.creationDate !== undefined && { creationDate: new Date(data.creationDate) }),
				...(data.items && {
					items: {
						create: data.items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							price: item.price,
						})),
					},
				}),
			},
			include: { items: true },
		})
	})
}

export async function remove(orderId: string) {
	return prisma.order.delete({ where: { orderId } })
}
