import { test, expect } from "@playwright/test";

test("home links render", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Calendario" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Revisión semanal" })).toBeVisible();
});

test("entries page loads", async ({ page }) => {
  await page.goto("/entries");
  await expect(page.getByRole("heading", { name: "Entradas" })).toBeVisible();
});


