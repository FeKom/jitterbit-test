export type CreateUserDto = {
	email: string
	password: string
	name?: string
}

export type LoginDto = {
	email: string
	password: string
}

export type AuthResponse = {
	token: string
	user: {
		id: number
		email: string
		name: string | null
	}
}
