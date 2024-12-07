import {data} from 'react-router'
import type {Route} from './+types/api.theme'
import {getUserPrefsCookie, userPrefsCookie} from '~/cookies.server'

export async function action({request}: Route.ActionArgs) {
	const formData = await request.formData()
	const theme = formData.get('theme')

	if (theme !== 'light' && theme !== 'dark') {
		return data({success: false}, {status: 400})
	}

	const cookie = await getUserPrefsCookie(request)
	cookie.theme = theme

	return data(
		{success: true},
		{
			headers: {
				'Set-Cookie': await userPrefsCookie.serialize(cookie),
			},
		},
	)
}
