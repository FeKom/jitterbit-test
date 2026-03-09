export interface CreateOrderDto {
	value: string
	items: CreateItemDto[]
}

export interface OrderDto {
	orderId: number
	value: string
	creationDate: Date
	items: ItemDto[]
}

export interface CreateItemDto {
	productId: number
	quantity: number
	price: string
}

export interface ItemDto {
	id: number
	orderId: number
	productId: number
	quantity: number
	price: string
}
