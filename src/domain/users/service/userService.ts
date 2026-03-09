import bcrypt from 'bcryptjs'
import { AppError } from '../../../infrastructure/errors/appError.js'
import * as userRepository from '../repository/userRepository.js'
import type { CreateUserDto, LoginDto } from '../type.js'

export async function register(data: CreateUserDto) {
	const existing = await userRepository.findByEmail(data.email)

	if (existing) {
		throw new AppError(409, 'Este email já está cadastrado')
	}

	const hashedPassword = await bcrypt.hash(data.password, 10)

	const user = await userRepository.create({
		...data,
		password: hashedPassword,
	})

	return { id: user.id, email: user.email, name: user.name }
}

export async function login(data: LoginDto) {
	const user = await userRepository.findByEmail(data.email)

	if (!user) {
		throw new AppError(401, 'Email ou senha inválidos')
	}

	const valid = await bcrypt.compare(data.password, user.password)

	if (!valid) {
		throw new AppError(401, 'Email ou senha inválidos')
	}

	return { id: user.id, email: user.email, name: user.name }
}
