import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export type Server = FastifyInstance
export type ServerRequest = FastifyRequest
export type ServerResponse = FastifyReply

export interface JwtPayload {
	id: number
	email: string
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		payload: JwtPayload
		user: JwtPayload
	}
}
