import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppError } from '../../infrastructure/errors/appError.js'

vi.mock('../../domain/users/repository/userRepository.js', () => ({
	findByEmail: vi.fn(),
	create: vi.fn(),
}))

vi.mock('bcryptjs', () => ({
	default: {
		hash: vi.fn(),
		compare: vi.fn(),
	},
}))

const userRepository = await import('../../domain/users/repository/userRepository.js')
const bcrypt = (await import('bcryptjs')).default
const userService = await import('../../domain/users/service/userService.js')

const mockFindByEmail = vi.mocked(userRepository.findByEmail)
const mockCreate = vi.mocked(userRepository.create)
const mockHash = vi.mocked(bcrypt.hash)
const mockCompare = vi.mocked(bcrypt.compare)

afterEach(() => {
	vi.clearAllMocks()
})

describe('userService', () => {
	const fakeUser = {
		id: 1,
		email: 'test@test.com',
		password: 'hashed_pw',
		name: 'Test',
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	it('deve registrar novo usuário com senha hasheada', async () => {
		mockFindByEmail.mockResolvedValue(null)
		mockHash.mockResolvedValue('hashed_pw' as never)
		mockCreate.mockResolvedValue(fakeUser as never)

		const result = await userService.register({
			email: 'test@test.com',
			password: '123456',
			name: 'Test',
		})

		expect(mockHash).toHaveBeenCalledWith('123456', 10)
		expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test' })
	})

	it('deve lançar 409 se email já cadastrado', async () => {
		mockFindByEmail.mockResolvedValue(fakeUser as never)

		await expect(
			userService.register({ email: 'test@test.com', password: '123456' }),
		).rejects.toThrow(AppError)
	})

	it('deve retornar usuário com credenciais válidas', async () => {
		mockFindByEmail.mockResolvedValue(fakeUser as never)
		mockCompare.mockResolvedValue(true as never)

		const result = await userService.login({ email: 'test@test.com', password: '123456' })
		expect(result).toEqual({ id: 1, email: 'test@test.com', name: 'Test' })
	})

	it('deve lançar 401 com credenciais inválidas', async () => {
		mockFindByEmail.mockResolvedValue(null)

		await expect(
			userService.login({ email: 'wrong@test.com', password: '123456' }),
		).rejects.toMatchObject({ statusCode: 401 })
	})
})
