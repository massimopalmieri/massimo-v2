import type {Route} from './+types/test'

export async function loader() {
	const response = await fetch('https://api.example.com/user')
	const serverSideData = await response.json()

	return {
		serverSideData,
	}
}

export default function Component({loaderData}: Route.ComponentProps) {
	const {serverSideData} = loaderData

	return <div>{serverSideData.firstName}</div>
}
