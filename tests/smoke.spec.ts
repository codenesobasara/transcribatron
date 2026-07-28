import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page).toHaveTitle(/Transcribatron/);
  expect(errors).toEqual([]);
});
