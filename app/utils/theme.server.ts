import {getUserPrefsCookie} from '~/cookies.server'

export type Theme = 'light' | 'dark'

export async function getTheme(request: Request): Promise<Theme | null> {
	const cookie = await getUserPrefsCookie(request)

	return cookie.theme ?? null
}
