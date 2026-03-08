import prisma from '../../../lib/prisma.js'
import type { CreateUserDto } from '../type.js'

export async function findByEmail(email: string) {
	return prisma.user.findUnique({ where: { email } })
}

export async function create(data: CreateUserDto) {
	return prisma.user.create({
		data: {
			email: data.email,
			password: data.password,
			name: data.name,
		},
	})
}
