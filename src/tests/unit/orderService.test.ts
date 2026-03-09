import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../../infrastructure/errors/appError.js'

vi.mock('../../domain/orders/repository/orderRepository.js', () => ({
	findById: vi.fn(),
	findAll: vi.fn(),
	create: vi.fn(),
	update: vi.fn(),
	remove: vi.fn(),
}))

const orderRepository = await import('../../domain/orders/repository/orderRepository.js')
const orderService = await import('../../domain/orders/service/orderService.js')

const mockFindById = vi.mocked(orderRepository.findById)
const mockCreate = vi.mocked(orderRepository.create)
const mockRemove = vi.mocked(orderRepository.remove)

afterEach(() => {
	vi.clearAllMocks()
})

describe('orderService', () => {
	const fakeOrder = {
		orderId: 'ORD-001',
		value: 100 as never,
		creationDate: new Date(),
		items: [],
	}

	it('deve criar pedido quando não existe', async () => {
		mockFindById.mockResolvedValue(null)
		mockCreate.mockResolvedValue(fakeOrder as never)

		const data = { orderId: 'ORD-001', value: 100, creationDate: '2024-01-01', items: [] }
		const result = await orderService.createOrder(data)

		expect(mockFindById).toHaveBeenCalledWith('ORD-001')
		expect(result).toEqual(fakeOrder)
	})

	it('deve lançar 409 se pedido já existe', async () => {
		mockFindById.mockResolvedValue(fakeOrder as never)

		const data = { orderId: 'ORD-001', value: 100, creationDate: '2024-01-01', items: [] }
		await expect(orderService.createOrder(data)).rejects.toThrow(AppError)
	})

	it('deve lançar 404 ao buscar pedido inexistente', async () => {
		mockFindById.mockResolvedValue(null)

		await expect(orderService.getById('ORD-999')).rejects.toMatchObject({ statusCode: 404 })
	})

	it('deve lançar 404 ao deletar pedido inexistente', async () => {
		mockFindById.mockResolvedValue(null)

		await expect(orderService.deleteOrder('ORD-999')).rejects.toMatchObject({ statusCode: 404 })
	})

	it('deve deletar pedido existente', async () => {
		mockFindById.mockResolvedValue(fakeOrder as never)
		mockRemove.mockResolvedValue(fakeOrder as never)

		await orderService.deleteOrder('ORD-001')
		expect(mockRemove).toHaveBeenCalledWith('ORD-001')
	})
})
