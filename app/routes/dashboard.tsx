import {authenticate} from '~/services/auth.server'
import type {Route} from './+types/dashboard'
import {prisma} from '~/db.server'
import {Form} from 'react-router'

export async function loader({request}: Route.LoaderArgs) {
	const user = await authenticate(request)
	const items = await prisma.item.findMany()
	return {items, user}
}

export default function Dashboard({loaderData}: Route.ComponentProps) {
	const {items, user} = loaderData

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navigation Bar */}
			<nav className="bg-white shadow-xs">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
						<div className="flex items-center space-x-4">
							<span className="text-gray-600">{user.name || user.email}</span>
							<Form method="post" action="/logout">
								<button
									type="submit"
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
								>
									Logout
								</button>
							</Form>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white shadow-sm rounded-lg p-6">
					<h2 className="text-lg font-medium text-gray-900 mb-4">
						Welcome to your dashboard
					</h2>

					{/* Items Grid */}
					<div className="mt-6">
						<h3 className="text-gray-700 text-sm font-medium mb-4">
							Your Items
						</h3>
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
