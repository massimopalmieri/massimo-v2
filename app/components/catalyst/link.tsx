/**
 * TODO: Update this component to use your client-side framework's link
 * component. We've provided examples of how to do this for Next.js, Remix, and
 * Inertia.js in the Catalyst documentation:
 *
 * https://catalyst.tailwindui.com/docs#client-side-router-integration
 */

import {DataInteractive} from '@headlessui/react'
import {forwardRef} from 'react'
import type {ComponentPropsWithoutRef, ForwardedRef} from 'react'

export const Link = forwardRef(function Link(
	props: {href: string} & ComponentPropsWithoutRef<'a'>,
	ref: ForwardedRef<HTMLAnchorElement>,
) {
	return (
		<DataInteractive>
			<a {...props} ref={ref} />
		</DataInteractive>
	)
})
