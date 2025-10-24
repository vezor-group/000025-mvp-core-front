'use client'

import { BotMessageSquare, Frame, LayoutDashboard } from 'lucide-react'
import type { ComponentProps } from 'react'
import Logo from '@/components/logo'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	SidebarTrigger,
	useSidebar,
} from '@/components/ui/sidebar'
import { NavMain } from './nav-main'
import { NavGroups } from './nav-projects'
import { NavUser } from './nav-user'

// This is sample data.
const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			title: 'Chat AI',
			url: '/chat-ai',
			icon: BotMessageSquare,
		},
		// {
		//   title: 'Models',
		//   url: '#',
		//   icon: Bot,
		//   items: [
		//     {
		//       title: 'Genesis',
		//       url: '#',
		//     },
		//     {
		//       title: 'Explorer',
		//       url: '#',
		//     },
		//     {
		//       title: 'Quantum',
		//       url: '#',
		//     },
		//   ],
		// },
		// {
		//   title: 'Documentation',
		//   url: '#',
		//   icon: BookOpen,
		//   items: [
		//     {
		//       title: 'Introduction',
		//       url: '#',
		//     },
		//     {
		//       title: 'Get Started',
		//       url: '#',
		//     },
		//     {
		//       title: 'Tutorials',
		//       url: '#',
		//     },
		//     {
		//       title: 'Changelog',
		//       url: '#',
		//     },
		//   ],
		// },
		// {
		//   title: 'Settings',
		//   url: '#',
		//   icon: Settings2,
		//   items: [
		//     {
		//       title: 'General',
		//       url: '#',
		//     },
		//     {
		//       title: 'Team',
		//       url: '#',
		//     },
		//     {
		//       title: 'Billing',
		//       url: '#',
		//     },
		//     {
		//       title: 'Limits',
		//       url: '#',
		//     },
		//   ],
		// },
	],
	projects: [
		{
			name: 'Design Engineering',
			url: '#',
			icon: Frame,
		},
		// {
		//   name: 'Sales & Marketing',
		//   url: '#',
		//   icon: PieChart,
		// },
		// {
		//   name: 'Travel',
		//   url: '#',
		//   icon: Map,
		// },
	],
}

function HeaderSidebarTrigger() {
	const { isMobile, state, toggleSidebar } = useSidebar()

	if (isMobile) {
		return <Logo />
	}

	const isExpanded = state === 'expanded'

	return (
		<div className='relative flex h-8 items-center'>
			<Logo
				className='ml-1 cursor-pointer transition-transform'
				onClick={toggleSidebar}
			/>
			<SidebarTrigger
				className={`absolute right-0 hover:bg-transparent hover:text-current dark:hover:bg-transparent transition-opacity duration-200 ${
					isExpanded ? 'opacity-100' : 'pointer-events-none opacity-0'
				}`}
				aria-hidden={!isExpanded}
				tabIndex={isExpanded ? 0 : -1}
			/>
		</div>
	)
}

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='icon' {...props}>
			<SidebarHeader>
				<HeaderSidebarTrigger />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavGroups items={data.projects} label='Projects' />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}
