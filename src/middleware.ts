import { type NextRequest, NextResponse } from 'next/server'

// ===== CONSTANTES =====
const TOKEN_COOKIE_NAMES = {
	ACCESS: 'access_token',
	REFRESH: 'refresh_token',
} as const

const ROUTES = {
	PROTECTED: ['/dashboard', '/chat-ai'],
	PUBLIC: ['/', '/login'],
	DASHBOARD: '/dashboard',
	LOGIN: '/login',
} as const

const isDevelopment = process.env.NODE_ENV === 'development'

// ===== HELPERS =====
/**
 * Type guard para verificar se pathname é uma rota pública
 */
function isPublicPath(
	path: string,
): path is (typeof ROUTES.PUBLIC)[number] {
	return ROUTES.PUBLIC.includes(path as (typeof ROUTES.PUBLIC)[number])
}

/**
 * Cria URL de redirect para login com parâmetros
 */
function createLoginRedirect(
	baseUrl: string,
	pathname: string,
	isExpired = false,
): NextResponse {
	const loginUrl = new URL(ROUTES.LOGIN, baseUrl)
	loginUrl.searchParams.set('redirect', pathname)

	if (isExpired) {
		loginUrl.searchParams.set('expired', 'true')
	}

	return NextResponse.redirect(loginUrl)
}

/**
 * Remove cookies de autenticação de uma resposta
 */
function deleteCookiesFromResponse(response: NextResponse): NextResponse {
	response.cookies.delete(TOKEN_COOKIE_NAMES.ACCESS)
	response.cookies.delete(TOKEN_COOKIE_NAMES.REFRESH)
	return response
}

/**
 * Log condicional (apenas em desenvolvimento)
 */
function log(message: string, data?: Record<string, unknown>): void {
	if (isDevelopment) {
		console.log(message, data || '')
	}
}

// ===== MIDDLEWARE =====
/**
 * Middleware para proteger rotas autenticadas e redirecionar usuários autenticados
 * Executa antes de todas as requisições para verificar autenticação
 */
export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const isProtectedRoute = ROUTES.PROTECTED.some((route) =>
		pathname.startsWith(route),
	)
	const isPublicRoute = isPublicPath(pathname)

	// Verifica token nos cookies
	const accessToken = request.cookies.get(TOKEN_COOKIE_NAMES.ACCESS)?.value
	const hasValidToken = accessToken && !isTokenExpired(accessToken)

	log('[Middleware]', {
		pathname,
		isProtectedRoute,
		isPublicRoute,
		hasToken: !!accessToken,
		hasValidToken,
	})

	// Usuário autenticado tentando acessar rota pública → redireciona para dashboard
	if (isPublicRoute && hasValidToken) {
		log('[Middleware] Redirecionando usuário autenticado para dashboard')
		return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
	}

	// Rota não protegida → permite acesso
	if (!isProtectedRoute) {
		return NextResponse.next()
	}

	// === ROTAS PROTEGIDAS DAQUI EM DIANTE ===

	// Sem token → redireciona para login
	if (!accessToken) {
		log('[Middleware] Sem token, redirecionando para login')
		return createLoginRedirect(request.url, pathname)
	}

	// Token expirado → limpa cookies e redireciona
	try {
		if (isTokenExpired(accessToken)) {
			log('[Middleware] Token expirado, redirecionando para login')
			const response = createLoginRedirect(request.url, pathname, true)
			return deleteCookiesFromResponse(response)
		}

		// Token válido → permite acesso
		return NextResponse.next()
	} catch (error) {
		log('[Middleware] Erro ao validar token', { error })
		return createLoginRedirect(request.url, pathname)
	}
}

/**
 * Decodifica JWT e verifica expiração
 */
function isTokenExpired(token: string): boolean {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) {
			return true
		}

		const payload = parts[1]
		// Decodifica base64 no edge runtime
		const decoded = JSON.parse(atob(payload))

		if (!decoded.exp) {
			return true
		}

		const expirationTime = decoded.exp as number
		const currentTime = Math.floor(Date.now() / 1000)

		return currentTime >= expirationTime
	} catch {
		return true
	}
}

// Configuração de quais rotas o middleware deve processar
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}
