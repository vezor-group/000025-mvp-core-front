import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.ComponentProps<'input'> {
	disablePasswordToggle?: boolean
}

function Input({
	className,
	type,
	disablePasswordToggle = false,
	...props
}: InputProps) {
	const [showPassword, setShowPassword] = useState(false)
	const isPassword = type === 'password'
	const inputType = isPassword && showPassword ? 'text' : type

	if (isPassword && !disablePasswordToggle) {
		return (
			<div className='relative'>
				<input
					type={inputType}
					data-slot='input'
					className={cn(
						'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
						'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
						'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
						'pr-10',
						className,
					)}
					{...props}
				/>
				<button
					type='button'
					onClick={() => setShowPassword(!showPassword)}
					className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors'
					tabIndex={-1}
				>
					{showPassword ? (
						<Eye className='h-4 w-4' />
					) : (
						<EyeOff className='h-4 w-4' />
					)}
				</button>
			</div>
		)
	}

	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
				'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
				className,
			)}
			{...props}
		/>
	)
}

export { Input }
