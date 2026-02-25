import {describe, expect, it} from 'vitest'
import {render} from 'vitest-browser-react'
import {Button} from './button'
import '../../../app/app.css'

// describe('Alert', () => {
// 	it('should render', async () => {
// 		const {getByText} = render(
// 			<Alert
// 				open={true}
// 				onClose={() => vi.fn()}
// 				className="bg-red-400 text-amber-950 font-sans"
// 			>
// 				Hello world
// 			</Alert>,
// 		)
// 		// await expect.element(getByText('Hello world')).toBeInTheDocument()
// 	})
// })

describe('Button', () => {
	it('should render', async () => {
		const {getByText} = render(
			<Button onClick={() => console.log('ciao')}>Click me</Button>,
		)
		await expect.element(getByText('Click me')).toBeInTheDocument()
	})
})
