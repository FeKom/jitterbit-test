import * as userService from '../../domain/users/service/userService.js'
import type { CreateUserDto, LoginDto } from '../../domain/users/type.js'
import type { Server } from '../types.js'

export default async function userRoutes(server: Server) {
	server.post<{ Body: CreateUserDto }>('/user/register', async (request, reply) => {
		const user = await userService.register(request.body)
		const token = server.jwt.sign({ id: user.id, email: user.email })

		return reply.status(201).send({ token, user })
	})

	server.post<{ Body: LoginDto }>('/user/login', async (request, reply) => {
		const user = await userService.login(request.body)
		const token = server.jwt.sign({ id: user.id, email: user.email })

		return reply.send({ token, user })
	})

	server.get('/user/me', async (request) => {
		return request.user
	})
}
