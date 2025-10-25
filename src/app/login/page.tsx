'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaGoogle } from 'react-icons/fa'
import { toast } from 'sonner'
import { z } from 'zod'
import AuthenticationController from '@/backend/controllers/authentication.controller'
import {
	signInRequestSchema,
	signUpRequestSchema,
} from '@/backend/types/authentication.type'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type TabValue = 'login' | 'register'

// Schema estendido para incluir confirmação de senha
const signUpFormSchema = signUpRequestSchema
	.extend({
		confirmPassword: z
			.string()
			.min(1, 'Confirmação de senha é obrigatória')
			.min(6, 'Senha deve ter no mínimo 6 caracteres'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword'],
	})

type SignInFormValues = z.infer<typeof signInRequestSchema>
type SignUpFormValues = z.infer<typeof signUpFormSchema>

// Componente reutilizável para o botão de autenticação com Google
function GoogleButton({ onClick }: { onClick: () => void }) {
	return (
		<Button
			variant='outline'
			type='button'
			className='w-full'
			onClick={onClick}
		>
			<FaGoogle />
			Google
		</Button>
	)
}

export default function LoginPage() {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState<TabValue>('login')
	const [contentHeight, setContentHeight] = useState<number | null>(null)
	const loginContentRef = useRef<HTMLDivElement>(null)
	const registerContentRef = useRef<HTMLDivElement>(null)

	// Memoiza a instância do controller para evitar recriação em cada render
	const authController = useMemo(() => new AuthenticationController(), [])

	// Form para login
	const signInForm = useForm<SignInFormValues>({
		resolver: zodResolver(signInRequestSchema),
		defaultValues: {
			providerAuth: 'basic',
			email: '',
			password: '',
		},
	})

	// Form para registro
	const signUpForm = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpFormSchema),
		defaultValues: {
			providerAuth: 'basic',
			name: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	})

	// Sistema de animação suave para transição entre tabs
	// Mede dinamicamente a altura do conteúdo para evitar "jumps" visuais
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

	// Monitora mudanças na altura do conteúdo (ex: mensagens de erro, validação)
	useLayoutEffect(() => {
		measureHeight(activeTab)

		// Fallback para navegadores sem suporte a ResizeObserver
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

	// Classes para animação de fade + slide entre tabs
	// Tab inativa: posicionada absolutamente, deslocada para baixo e invisível
	// Tab ativa: posicionada relativamente, no lugar e visível
	const contentTransitionClass =
		'transition-all duration-300 ease-out data-[state=inactive]:absolute data-[state=inactive]:inset-0 data-[state=inactive]:-z-10 data-[state=inactive]:translate-y-6 data-[state=inactive]:opacity-0 data-[state=inactive]:pointer-events-none data-[state=active]:relative data-[state=active]:translate-y-0 data-[state=active]:opacity-100'

	// Lógica comum para armazenar tokens e redirecionar após autenticação bem-sucedida
	const handleAuthSuccess = useCallback(
		(accessToken: string, refreshToken: string, message: string) => {
			localStorage.setItem('access_token', accessToken)
			localStorage.setItem('refresh_token', refreshToken)
			toast.success(message)
			router.push('/dashboard')
		},
		[router],
	)

	async function onSignInSubmit(values: SignInFormValues) {
		try {
			const response = await authController.signIn(values)

			if (response.data) {
				handleAuthSuccess(
					response.data.access_token,
					response.data.refresh_token,
					response.message || 'Login realizado com sucesso!',
				)
			} else {
				toast.error(response.message || 'Erro ao fazer login')
			}
		} catch (error) {
			console.error('Erro no login:', error)
			toast.error('Erro ao fazer login. Verifique suas credenciais.')
		}
	}

	async function onSignUpSubmit(values: SignUpFormValues) {
		try {
			// Remove confirmPassword antes de enviar
			const { confirmPassword, ...signUpData } = values

			const response = await authController.signUp(signUpData)

			if (response.data) {
				handleAuthSuccess(
					response.data.access_token,
					response.data.refresh_token,
					response.message || 'Conta criada com sucesso!',
				)
			} else {
				toast.error(response.message || 'Erro ao criar conta')
			}
		} catch (error) {
			console.error('Erro no cadastro:', error)
			toast.error('Erro ao criar conta. Tente novamente.')
		}
	}

	// Handler unificado para autenticação com Google (usado em ambas as tabs)
	const handleGoogleAuth = useCallback(() => {
		toast.info('Autenticação com Google em desenvolvimento...')
		// TODO: Implementar autenticação OAuth com Google
	}, [])

	return (
		<div className='flex min-h-screen items-start justify-center bg-linear-to-br from-background via-muted/20 to-background px-4 py-5'>
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
								<Form {...signInForm}>
									<form onSubmit={signInForm.handleSubmit(onSignInSubmit)}>
										<CardContent className='space-y-4'>
											<FormField
												control={signInForm.control}
												name='email'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input
																type='email'
																placeholder='seu@email.com'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={signInForm.control}
												name='password'
												render={({ field }) => (
													<FormItem>
														<div className='flex items-center justify-between'>
															<FormLabel>Senha</FormLabel>
															<Link
																href='#'
																className='text-sm text-primary hover:underline'
															>
																Esqueceu a senha?
															</Link>
														</div>
														<FormControl>
															<Input
																type='password'
																placeholder='••••••••'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
										<CardFooter className='flex flex-col space-y-4 pt-6'>
											<Button
												className='w-full'
												size='lg'
												type='submit'
												disabled={signInForm.formState.isSubmitting}
											>
												{signInForm.formState.isSubmitting
													? 'Entrando...'
													: 'Entrar'}
											</Button>
											<div className='relative'>
												<div className='absolute inset-0 flex items-center'>
													<span className='w-full border-t' />
												</div>
												<div className='relative flex justify-center text-xs uppercase'>
													<span className='bg-background px-2 text-muted-foreground'>
														Ou continue com
													</span>
												</div>
											</div>
											<GoogleButton onClick={handleGoogleAuth} />
										</CardFooter>
									</form>
								</Form>
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
								<Form {...signUpForm}>
									<form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}>
										<CardContent className='space-y-4'>
											<FormField
												control={signUpForm.control}
												name='name'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Nome</FormLabel>
														<FormControl>
															<Input
																type='text'
																placeholder='Seu nome completo'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={signUpForm.control}
												name='email'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input
																type='email'
																placeholder='seu@email.com'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={signUpForm.control}
												name='password'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Senha</FormLabel>
														<FormControl>
															<Input
																type='password'
																placeholder='••••••••'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={signUpForm.control}
												name='confirmPassword'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Confirmar senha</FormLabel>
														<FormControl>
															<Input
																type='password'
																placeholder='••••••••'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</CardContent>
										<CardFooter className='flex flex-col space-y-4 pt-6'>
											<Button
												className='w-full'
												size='lg'
												type='submit'
												disabled={signUpForm.formState.isSubmitting}
											>
												{signUpForm.formState.isSubmitting
													? 'Criando conta...'
													: 'Criar conta'}
											</Button>
											<div className='relative'>
												<div className='absolute inset-0 flex items-center'>
													<span className='w-full border-t' />
												</div>
												<div className='relative flex justify-center text-xs uppercase'>
													<span className='bg-background px-2 text-muted-foreground'>
														Ou continue com
													</span>
												</div>
											</div>
											<GoogleButton onClick={handleGoogleAuth} />
										</CardFooter>
									</form>
								</Form>
							</Card>
						</div>
					</TabsContent>
				</div>
			</Tabs>
		</div>
	)
}
