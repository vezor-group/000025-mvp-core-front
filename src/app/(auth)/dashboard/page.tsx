'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
	const { user, logout, loading } = useAuth()

	if (loading) {
		return <div className='p-8'>Carregando...</div>
	}

	return (
		<div className='p-8'>
			<div className='max-w-4xl mx-auto'>
				<div className='flex items-center justify-between mb-8'>
					<div>
						<h1 className='text-3xl font-bold'>Dashboard</h1>
						{user && (
							<p className='text-muted-foreground mt-2'>
								Bem-vindo, {user.name || user.email}!
							</p>
						)}
					</div>
					<Button variant='outline' onClick={logout}>
						Sair
					</Button>
				</div>

				<div className='grid gap-4'>
					<div className='border rounded-lg p-6'>
						<h2 className='text-xl font-semibold mb-2'>Suas Informações</h2>
						<div className='space-y-2 text-sm'>
							{user && (
								<>
									<p>
										<span className='font-medium'>Email:</span> {user.email}
									</p>
									<p>
										<span className='font-medium'>Nome:</span> {user.name}
									</p>
									{user.role && (
										<p>
											<span className='font-medium'>Função:</span> {user.role}
										</p>
									)}
								</>
							)}
						</div>
					</div>

					<div className='border rounded-lg p-6 bg-muted/50'>
						<h2 className='text-xl font-semibold mb-2'>✅ Rota Protegida</h2>
						<p className='text-sm text-muted-foreground'>
							Esta página está protegida pelo middleware de autenticação. Apenas
							usuários autenticados podem acessá-la.
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
