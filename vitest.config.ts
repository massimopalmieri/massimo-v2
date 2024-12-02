import {defineConfig} from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'happy-dom',
		// setupFiles: "./test/setup.ts",
		include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		exclude: ['node_modules', 'tests'],
		coverage: {
			include: ['app'],
			exclude: ['app/mocks'],
		},
	},
})
