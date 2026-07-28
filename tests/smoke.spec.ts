import { test, expect } from "@playwright/test";

test.describe("landing", () => {
  test("renders headline and CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("Say more");
    // Two App Store badges in hero, one pricing card, one final CTA = 3+ visible on page
    const appStoreBadges = page.locator('[aria-label*="App Store"]');
    expect(await appStoreBadges.count()).toBeGreaterThanOrEqual(4);
  });

  test("no console errors on landing", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("has exactly one h1", async ({ page }) => {
    await page.goto("/");
    const h1s = await page.locator("h1").count();
    expect(h1s).toBe(1);
  });
});
