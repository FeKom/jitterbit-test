import { fastify } from 'fastify'
import jwtPlugin from '../../infrastructure/auth/jwt.js'
import itemRoutes from '../../infrastructure/routes/itemRoutes.js'
import orderRoutes from '../../infrastructure/routes/orderRoutes.js'
import userRoutes from '../../infrastructure/routes/userRoutes.js'
import swaggerPlugin from '../../infrastructure/swagger/swagger.js'
import prisma from '../../lib/prisma.js'

export function buildApp() {
	const app = fastify({
		logger: false,
		ignoreDuplicateSlashes: true,
		ignoreTrailingSlash: true,
		caseSensitive: false,
	})

	app.register(swaggerPlugin)
	app.register(jwtPlugin)
	app.register(userRoutes)
	app.register(orderRoutes)
	app.register(itemRoutes)

	return app
}

export async function getAuthToken(app: ReturnType<typeof buildApp>) {
	const email = `test-${Date.now()}@test.com`
	const password = 'password123'

	const res = await app.inject({
		method: 'POST',
		url: '/user/register',
		payload: { email, password, name: 'Test User' },
	})

	const body = res.json()
	return body.token as string
}

export async function cleanDb() {
	await prisma.item.deleteMany()
	await prisma.order.deleteMany()
	await prisma.user.deleteMany()
}
