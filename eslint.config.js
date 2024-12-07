import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'

export default tseslint.config(
	{
		ignores: ['build', 'public', 'playwright-report', '.react-router'],
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
		settings: {
			react: {
				version: 'detect',
			},
		},
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	pluginReact.configs.flat.recommended,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/consistent-type-exports': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
			'react/react-in-jsx-scope': 'off',
		},
	},
)
