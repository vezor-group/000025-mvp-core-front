'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { isAuthenticated } from '@/lib/auth'

interface AuthGuardProps {
	children: React.ReactNode
	fallback?: React.ReactNode
}

/**
 * Componente para proteger páginas client-side
 * Uso opcional - o middleware já protege as rotas
 * Use este componente apenas se precisar de proteção adicional ou loading state
 */
export function AuthGuard({ children, fallback }: AuthGuardProps) {
	const router = useRouter()
	const [isChecking, setIsChecking] = useState(true)
	const [isAuth, setIsAuth] = useState(false)

	useEffect(() => {
		const checkAuth = () => {
			const authenticated = isAuthenticated()
			setIsAuth(authenticated)
			setIsChecking(false)

			if (!authenticated) {
				router.push('/login')
			}
		}

		checkAuth()
	}, [router])

	if (isChecking) {
		return fallback || <div>Verificando autenticação...</div>
	}

	if (!isAuth) {
		return fallback || null
	}

	return <>{children}</>
}
