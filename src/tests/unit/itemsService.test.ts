import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../../infrastructure/errors/appError.js'

vi.mock('../../domain/items/repository/itemRepository.js', () => ({
	create: vi.fn(),
	findByOrderId: vi.fn(),
	findById: vi.fn(),
	update: vi.fn(),
	remove: vi.fn(),
}))

vi.mock('../../domain/orders/repository/orderRepository.js', () => ({
	findById: vi.fn(),
}))

const itemRepository = await import('../../domain/items/repository/itemRepository.js')
const orderRepository = await import('../../domain/orders/repository/orderRepository.js')
const itemsService = await import('../../domain/items/service/itemsService.js')

const mockOrderFindById = vi.mocked(orderRepository.findById)
const mockItemCreate = vi.mocked(itemRepository.create)
const mockItemFindById = vi.mocked(itemRepository.findById)

afterEach(() => {
	vi.clearAllMocks()
})

describe('itemsService', () => {
	const fakeOrder = { orderId: 'ORD-001', value: 100, creationDate: new Date(), items: [] }
	const fakeItem = { id: 1, orderId: 'ORD-001', productId: 10, quantity: 2, price: 50 }

	it('deve criar item quando pedido existe', async () => {
		mockOrderFindById.mockResolvedValue(fakeOrder as never)
		mockItemCreate.mockResolvedValue(fakeItem as never)

		const data = { orderId: 'ORD-001', productId: 10, quantity: 2, price: 50 }
		const result = await itemsService.createItem(data)

		expect(mockOrderFindById).toHaveBeenCalledWith('ORD-001')
		expect(result).toEqual(fakeItem)
	})

	it('deve lançar 404 ao criar item em pedido inexistente', async () => {
		mockOrderFindById.mockResolvedValue(null)

		const data = { orderId: 'ORD-999', productId: 10, quantity: 2, price: 50 }
		await expect(itemsService.createItem(data)).rejects.toThrow(AppError)
	})

	it('deve lançar 404 ao buscar item inexistente', async () => {
		mockItemFindById.mockResolvedValue(null)

		await expect(itemsService.getById(999)).rejects.toMatchObject({ statusCode: 404 })
	})
})
