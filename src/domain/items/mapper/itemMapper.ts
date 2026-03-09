import type { Decimal } from '../../../lib/generated/prisma/runtime/library.js'
import type { CreateItemDto, CreateItemInput, UpdateItemDto, UpdateItemInput } from '../type.js'

export function mapItemInput(orderId: string, input: CreateItemInput): CreateItemDto {
	return {
		orderId,
		productId: Number(input.idItem),
		quantity: input.quantidadeItem,
		price: input.valorItem,
	}
}

export function mapUpdateItemInput(input: UpdateItemInput): UpdateItemDto {
	return {
		...(input.quantidadeItem !== undefined && { quantity: input.quantidadeItem }),
		...(input.valorItem !== undefined && { price: input.valorItem }),
	}
}

type PrismaItem = {
	id: number
	orderId: string
	productId: number
	quantity: number
	price: Decimal
}

export function mapItemOutput(item: PrismaItem) {
	return {
		id: item.id,
		orderId: item.orderId,
		productId: item.productId,
		quantity: item.quantity,
		price: Number(item.price).toFixed(2),
	}
}
