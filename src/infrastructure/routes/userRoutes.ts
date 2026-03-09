import * as userService from '../../domain/users/service/userService.js'
import type { CreateUserDto, LoginDto } from '../../domain/users/type.js'
import { handleError } from '../errors/appError.js'
import type { Server } from '../types.js'

const userResponseSchema = {
	type: 'object',
	properties: {
		id: { type: 'number' },
		email: { type: 'string' },
		name: { type: 'string', nullable: true },
	},
}

const authResponseSchema = {
	type: 'object',
	properties: {
		token: { type: 'string' },
		user: userResponseSchema,
	},
}

const errorResponseSchema = {
	type: 'object',
	properties: {
		statusCode: { type: 'number' },
		message: { type: 'string' },
	},
}

export default async function userRoutes(server: Server) {
	server.post<{ Body: CreateUserDto }>(
		'/user/register',
		{
			schema: {
				tags: ['Users'],
				summary: 'Registrar novo usuário',
				security: [],
				body: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						password: { type: 'string', minLength: 6 },
						name: { type: 'string' },
					},
				},
				response: {
					201: authResponseSchema,
					409: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const user = await userService.register(request.body)
				const token = server.jwt.sign({ id: user.id, email: user.email })

				return reply.status(201).send({ token, user })
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	server.post<{ Body: LoginDto }>(
		'/user/login',
		{
			schema: {
				tags: ['Users'],
				summary: 'Login do usuário',
				security: [],
				body: {
					type: 'object',
					required: ['email', 'password'],
					properties: {
						email: { type: 'string', format: 'email' },
						password: { type: 'string' },
					},
				},
				response: {
					200: authResponseSchema,
					401: errorResponseSchema,
					500: errorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			try {
				const user = await userService.login(request.body)
				const token = server.jwt.sign({ id: user.id, email: user.email })

				return reply.send({ token, user })
			} catch (error) {
				const { statusCode, message } = handleError(error)
				return reply.status(statusCode as 500).send({ statusCode, message })
			}
		},
	)

	server.get(
		'/user/me',
		{
			schema: {
				tags: ['Users'],
				summary: 'Obter usuário autenticado',
				response: {
					200: {
						type: 'object',
						properties: {
							id: { type: 'number' },
							email: { type: 'string' },
						},
					},
					401: errorResponseSchema,
				},
			},
		},
		async (request) => {
			return request.user
		},
	)
}
