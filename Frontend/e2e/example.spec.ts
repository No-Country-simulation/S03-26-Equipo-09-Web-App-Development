import { expect, test } from "@playwright/test";

test("renderiza pantalla inicial", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle(/vite react boilerplate/i);
	await expect(page.getByText(/hello, world!|hola, mundo!/i)).toBeVisible();
});
