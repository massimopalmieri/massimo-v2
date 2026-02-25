import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
} from 'react-router'
import stylesheet from './app.css?url'
import {ClientHintCheck} from './utils/client-hints'
import type {Route} from './+types/root'
import type {ReactNode} from 'react'

export const meta: Route.MetaFunction = () => {
	return [
		{title: 'Massimo Palmieri'},
		{charSet: 'utf-8'},
		{viewport: 'width=device-width,initial-scale=1'},
	]
}
export const links: Route.LinksFunction = () => [
	{rel: 'preconnect', href: 'https://fonts.googleapis.com'},
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
	{rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml'},
	{rel: 'stylesheet', href: stylesheet},
]

export async function loader(_args: Route.LoaderArgs) {
	return null
}

export function Layout({children}: {children: ReactNode}) {
	return (
		<html lang="en" className="dark">
			<head>
				<ClientHintCheck />
				<Meta />
				<Links />

				{import.meta.env.PROD && (
					<script
						defer
						src="https://cloud.umami.is/script.js"
						data-website-id="e02d5129-e6c6-4b6b-baa0-c66650fd7fa6"
					></script>
				)}

				{import.meta.env.DEV && (
					<script
						dangerouslySetInnerHTML={{
							__html: `
                console.log('Analytics disabled in development');
                window.umami = {
                  track: (...args) => console.log('Track event (dev):', ...args)
                };
              `,
						}}
					/>
				)}
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return <Outlet />
}

export function ErrorBoundary({error}: Route.ErrorBoundaryProps) {
	let message = 'Oops!'
	let details = 'An unexpected error occurred.'
	let stack: string | undefined

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error'
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message
		stack = error.stack
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	)
}
