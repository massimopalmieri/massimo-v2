import {useEffect, useState} from 'react'

export function useTheme() {
	const [theme, setTheme] = useState<'light' | 'dark'>('dark')

	useEffect(() => {
		const persisted = window.localStorage.getItem('theme')
		if (persisted === 'light' || persisted === 'dark') {
			setTheme(persisted)
			document.documentElement.classList.toggle('dark', persisted === 'dark')
			return
		}
		setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
	}, [])

	function toggleTheme() {
		const newTheme = theme === 'dark' ? 'light' : 'dark'
		setTheme(newTheme)
		document.documentElement.classList.toggle('dark', newTheme === 'dark')
		window.localStorage.setItem('theme', newTheme)
	}

	return {theme, toggleTheme}
}
