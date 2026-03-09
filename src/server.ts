import { fastify } from 'fastify'
import jwtPlugin from './infrastructure/auth/jwt.js'
import orderRoutes from './infrastructure/routes/orderRoutes.js'
import userRoutes from './infrastructure/routes/userRoutes.js'

const server = fastify({
	logger: true,
	ignoreDuplicateSlashes: true,
	ignoreTrailingSlash: true,
	caseSensitive: false,
	connectionTimeout: 120000,
	requestTimeout: 120000,
	keepAliveTimeout: 10000,
})

server.register(jwtPlugin)
server.register(userRoutes)
server.register(orderRoutes)

const port = Number(process.env.PORT) || 3000

server.listen({ port, host: '0.0.0.0' }, (err, address) => {
	if (err) {
		server.log.error(err)
		process.exit(1)
	}
	server.log.info(`Server listening at ${address}`)
})
