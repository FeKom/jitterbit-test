import bcrypt from 'bcryptjs'
import * as userRepository from '../repository/userRepository.js'
import type { CreateUserDto, LoginDto } from '../type.js'

export async function register(data: CreateUserDto) {
	const existing = await userRepository.findByEmail(data.email)

	if (existing) {
		throw { statusCode: 409, message: 'Email already registered' }
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
		throw { statusCode: 401, message: 'Invalid credentials' }
	}

	const valid = await bcrypt.compare(data.password, user.password)

	if (!valid) {
		throw { statusCode: 401, message: 'Invalid credentials' }
	}

	return { id: user.id, email: user.email, name: user.name }
}
