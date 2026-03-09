export class AppError extends Error {
	statusCode: number

	constructor(statusCode: number, message: string) {
		super(message)
		this.statusCode = statusCode
	}
}

export function handleError(error: unknown) {
	if (error instanceof AppError) {
		return { statusCode: error.statusCode, message: error.message }
	}

	if (typeof error === 'object' && error !== null && 'statusCode' in error && 'message' in error) {
		const err = error as { statusCode: number; message: string }
		return { statusCode: err.statusCode, message: err.message }
	}

	return { statusCode: 500, message: 'Erro interno do servidor' }
}
