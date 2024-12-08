import {reactRouter} from '@react-router/dev/vite'
import {defineConfig} from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
	},
	optimizeDeps: {
		exclude: ['nock', 'mock-aws-s3', 'aws-sdk', '@mapbox'],
	},
	plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
})
