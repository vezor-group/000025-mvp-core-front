import HeaderLandingPage from '@/app/(landing-page)/_components/header-landing-page'

export default function Home() {
	return (
		<>
			<HeaderLandingPage />
			<main className='flex h-[calc(100vh-4rem)] w-full items-center justify-center px-4'>
				<h1 className='bg-linear-to-r from-red-500 via-blue-500 to-purple-500 bg-clip-text py-4 text-6xl font-bold leading-tight text-transparent md:text-7xl lg:text-8xl'>
					Sua landing page aqui
				</h1>
			</main>
		</>
	)
}
