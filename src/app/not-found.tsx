'use client'

import { ArrowLeft, Frown, Home } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function NotFound() {
	const router = useRouter()

	const handleGoBack = () => {
		router.back()
	}

	return (
		<div className='flex min-h-screen items-center justify-center bg-linear-to-br from-background via-muted/20 to-background px-4'>
			<Card className='w-full max-w-lg text-center'>
				<CardHeader className='space-y-4'>
					<div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary/10'>
						<Frown className='h-12 w-12 text-primary' />
					</div>
					<div className='space-y-2'>
						<CardTitle className='text-6xl font-bold'>404</CardTitle>
						<CardDescription className='text-lg'>
							Página não encontrada
						</CardDescription>
					</div>
				</CardHeader>
				<CardContent>
					<p className='text-muted-foreground'>
						Desculpe, não conseguimos encontrar a página que você está
						procurando. Ela pode ter sido movida ou não existe mais.
					</p>
				</CardContent>
				<CardFooter className='flex flex-col gap-3 sm:flex-row sm:justify-center'>
					<Button
						variant='outline'
						onClick={handleGoBack}
						className='w-full sm:w-auto'
					>
						<ArrowLeft className='mr-2 h-4 w-4' />
						Voltar
					</Button>
					<Button asChild className='w-full sm:w-auto'>
						<Link href='/dashboard'>
							<Home className='mr-2 h-4 w-4' />
							Ir para Início
						</Link>
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
