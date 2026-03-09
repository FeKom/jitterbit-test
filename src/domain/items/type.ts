export type CreateItemInput = {
	idItem: string
	quantidadeItem: number
	valorItem: number
}

export type UpdateItemInput = {
	quantidadeItem?: number
	valorItem?: number
}

export type CreateItemDto = {
	orderId: string
	productId: number
	quantity: number
	price: number
}

export type UpdateItemDto = {
	quantity?: number
	price?: number
}
