import {prisma} from '~/db.server'
import {Authenticator} from 'remix-auth'
import {FormStrategy} from 'remix-auth-form'
import {redirect} from 'react-router'
import {getSession, commitSession} from '~/services/session.server'
import * as bcrypt from 'bcrypt'

// Define what your user type looks like
type User = {
	id: string
	email: string
	name: string | null
}

// Create an instance of the authenticator
export const authenticator = new Authenticator<User>()

// Configure FormStrategy
authenticator.use(
	new FormStrategy(async ({form}) => {
		const email = form.get('email')
		const password = form.get('password')

		if (!email || typeof email !== 'string')
			throw new Error('Email is required')
		if (!password || typeof password !== 'string')
			throw new Error('Password is required')

		const user = await prisma.user.findUnique({
			where: {email},
			select: {
				id: true,
				email: true,
				name: true,
				password: true,
			},
		})

		if (!user) throw new Error('Invalid credentials')

		const isValidPassword = await bcrypt.compare(password, user.password)
		if (!isValidPassword) throw new Error('Invalid credentials')

		const {password: _password, ...userWithoutPassword} = user
		return userWithoutPassword
	}),
	'user-pass',
)

export async function authenticate(request: Request, returnTo?: string) {
	const session = await getSession(request.headers.get('cookie'))
	const user = session.get('user')
	if (user) return user
	if (returnTo) session.set('returnTo', returnTo)
	throw redirect('/login', {
		headers: {'Set-Cookie': await commitSession(session)},
	})
}

// Add this utility function for hashing passwords
export async function hashPassword(password: string) {
	const salt = await bcrypt.genSalt(10)
	return bcrypt.hash(password, salt)
}

export class AuthenticationError extends Error {
	constructor(message: string = 'Authentication failed') {
		super(message)
		this.name = 'AuthenticationError'
	}
}
