/**
 * Utilitários para autenticação e validação de tokens
 */

// ===== CONSTANTES =====
const TOKEN_KEYS = {
	ACCESS: 'access_token',
	REFRESH: 'refresh_token',
} as const

const TOKEN_EXPIRY = {
	ACCESS_DEFAULT: 24 * 60 * 60 * 1000, // 24 horas em ms
	REFRESH_DEFAULT: 7 * 24 * 60 * 60 * 1000, // 7 dias em ms
} as const

// ===== TIPOS =====
declare global {
	interface Window {
		debugAuth: typeof debugAuth
		forceLogout: typeof forceLogout
	}
}

// ===== HELPERS PRIVADOS =====
/**
 * Verifica se está rodando no browser
 */
function isBrowser(): boolean {
	return typeof window !== 'undefined'
}

/**
 * Formata token para exibição (primeiros 20 caracteres)
 */
function formatTokenForDisplay(token: string | null): string {
	return token ? `presente (${token.slice(0, 20)}...)` : 'ausente'
}

/**
 * Abstração segura para manipulação de cookies
 * Encapsula o acesso direto a document.cookie
 */
const CookieManager = {
	/**
	 * Define um cookie
	 */
	set(name: string, value: string, expiresDate: Date): void {
		const expires = expiresDate.toUTCString()
		document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Lax`
	},

	/**
	 * Remove um cookie (define com data de expiração no passado)
	 */
	delete(name: string): void {
		const cookieOptions = [
			'path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC',
			`path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC`,
			'expires=Thu, 01 Jan 1970 00:00:00 UTC',
		]

		cookieOptions.forEach((options) => {
			document.cookie = `${name}=; ${options}`
		})
	},

	/**
	 * Remove um cookie com todas as variações possíveis (força bruta)
	 */
	forceDelete(name: string, domains: string[], paths: string[]): void {
		domains.forEach((domain) => {
			paths.forEach((path) => {
				const options = [
					'expires=Thu, 01 Jan 1970 00:00:00 UTC',
					path ? `path=${path}` : '',
					domain ? `domain=${domain}` : '',
				]
					.filter(Boolean)
					.join('; ')

				document.cookie = `${name}=; ${options}`
			})
		})
	},

	/**
	 * Obtém todos os cookies parseados
	 */
	getAll(): Record<string, string> {
		return document.cookie.split(';').reduce(
			(acc, cookie) => {
				const [key, value] = cookie.trim().split('=')
				if (key) acc[key] = value || ''
				return acc
			},
			{} as Record<string, string>,
		)
	},

	/**
	 * Obtém string bruta de todos os cookies
	 */
	getRaw(): string {
		return document.cookie
	},
}

/**
 * Remove um item específico do localStorage e cookies
 */
function removeTokenFromStorage(tokenName: string): void {
	localStorage.removeItem(tokenName)
	CookieManager.delete(tokenName)
}

// ===== FUNÇÕES PÚBLICAS =====

/**
 * Decodifica um JWT (sem validar assinatura - apenas para ler dados)
 */
export function decodeJWT(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) {
			return null
		}

		const payload = parts[1]
		const decoded = Buffer.from(payload, 'base64').toString('utf-8')
		return JSON.parse(decoded)
	} catch {
		return null
	}
}

/**
 * Verifica se um token JWT está expirado
 */
export function isTokenExpired(token: string): boolean {
	const decoded = decodeJWT(token)

	if (!decoded || !decoded.exp) {
		return true
	}

	const expirationTime = decoded.exp as number
	const currentTime = Math.floor(Date.now() / 1000)

	return currentTime >= expirationTime
}

/**
 * Obtém o access_token do localStorage (apenas client-side)
 */
export function getAccessToken(): string | null {
	if (!isBrowser()) return null
	return localStorage.getItem(TOKEN_KEYS.ACCESS)
}

/**
 * Obtém o refresh_token do localStorage (apenas client-side)
 */
export function getRefreshToken(): string | null {
	if (!isBrowser()) return null
	return localStorage.getItem(TOKEN_KEYS.REFRESH)
}

/**
 * Salva tokens no localStorage E nos cookies
 * Cookies são necessários para o middleware do Next.js
 */
export function setTokens(accessToken: string, refreshToken: string): void {
	if (!isBrowser()) return

	// Salva no localStorage (para componentes client-side)
	localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken)
	localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken)

	// Calcula expiração do access_token baseado no JWT
	const decoded = decodeJWT(accessToken)
	const accessExpires = decoded?.exp
		? new Date((decoded.exp as number) * 1000)
		: new Date(Date.now() + TOKEN_EXPIRY.ACCESS_DEFAULT)

	// Refresh token expira em 7 dias
	const refreshExpires = new Date(Date.now() + TOKEN_EXPIRY.REFRESH_DEFAULT)

	// Salva nos cookies (para middleware)
	CookieManager.set(TOKEN_KEYS.ACCESS, accessToken, accessExpires)
	CookieManager.set(TOKEN_KEYS.REFRESH, refreshToken, refreshExpires)
}

/**
 * Remove tokens do localStorage e cookies (logout)
 */
export function clearTokens(): void {
	if (!isBrowser()) return

	removeTokenFromStorage(TOKEN_KEYS.ACCESS)
	removeTokenFromStorage(TOKEN_KEYS.REFRESH)

	console.log('[Auth] Tokens removidos (localStorage + cookies)')
}

/**
 * Verifica se o usuário está autenticado
 * Valida se existe token e se ele não está expirado
 */
export function isAuthenticated(): boolean {
	const token = getAccessToken()

	if (!token) {
		return false
	}

	return !isTokenExpired(token)
}

/**
 * Valida token chamando o backend (validação completa com assinatura)
 */
export async function validateTokenWithBackend(
	token: string,
): Promise<boolean> {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/v1/me`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)

		return response.ok
	} catch {
		return false
	}
}

