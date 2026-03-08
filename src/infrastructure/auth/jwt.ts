import fastifyJwt from '@fastify/jwt'
import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'

const PUBLIC_ROUTES = ['/user/login', '/user/register']

async function jwtPlugin(server: FastifyInstance) {
	server.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || 'default-secret',
		sign: { expiresIn: '7d' },
	})

	server.addHook('onRequest', async (request, reply) => {
		const routePath = request.routeOptions.url

		if (routePath && PUBLIC_ROUTES.includes(routePath)) {
			return
		}

		await request.jwtVerify()
	})
}

export default fp(jwtPlugin, { name: 'jwt-auth' })
