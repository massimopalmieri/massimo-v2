import {destroySession, getSession} from '~/services/session.server'
import type {Route} from './+types/logout'
import {redirect} from 'react-router'

export async function action({request}: Route.ActionArgs) {
	const session = await getSession(request.headers.get('cookie'))
	return redirect('/login', {
		headers: {'Set-Cookie': await destroySession(session)},
	})
}
