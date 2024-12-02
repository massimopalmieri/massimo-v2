import {getHintUtils} from '@epic-web/client-hints'
import {
	clientHint as colourSchemeHint,
	subscribeToSchemeChange,
} from '@epic-web/client-hints/color-scheme'
import {useRevalidator} from 'react-router'
import {useEffect} from 'react'

const hintsUtils = getHintUtils({
	theme: {
		...colourSchemeHint,
		fallback: 'dark',
	},
})

export const {getHints} = hintsUtils

export function ClientHintCheck() {
	const {revalidate} = useRevalidator()

	useEffect(() => subscribeToSchemeChange(() => revalidate()), [revalidate])

	return (
		<script
			dangerouslySetInnerHTML={{
				__html: hintsUtils.getClientHintCheckScript(),
			}}
		/>
	)
}
