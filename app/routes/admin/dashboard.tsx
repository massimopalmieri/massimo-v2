import {prisma} from '~/db.server'
import {authenticate} from '~/services/auth.server'
import type {Route} from './+types/dashboard'

export async function loader({request}: Route.LoaderArgs) {
	const user = await authenticate(request)
	const items = await prisma.item.findMany()
	return {items, user}
}

export default function Dashboard({loaderData}: Route.ComponentProps) {
	const {items, user} = loaderData

	return (
		<div className="">
			{/* Navigation Bar */}
			<nav className="shadow-xs">
				<div className="">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-xl font-semibold">Dashboard</h1>
						<div className="flex items-center space-x-4">
							<span className="">{user.name || user.email}</span>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="">
				<div className="">
					<h2 className="text-lg font-medium mb-4">
						Welcome to your dashboard
					</h2>

					{/* Items Grid */}
					<div className="mt-6">
						<h3 className="text-sm font-medium mb-4">Your Items</h3>
						{items.length === 0 ? (
							<p className="text-gray-500 text-sm">No items yet.</p>
						) : (
							<ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{items.map((item) => (
									<li
										key={item.id}
										className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
									>
										<div className="text-sm font-medium text-gray-900">
											{item.title}
										</div>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</main>
		</div>
	)
}
