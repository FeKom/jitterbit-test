import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import fp from 'fastify-plugin'
import type { Server } from '../types.js'

async function swaggerPlugin(server: Server) {
	await server.register(swagger, {
		openapi: {
			info: {
				title: 'Jitterbit Teste API',
				description: 'API de pedidos e itens',
				version: '1.0.0',
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
					},
				},
			},
			security: [{ bearerAuth: [] }],
		},
	})

	await server.register(swaggerUi, {
		routePrefix: '/docs',
	})
}

export default fp(swaggerPlugin, { name: 'swagger' })
