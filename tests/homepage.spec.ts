import { test, expect } from "@playwright/test";

test.describe("Index Page", () => {
  test("should display the correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Massimo Palmieri/);
  });

  test("should scroll to contact section when contact button is clicked", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Contact me" }).click();
    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    await expect(page.getByText("Name")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Send Message" })
    ).toBeVisible();
  });

  test("should validate contact form fields", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Send Message" }).click();
    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(page.getByText("Message must be at least 10")).toBeVisible();
  });

  test("should submit the contact form successfully", async ({ page }) => {
    await page.route("*/**/api/contact.data", async (route) => {
      const json = [{ name: "Strawberry", id: 21 }];
      await route.fulfill({ json });
    });

    await page.goto("/");

    await page.click('a[href="#contact"]');
    await page.getByLabel("name").fill("John Doe");
    await page.getByLabel("email").fill("john.doe@example.com");
    await page.getByLabel("message").fill("This is a valid message.");
    await page.getByRole("button", { name: "Send Message" }).click();
  });
});
