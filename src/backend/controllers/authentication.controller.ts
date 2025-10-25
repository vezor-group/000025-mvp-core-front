import {
	type AuthResponse,
	type SignInRequest,
	type SignUpRequest,
	signInRequestSchema,
	signUpRequestSchema,
} from '../types/authentication.type'
import { CoreController } from './core.controller'

export default class AuthenticationController extends CoreController {
	/**
	 * Realiza login do usuário
	 * @param data - Dados de signin (email, password, providerAuth)
	 * @returns Token de acesso e refresh token
	 */
	async signIn(data: SignInRequest): Promise<AuthResponse> {
		// Valida os dados com Zod antes de enviar
		const validatedData = signInRequestSchema.parse(data)

		return this.post<AuthResponse>('/api/v1/signin', validatedData)
	}

	/**
	 * Registra novo usuário
	 * @param data - Dados de signup (name, email, password, providerAuth)
	 * @returns Token de acesso e refresh token
	 */
	async signUp(data: SignUpRequest): Promise<AuthResponse> {
		// Valida os dados com Zod antes de enviar
		const validatedData = signUpRequestSchema.parse(data)

		return this.post<AuthResponse>('/api/v1/signup', validatedData)
	}

	/**
	 * Obtém informações do usuário autenticado
	 * @param authorization - Token de autorização (Bearer token)
	 * @returns Informações do usuário (string)
	 */
	async getMe(authorization: string): Promise<string> {
		return this.get<string>('/api/v1/me', {
			Authorization: authorization,
		})
	}

	/**
	 * Atualiza o token de acesso usando refresh token
	 * @param refreshToken - Refresh token válido
	 * @returns Novo token de acesso
	 */
	async refreshToken(refreshToken: string): Promise<string> {
		return this.post<string>('/api/v1/refresh', {
			refresh_token: refreshToken,
		})
	}
}
