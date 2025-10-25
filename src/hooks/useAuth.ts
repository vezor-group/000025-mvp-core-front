'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import {
	clearTokens,
	decodeJWT,
	getAccessToken,
	isAuthenticated,
} from '@/lib/auth'

interface User {
	id?: string
	email?: string
	name?: string
	role?: string
	[key: string]: unknown
}

/**
 * Hook para gerenciar autenticação
 */
export function useAuth() {
	const router = useRouter()
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const token = getAccessToken()
		if (token) {
			const decoded = decodeJWT(token)
			setUser(decoded as User)
		}
		setLoading(false)
	}, [])

	const logout = useCallback(() => {
		clearTokens()
		setUser(null)
		router.push('/login')
	}, [router])

	const refreshUser = useCallback(() => {
		const token = getAccessToken()
		if (token) {
			const decoded = decodeJWT(token)
			setUser(decoded as User)
		}
	}, [])

	return {
		user,
		loading,
		isAuthenticated: isAuthenticated(),
		logout,
		refreshUser,
	}
}
