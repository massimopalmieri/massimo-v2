import {index, route} from '@react-router/dev/routes'
import type {RouteConfig} from '@react-router/dev/routes'

export default [
	index('routes/_index/route.tsx'),
	route('login', './routes/login.tsx'),
	route('logout', './routes/logout.ts'),
	route('api/contact', './routes/api.contact/route.ts'),
	route('api/theme', './routes/api.theme.ts'),

	route('admin', './routes/admin/index.tsx', [
		index('./routes/admin/dashboard.tsx'),
	]),
] satisfies RouteConfig
