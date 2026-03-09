import fastifyJwt from '@fastify/jwt'
import fp from 'fastify-plugin'
import type { Server } from '../types.js'

const PUBLIC_ROUTES = ['/user/login', '/user/register']

async function jwtPlugin(server: Server) {
	server.register(fastifyJwt, {
		secret: process.env.JWT_SECRET || 'default-secret',
		sign: { expiresIn: '7d' },
	})

	server.addHook('onRequest', async (request, reply) => {
		const routePath = request.routeOptions.url

		if (routePath && (PUBLIC_ROUTES.includes(routePath) || routePath.startsWith('/docs'))) {
			return
		}

		await request.jwtVerify()
	})
}

export default fp(jwtPlugin, { name: 'jwt-auth' })
