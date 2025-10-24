'use client'

import { motion } from 'framer-motion'

import {
	type AnimationStart,
	type AnimationVariant,
	useThemeToggle,
} from '@/hooks/use-theme-toggle'
import { cn } from '@/lib/utils'

export const ThemeToggleButton = ({
	className = '',
	variant = 'circle',
	start = 'center',
	blur = false,
	gifUrl = '',
}: {
	className?: string
	variant?: AnimationVariant
	start?: AnimationStart
	blur?: boolean
	gifUrl?: string
}) => {
	const { isDark, toggleTheme } = useThemeToggle({
		variant,
		start,
		blur,
		gifUrl,
	})

	return (
		<button
			type='button'
			className={cn(
				'rounded-full transition-all duration-300 active:scale-95 inline-flex items-center justify-center',
				className,
			)}
			onClick={toggleTheme}
			aria-label='Toggle theme'
		>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				aria-hidden='true'
				fill='currentColor'
				strokeLinecap='round'
				viewBox='0 0 32 32'
				className='w-full h-full'
			>
				<clipPath id='skiper-btn-2'>
					<motion.path
						animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
						transition={{ ease: 'easeInOut', duration: 0.35 }}
						d='M0-5h30a1 1 0 0 0 9 13v24H0Z'
					/>
				</clipPath>
				<g clipPath='url(#skiper-btn-2)'>
					<motion.circle
						animate={{ r: isDark ? 10 : 8 }}
						transition={{ ease: 'easeInOut', duration: 0.35 }}
						cx='16'
						cy='16'
					/>
					<motion.g
						animate={{
							rotate: isDark ? -100 : 0,
							scale: isDark ? 0.5 : 1,
							opacity: isDark ? 0 : 1,
						}}
						transition={{ ease: 'easeInOut', duration: 0.35 }}
						stroke='currentColor'
						strokeWidth='1.5'
					>
						<path d='M16 5.5v-4' />
						<path d='M16 30.5v-4' />
						<path d='M1.5 16h4' />
						<path d='M26.5 16h4' />
						<path d='m23.4 8.6 2.8-2.8' />
						<path d='m5.7 26.3 2.9-2.9' />
						<path d='m5.8 5.8 2.8 2.8' />
						<path d='m23.4 23.4 2.9 2.9' />
					</motion.g>
				</g>
			</svg>
		</button>
	)
}
