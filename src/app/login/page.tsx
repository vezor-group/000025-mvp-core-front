'use client'

import Link from 'next/link'
import {
	type FormEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabValue = 'login' | 'register'

export default function LoginPage() {
	const [activeTab, setActiveTab] = useState<TabValue>('login')
	const [contentHeight, setContentHeight] = useState<number | null>(null)
	const loginContentRef = useRef<HTMLDivElement>(null)
	const registerContentRef = useRef<HTMLDivElement>(null)

	const getContentNode = useCallback(
		(tab: TabValue) =>
			tab === 'login' ? loginContentRef.current : registerContentRef.current,
		[],
	)

	const measureHeight = useCallback(
		(tab: TabValue) => {
			const node = getContentNode(tab)

			if (node) {
				setContentHeight(node.offsetHeight)
			}
		},
		[getContentNode],
	)

	useLayoutEffect(() => {
		measureHeight(activeTab)

		if (!('ResizeObserver' in window)) {
			return
		}

		const node = getContentNode(activeTab)

		if (!node) {
			return
		}

		const observer = new ResizeObserver(() => measureHeight(activeTab))

		observer.observe(node)

		return () => observer.disconnect()
	}, [activeTab, getContentNode, measureHeight])

	const handleTabChange = useCallback((value: string) => {
		if (value === 'login' || value === 'register') {
			setActiveTab(value)
		}
	}, [])

	const contentTransitionClass =
		'transition-all duration-300 ease-out data-[state=inactive]:absolute data-[state=inactive]:inset-0 data-[state=inactive]:-z-10 data-[state=inactive]:translate-y-6 data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none data-[state=active]:relative data-[state=active]:translate-y-0 data-[state=active]:opacity-100'

	function handleSignIn(event: FormEvent) {
		event.preventDefault()
		// TODO: Lógica de autenticação aqui
	}
	function handleSignInGoogle(event: FormEvent) {
		event.preventDefault()
		// TODO: Lógica de autenticação aqui
	}

	function handleSignUp(event: FormEvent) {
		event.preventDefault()
		// TODO: Lógica de autenticação aqui
	}
	function handleSignUpGoogle(event: FormEvent) {
		event.preventDefault()
		// TODO: Lógica de autenticação aqui
	}

	return (
		<div className='flex min-h-screen items-start justify-center bg-linear-to-br from-background via-muted/20 to-background px-4 py-12'>
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className='w-full max-w-md'
			>
				<TabsList className='grid w-full grid-cols-2'>
					<TabsTrigger value='login'>Sign In</TabsTrigger>
					<TabsTrigger value='register'>Sign Up</TabsTrigger>
				</TabsList>

				<div
					className='relative mt-4 w-full overflow-hidden transition-[height] duration-400 ease-out'
					style={{
						height: contentHeight !== null ? `${contentHeight}px` : undefined,
					}}
				>
					<TabsContent
						value='login'
						forceMount
						className={contentTransitionClass}
					>
						<div ref={loginContentRef}>
							<Card>
								<CardHeader className='space-y-1'>
									<CardTitle className='text-2xl font-bold'>
										Bem-vindo de volta
									</CardTitle>
									<CardDescription>
										Entre com suas credenciais para acessar sua conta
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='login-email'>Email</Label>
										<Input
											id='login-email'
											type='email'
											placeholder='seu@email.com'
											required
										/>
									</div>
									<div className='space-y-2'>
										<div className='flex items-center justify-between'>
											<Label htmlFor='login-password'>Senha</Label>
											<Link
												href='#'
												className='text-sm text-primary hover:underline'
											>
												Esqueceu a senha?
											</Link>
										</div>
										<Input
											id='login-password'
											type='password'
											placeholder='••••••••'
											required
										/>
									</div>
								</CardContent>
								<CardFooter className='flex flex-col space-y-4'>
									<Button className='w-full' size='lg' onClick={handleSignIn}>
										Entrar
									</Button>
									<div className='relative'>
										<div className='absolute inset-0 flex items-center'>
											<span className='w-full border-t' />
										</div>
										<div className='relative flex justify-center text-xs uppercase'>
											<span className='text-muted-foreground'>
												Ou continue com
											</span>
										</div>
									</div>
									<Button
										variant='outline'
										type='button'
										className='w-full'
										onClick={handleSignInGoogle}
									>
										<svg
											className='mr-2 h-4 w-4'
											aria-hidden='true'
											focusable='false'
											data-prefix='fab'
											data-icon='google'
											role='img'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 488 512'
										>
											<path
												fill='currentColor'
												d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
											/>
										</svg>
										Google
									</Button>
								</CardFooter>
							</Card>
						</div>
					</TabsContent>

					<TabsContent
						value='register'
						forceMount
						className={contentTransitionClass}
					>
						<div ref={registerContentRef}>
							<Card>
								<CardHeader className='space-y-1'>
									<CardTitle className='text-2xl font-bold'>
										Criar conta
									</CardTitle>
									<CardDescription>
										Preencha os dados abaixo para criar sua conta
									</CardDescription>
								</CardHeader>
								<CardContent className='space-y-4'>
									<div className='space-y-2'>
										<Label htmlFor='register-email'>Email</Label>
										<Input
											id='register-email'
											type='email'
											placeholder='seu@email.com'
											required
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='register-password'>Senha</Label>
										<Input
											id='register-password'
											type='password'
											placeholder='••••••••'
											required
										/>
									</div>
									<div className='space-y-2'>
										<Label htmlFor='register-confirm-password'>
											Confirmar senha
										</Label>
										<Input
											id='register-confirm-password'
											type='password'
											placeholder='••••••••'
											required
										/>
									</div>
								</CardContent>
								<CardFooter className='flex flex-col space-y-4'>
									<Button className='w-full' size='lg' onClick={handleSignUp}>
										Criar conta
									</Button>
									<div className='relative'>
										<div className='absolute inset-0 flex items-center'>
											<span className='w-full border-t' />
										</div>
										<div className='relative flex justify-center text-xs uppercase'>
											<span className='text-muted-foreground'>
												Ou continue com
											</span>
										</div>
									</div>
									<Button
										variant='outline'
										type='button'
										className='w-full'
										onClick={handleSignUpGoogle}
									>
										<svg
											className='mr-2 h-4 w-4'
											aria-hidden='true'
											focusable='false'
											data-prefix='fab'
											data-icon='google'
											role='img'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 488 512'
										>
											<path
												fill='currentColor'
												d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
											/>
										</svg>
										Google
									</Button>
								</CardFooter>
							</Card>
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}
