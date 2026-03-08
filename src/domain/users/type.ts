export interface CreateUserDto {
	email: string
	password: string
	name?: string
}

export interface LoginDto {
	email: string
	password: string
}

export interface AuthResponse {
	token: string
	user: {
		id: number
		email: string
		name: string | null
	}
}
