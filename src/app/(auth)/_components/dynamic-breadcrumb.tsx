'use client'

import { usePathname } from 'next/navigation'
import { Fragment } from 'react'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function DynamicBreadcrumb() {
	const pathname = usePathname()

	// Remove a primeira barra e divide o pathname em segmentos
	const segments = pathname.split('/').filter((segment) => segment !== '')

	// Função para formatar o nome do segmento (primeira letra maiúscula)
	const formatSegmentName = (segment: string) => {
		return segment
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	}

	// Se não houver segmentos, não mostrar nada
	if (segments.length === 0) {
		return null
	}

	// Pega o primeiro segmento (home, dashboard, ai, etc)
	const firstSegment = segments[0]
	const restSegments = segments.slice(1)

	// Se estiver apenas no primeiro nível (ex: /home, /dashboard)
	if (restSegments.length === 0) {
		return (
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbPage>{formatSegmentName(firstSegment)}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		)
	}

	// Se houver subrotas (ex: /home/settings, /dashboard/analytics)
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Link para o primeiro nível (home, dashboard, ai, etc) */}
				<BreadcrumbItem>
					<BreadcrumbLink href={`/${firstSegment}`}>
						{formatSegmentName(firstSegment)}
					</BreadcrumbLink>
				</BreadcrumbItem>

				{/* Gerar breadcrumbs para cada segmento restante */}
				{restSegments.map((segment, index) => {
					const isLast = index === restSegments.length - 1
					// Construir o href a partir do primeiro segmento
					const href = `/${firstSegment}/${restSegments.slice(0, index + 1).join('/')}`

					return (
						<Fragment key={href}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{isLast ? (
									<BreadcrumbPage>{formatSegmentName(segment)}</BreadcrumbPage>
								) : (
									<BreadcrumbLink href={href}>
										{formatSegmentName(segment)}
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
