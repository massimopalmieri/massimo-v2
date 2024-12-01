import { test, expect, Page } from "@playwright/test";

// Function to wait for reCAPTCHA script to load
async function waitForRecaptcha(page: Page) {
  await page.waitForFunction(() => {
    return typeof window.grecaptcha !== "undefined" && window.grecaptcha.render;
  });
}

test.describe("Index Page", () => {
  test("should display the correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Massimo Palmieri/);
  });

  test("should validate contact form fields", async ({ page }) => {
    await page.goto("/");

    await waitForRecaptcha(page); // Wait for reCAPTCHA script to load
    await page.getByRole("button", { name: "Send Message" }).click();

    await expect(page.getByText(/Name is required/i)).toBeVisible();
    await expect(page.getByText(/Invalid email address/i)).toBeVisible();
    await expect(page.getByText(/Message is required/i)).toBeVisible();
  });

  test("should submit the contact form successfully", async ({ page }) => {
    await page.goto("/");

    await waitForRecaptcha(page); // Wait for reCAPTCHA script to load

    await page.getByLabel("name").fill("John Doe");
    await page.getByLabel("email").fill("john.doe@example.com");
    await page.getByLabel("message").fill("This is a valid message.");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Thanks for your message! I’ll")).toBeVisible();
  });
});
