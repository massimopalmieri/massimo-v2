import {defineWorkspace} from 'vitest/config'

export default defineWorkspace([
	// If you want to keep running your existing tests in Node.js, uncomment the next line.
	// 'vitest.config.ts',
	{
		extends: 'vitest.config.ts',
		test: {
			include: ['**/*.browser.{test,spec}.{ts,tsx}'],
			browser: {
				enabled: true,
				name: 'chromium',
				provider: 'playwright',
				// https://playwright.dev
				providerOptions: {},
			},
		},
	},
	// {
	// 	test: {
	// 		// an example of file based convention,
	// 		// you don't have to follow it
	// 		include: [
	// 			'tests/unit/**/*.{test,spec}.ts',
	// 			'tests/**/*.unit.{test,spec}.ts',
	// 		],
	// 		name: 'unit',
	// 		environment: 'node',
	// 	},
	// },
	// {
	// 	test: {
	// 		// an example of file based convention,
	// 		// you don't have to follow it
	// 		include: [
	// 			'tests/browser/**/*.{test,spec}.ts',
	// 			'tests/**/*.browser.{test,spec}.ts',
	// 		],
	// 		name: 'browser',
	// 		browser: {
	// 			enabled: true,
	// 			name: 'chrome',
	// 		},
	// 	},
	// },
])
