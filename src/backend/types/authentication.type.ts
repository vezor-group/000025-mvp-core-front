import { z } from 'zod'

// Schemas
export const providerAuthSchema = z.enum(['basic', 'google', 'microsoft'])

export const signInRequestSchema = z.object({
	providerAuth: providerAuthSchema,
	email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
	password: z.string().min(1, 'Senha é obrigatória'),
	senhaHash: z.string().optional(),
})

export const signUpRequestSchema = z.object({
	providerAuth: providerAuthSchema,
	name: z
		.string()
		.min(1, 'Nome é obrigatório')
		.min(3, 'Nome deve ter no mínimo 3 caracteres'),
	email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
	password: z
		.string()
		.min(1, 'Senha é obrigatória')
		.min(6, 'Senha deve ter no mínimo 6 caracteres'),
	providerId: z.string().optional(),
})

// Schema para resposta padrão da API
export const authResponseSchema = z.object({
	sucess: z.boolean(),
	message: z.string(),
	data: z.object({}).optional(),
	errors: z.string().optional(),
})

// Tipos inferidos dos schemas
export type ProviderAuth = z.infer<typeof providerAuthSchema>
export type SignInRequest = z.infer<typeof signInRequestSchema>
export type SignUpRequest = z.infer<typeof signUpRequestSchema>
export type AuthResponse = z.infer<typeof authResponseSchema>
