import type { Decimal } from '../../../lib/generated/prisma/runtime/library.js'
import type { CreateOrderDto, CreateOrderInput, UpdateOrderDto, UpdateOrderInput } from '../type.js'

export function mapOrderInput(input: CreateOrderInput): CreateOrderDto {
	return {
		orderId: input.numeroPedido,
		value: input.valorTotal,
		creationDate: input.dataCriacao,
		items: input.items.map((item) => ({
			productId: Number(item.idItem),
			quantity: item.quantidadeItem,
			price: item.valorItem,
		})),
	}
}

export function mapUpdateInput(input: UpdateOrderInput): UpdateOrderDto {
	return {
		...(input.valorTotal !== undefined && { value: input.valorTotal }),
		...(input.dataCriacao !== undefined && { creationDate: input.dataCriacao }),
		...(input.items && {
			items: input.items.map((item) => ({
				productId: Number(item.idItem),
				quantity: item.quantidadeItem,
				price: item.valorItem,
			})),
		}),
	}
}

type PrismaOrder = {
	orderId: string
	value: Decimal
	creationDate: Date
	items: {
		id: number
		orderId: string
		productId: number
		quantity: number
		price: Decimal
	}[]
}

export function mapOrderOutput(order: PrismaOrder) {
	return {
		orderId: order.orderId,
		value: Number(order.value).toFixed(2),
		creationDate: order.creationDate,
		items: order.items.map((item) => ({
			productId: item.productId,
			quantity: item.quantity,
			price: Number(item.price).toFixed(2),
		})),
	}
}
