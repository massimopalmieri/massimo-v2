import {expect, test} from '@playwright/test'
import type {Page} from '@playwright/test'

// Function to wait for reCAPTCHA script to load
async function waitForRecaptcha(page: Page) {
	await page.waitForFunction(() => {
		return typeof window.grecaptcha !== 'undefined' && window.grecaptcha.render
	})
}

test.describe('Index Page', () => {
	test('should display the correct page title', async ({page}) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/Massimo Palmieri/)
	})

	test('should validate contact form fields', async ({page}) => {
		await page.goto('/')

		await waitForRecaptcha(page) // Wait for reCAPTCHA script to load
		await page.getByRole('button', {name: 'Send Message'}).click()

		await expect(page.getByText(/Name is required/i)).toBeVisible()
		await expect(page.getByText(/Invalid email address/i)).toBeVisible()
		await expect(page.getByText(/Message is required/i)).toBeVisible()
	})

	test('should submit the contact form successfully', async ({page}) => {
		await page.goto('/')

		await waitForRecaptcha(page) // Wait for reCAPTCHA script to load

		await page.getByLabel('name').fill('John Doe')
		await page.getByLabel('email').fill('john.doe@example.com')
		await page.getByLabel('message').fill('This is a valid message.')
		await page.getByRole('button', {name: 'Send Message'}).click()
		await expect(page.getByText('Thanks for your message! I’ll')).toBeVisible()
	})
})

test('should have the correct content', async ({page}) => {
	await page.goto('/')
	await expect(page.getByRole('banner')).toMatchAriaSnapshot(`
    - heading "Hello, I’m Massimo" [level=1]
    - paragraph: Senior Web Developer crafting high-performance applications with modern JavaScript. Passionate about clean architecture and exceptional user experiences.
    `)
})

test('should book a restaurant', async ({page}) => {
	const partySize = 3
	const day = 19

	await page.goto('https://www.devonshiresoho.co.uk')

	await page.getByRole('link', {name: 'BOOK ONLINE'}).click()

	// select party size and date
	await page.getByRole('combobox').selectOption(partySize.toString())

	// click on > the needed number of times to reach the desired month from the current one
	await page.getByText('>').click()

	// select the day
	await page.getByText(day.toString()).click()

	// pick between Lunch and Dinner
	await page.getByText('Lunch', {exact: true}).click()

	// search for all the instant book tables
	await expect(page.getByText('Instant Book')).toBeVisible()

	// click on the one that is available and close to the required time
	await page.getByText('Instant Book').click()

	await page.getByPlaceholder('Email').fill('massimopalmieri@gmail.com')
	await page.getByPlaceholder('First name').fill('Massimo')
	await page.getByPlaceholder('Last name').fill('Palmieri')
	await page.getByPlaceholder('Mobile number').fill('07824174839')
	await page.locator('#dob_day').selectOption('string:05')
	await page.locator('#dob_month').selectOption('string:08')
	await page.locator('#dob_year').selectOption('string:1983')
	await page.getByText('I confirm I have read this').click()

	// click on the Book Now button
	// await page.getByRole('button', {name: 'Book Now'}).click()
})


test('should book a restaurant test', async ({page}) => {
	const partySize = 2
	const day = 17

	await page.goto('https://www.devonshiresoho.co.uk')

	await page.getByRole('link', {name: 'BOOK ONLINE'}).click()

	// select party size and date
	await page.getByRole('combobox').selectOption(partySize.toString())

	// click on > the needed number of times to reach the desired month from the current one
	await page.getByText('>').click()

	// select the day
	await page.getByText(day.toString()).click()

	// pick between Lunch and Dinner
	await page.getByText('Lunch', {exact: true}).click()

	
})
