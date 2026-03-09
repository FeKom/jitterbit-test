// Input DTO — campos recebidos pela API (pt-BR)
export type CreateOrderInput = {
	numeroPedido: string
	valorTotal: number
	dataCriacao: string
	items: CreateItemInput[]
}

export type UpdateOrderInput = {
	valorTotal?: number
	dataCriacao?: string
	items?: CreateItemInput[]
}

export type CreateItemInput = {
	idItem: string
	quantidadeItem: number
	valorItem: number
}

// Domain DTO — campos mapeados para o banco (en)
export type CreateOrderDto = {
	orderId: string
	value: number
	creationDate: string
	items: CreateItemDto[]
}

export type UpdateOrderDto = {
	value?: number
	creationDate?: string
	items?: CreateItemDto[]
}

export type CreateItemDto = {
	productId: number
	quantity: number
	price: number
}