/**
 * Debug: Mostra todos os cookies atuais
 * Use no console: window.debugAuth()
 */
export function debugAuth(): void {
	if (!isBrowser()) return

	console.group('🔍 Debug de Autenticação')

	// LocalStorage
	const accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS)
	const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH)

	console.log('📦 localStorage:', {
		access_token: formatTokenForDisplay(accessToken),
		refresh_token: refreshToken ? 'presente' : 'ausente',
	})

	// Cookies
	const cookies = CookieManager.getAll()

	console.log('🍪 Cookies:', {
		access_token: formatTokenForDisplay(cookies[TOKEN_KEYS.ACCESS] || null),
		refresh_token: cookies[TOKEN_KEYS.REFRESH] ? 'presente' : 'ausente',
		allCookies: CookieManager.getRaw(),
	})

	// Status de autenticação
	const authenticated = isAuthenticated()
	const token = getAccessToken()

	console.log('✅ Status:', {
		isAuthenticated: authenticated,
		tokenPresent: !!token,
		tokenExpired: token ? isTokenExpired(token) : 'N/A',
	})

	// Decode token
	if (token) {
		const decoded = decodeJWT(token)
		console.log('🔓 Token decodificado:', decoded)
	}

	console.groupEnd()
}

/**
 * Força limpeza completa de tokens (use em emergências)
 * Use no console: window.forceLogout()
 */
export function forceLogout(): void {
	if (!isBrowser()) return

	console.log('🧹 Forçando logout completo...')

	// Limpa localStorage
	localStorage.removeItem(TOKEN_KEYS.ACCESS)
	localStorage.removeItem(TOKEN_KEYS.REFRESH)
	console.log('✅ localStorage limpo')

	// Limpa todos os cookies possíveis
	const domains = [
		'',
		window.location.hostname,
		`.${window.location.hostname}`,
		'localhost',
	]

	const paths = ['/', '']

	CookieManager.forceDelete(TOKEN_KEYS.ACCESS, domains, paths)
	CookieManager.forceDelete(TOKEN_KEYS.REFRESH, domains, paths)

	const cookiesCleared = domains.length * paths.length * 2 // 2 tokens
	console.log(`✅ ${cookiesCleared} variações de cookies limpas`)

	// Verifica resultado
	setTimeout(() => {
		const remainingCookies = CookieManager.getRaw()
		console.log('🔍 Cookies restantes:', remainingCookies || 'NENHUM ✅')

		const hasAccessToken = remainingCookies.includes(TOKEN_KEYS.ACCESS)
		const hasRefreshToken = remainingCookies.includes(TOKEN_KEYS.REFRESH)

		if (!hasAccessToken && !hasRefreshToken) {
			console.log('✅ Logout completo! Redirecionando...')
			window.location.href = '/login'
		} else {
			console.warn(
				'⚠️ Alguns cookies ainda existem. Limpe manualmente em DevTools → Application → Cookies',
			)
		}
	}, 100)
}

// Expõe funções de debug globalmente
if (isBrowser()) {
	window.debugAuth = debugAuth
	window.forceLogout = forceLogout
}
