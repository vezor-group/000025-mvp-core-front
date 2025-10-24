import type { Metadata } from 'next'
import { Roboto, Roboto_Mono, Roboto_Serif } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	style: ['normal', 'italic'],
})

const robotoMono = Roboto_Mono({
	variable: '--font-roboto-mono',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700'],
	style: ['normal', 'italic'],
})

const robotoSerif = Roboto_Serif({
	variable: '--font-roboto-serif',
	subsets: ['latin'],
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	style: ['normal', 'italic'],
})

export const metadata: Metadata = {
	title: 'MVP Core Front',
	description: 'Core Frontend for MVP projects',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='pt-BR' suppressHydrationWarning data-lt-installed>
			<body
				className={`${roboto.variable} ${robotoMono.variable} ${robotoSerif.variable} font-sans antialiased`}
			>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					{children}
					<Toaster richColors position='top-right' closeButton />
				</ThemeProvider>
			</body>
		</html>
	)
}
