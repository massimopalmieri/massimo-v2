import {expect, test} from '@playwright/test'

test.describe('Index Page', () => {
	test('should display the correct page title', async ({page}) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/Massimo Palmieri/)
	})

	test('should show contact links', async ({page}) => {
		await page.goto('/')
		await expect(page.getByRole('link', {name: 'LinkedIn'})).toBeVisible()
		await expect(page.getByRole('link', {name: 'Email'})).toBeVisible()
	})

	test('should show contact notice when clicking Send Message', async ({page}) => {
		await page.goto('/')
		await page.getByRole('button', {name: 'Send Message'}).click()
		await expect(
			page.getByText('Contact form disabled. Use one of the links below.'),
		).toBeVisible()
	})
})
