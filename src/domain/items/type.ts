export type CreateItemDto = {
	productId: number
	quantity: number
	price: number
}

export type Item = {
	id: number
	orderId: string
	productId: number
	quantity: number
	price: string
}
