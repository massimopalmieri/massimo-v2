import type {Route} from './+types/drizzle'
import {Form} from 'react-router'
import invariant from 'tiny-invariant'
import {prisma} from '~/db.server'

export async function action({request}: Route.ActionArgs) {
	const formData = await request.formData()
	const title = formData.get('title')

	invariant(typeof title === 'string', 'Title is required')

	await prisma.item.create({
		data: {
			title,
			description: 'description',
		},
	})

	return {
		success: true,
	}
}

export async function loader() {
	try {
		const data = await prisma.item.findMany()

		return {
			data,
		}
	} catch (error) {
		throw new Response('Failed to load items', {status: 500})
		console.error(error)
	}
}

export default function Index({loaderData}: Route.ComponentProps) {
	const {data} = loaderData

	return (
		<div>
			<h1> Items </h1>
			<ul>
				{data.map((item) => (
					<li key={item.id}>{item.title}</li>
				))}
			</ul>
			<h1> Prisma </h1>
			<Form method="POST">
				<input type="text" name="title" />
				<input type="submit" value="Submit" />
			</Form>
		</div>
	)
}
