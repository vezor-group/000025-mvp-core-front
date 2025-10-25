'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import HeaderLandingPage from '@/app/(landing)/_components/header-landing-page'
import { isAuthenticated } from '@/lib/auth'

export default function LandingPage() {
	const router = useRouter()

	// Redireciona usuários autenticados para o dashboard
	useEffect(() => {
		if (isAuthenticated()) {
			router.push('/dashboard')
		}
	}, [router])

	return (
		<>
			<HeaderLandingPage />
			<main className='flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4'>
				<h1 className='bg-linear-to-r from-red-500 via-blue-500 to-purple-500 bg-clip-text py-4 text-6xl font-bold leading-tight text-transparent md:text-7xl lg:text-8xl'>
					Your landing page here
				</h1>
			</main>
		</>
	)
}
