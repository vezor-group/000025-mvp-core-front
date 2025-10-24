import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './_components/app-sidebar'

interface SystemLayoutProps {
	children: React.ReactNode
}

export default function SystemLayout({ children }: SystemLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className='flex min-w-0 flex-1 flex-col overflow-x-hidden'>
				{/* Content */}
				<div className='flex-1 px-4 py-6'>{children}</div>
			</main>
		</SidebarProvider>
	)
}
