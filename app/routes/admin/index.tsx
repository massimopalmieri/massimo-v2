import {
	ArrowRightStartOnRectangleIcon,
	Cog8ToothIcon,
	UserIcon,
} from '@heroicons/react/24/outline'
import {Outlet} from 'react-router'
import {Avatar} from '~/components/catalyst/avatar'
import {
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	DropdownLabel,
	DropdownMenu,
} from '~/components/catalyst/dropdown'
import {
	Navbar,
	NavbarItem,
	NavbarSection,
	NavbarSpacer,
} from '~/components/catalyst/navbar'
import {
	Sidebar,
	SidebarBody,
	SidebarHeader,
	SidebarItem,
	SidebarSection,
} from '~/components/catalyst/sidebar'
import {StackedLayout} from '~/components/catalyst/stacked-layout'

const navItems = [
	{label: 'Home', url: '/'},
	{label: 'Events', url: '/events'},
	{label: 'Settings', url: '/settings'},
]

export default function AuthLayout() {
	return (
		<StackedLayout
			navbar={
				<Navbar>
					<NavbarSection className="max-lg:hidden">
						{navItems.map(({label, url}) => (
							<NavbarItem key={label} href={url}>
								{label}
							</NavbarItem>
						))}
					</NavbarSection>
					<NavbarSpacer />
					<NavbarSection>
						<Dropdown>
							<DropdownButton as={NavbarItem}>
								<Avatar src="/profile-photo.webp" square />
							</DropdownButton>
							<DropdownMenu className="min-w-64" anchor="bottom end">
								<DropdownItem href="/my-profile">
									<UserIcon />
									<DropdownLabel>My profile</DropdownLabel>
								</DropdownItem>
								<DropdownItem href="/settings">
									<Cog8ToothIcon />
									<DropdownLabel>Settings</DropdownLabel>
								</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="/logout">
									<ArrowRightStartOnRectangleIcon />
									<DropdownLabel>Sign out</DropdownLabel>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarSection>
				</Navbar>
			}
			sidebar={
				<Sidebar>
					<SidebarHeader></SidebarHeader>
					<SidebarBody>
						<SidebarSection>
							{navItems.map(({label, url}) => (
								<SidebarItem key={label} href={url}>
									{label}
								</SidebarItem>
							))}
						</SidebarSection>
					</SidebarBody>
				</Sidebar>
			}
		>
			<Outlet />
		</StackedLayout>
	)
}
