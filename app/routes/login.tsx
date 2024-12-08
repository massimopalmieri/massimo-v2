import {data, Form, redirect} from 'react-router'
import {authenticator} from '~/services/auth.server'
import type {Route} from './+types/login'
import {getSession, commitSession} from '~/services/session.server'
import {AuthenticationError} from '~/services/auth.server'
import {prisma} from '~/db.server'

type ActionData = {
	error?: string
	fieldErrors?: {
		email?: string[]
		password?: string[]
	}
}

export default function Screen({actionData}: Route.ComponentProps) {
	const {error, fieldErrors} = (actionData || {}) as ActionData

	return (
		<div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500">
			{error && (
				<div className="absolute top-4 w-full max-w-md px-4">
					<div className="bg-white/80 backdrop-blur-xs text-red-700 p-4 rounded-xl shadow-lg border border-red-100">
						{error}
					</div>
				</div>
			)}

			<div className="max-w-md w-full m-4 space-y-8 p-10 bg-white/70 backdrop-blur-xs rounded-2xl shadow-2xl border border-white/50">
				<div className="text-center space-y-2">
					<div className="mx-auto h-12 w-12 bg-indigo-600 text-white flex items-center justify-center rounded-xl shadow-lg">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
							/>
						</svg>
					</div>
					<h2 className="mt-6 text-3xl font-bold text-gray-900">
						Welcome Back
					</h2>
					<p className="text-gray-600">Sign in to your account</p>
				</div>

				<Form method="post" className="mt-8 space-y-6">
					<div className="rounded-xl space-y-5">
						<div className="group">
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Email address
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
										/>
									</svg>
								</div>
								<input
									id="email"
									type="email"
									name="email"
									required
									className="pl-10 appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-xs transition duration-200 ease-in-out"
									placeholder="you@example.com"
									aria-invalid={fieldErrors?.email ? true : undefined}
									aria-describedby={
										fieldErrors?.email ? 'email-error' : undefined
									}
								/>
							</div>
							{fieldErrors?.email && (
								<div id="email-error" className="mt-1 text-sm text-red-600">
									{fieldErrors.email.join(', ')}
								</div>
							)}
						</div>

						<div className="group">
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Password
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
										/>
									</svg>
								</div>
								<input
									id="password"
									type="password"
									name="password"
									autoComplete="current-password"
									required
									className="pl-10 appearance-none rounded-xl relative block w-full px-3 py-2.5 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-xs transition duration-200 ease-in-out"
									placeholder="••••••••"
									aria-invalid={fieldErrors?.password ? true : undefined}
									aria-describedby={
										fieldErrors?.password ? 'password-error' : undefined
									}
								/>
							</div>
							{fieldErrors?.password && (
								<div id="password-error" className="mt-1 text-sm text-red-600">
									{fieldErrors.password.join(', ')}
								</div>
							)}
						</div>
					</div>

					<button
						type="submit"
						className="relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="absolute inset-y-0 left-0 flex items-center pl-3">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-5 h-5"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
								/>
							</svg>
						</span>
						Sign in
					</button>
				</Form>
			</div>
		</div>
	)
}

export async function action({request}: Route.ActionArgs) {
	try {
		const user = await authenticator.authenticate('user-pass', request)
		const session = await getSession(request.headers.get('cookie'))
		session.set('user', user)

		return redirect('/dashboard', {
			headers: {'Set-Cookie': await commitSession(session)},
		})
	} catch (error) {
		console.error(error)

		if (error instanceof AuthenticationError) {
			return data({error: 'Invalid credentials'}, {status: 401})
		}

		if (error instanceof Error) {
			return data({error: error.message}, {status: 400})
		}

		return data({error: 'An unexpected error occurred'}, {status: 500})
	}
}

export async function loader({request}: Route.LoaderArgs) {
	const users = await prisma.user.findMany()
	const items = await prisma.item.findMany()
	console.log('Users:', users)
	console.log('Items:', items)

	const session = await getSession(request.headers.get('cookie'))
	const user = session.get('user')
	if (user) throw redirect('/dashboard')
	return data(null)
}
