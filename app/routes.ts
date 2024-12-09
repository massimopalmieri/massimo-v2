import {type RouteConfig, index, route} from '@react-router/dev/routes'

export default [
	index('routes/_index/route.tsx'),
	route('login', './routes/login.tsx'),
	route('logout', './routes/logout.ts'),
	route('dashboard', './routes/dashboard.tsx'),
	route('drizzle', './routes/drizzle.tsx'),
	route('api/contact', './routes/api.contact/route.ts'),
	route('api/theme', './routes/api.theme.ts'),
] satisfies RouteConfig
