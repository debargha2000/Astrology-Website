import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load home page with hero section', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('The Indian');
    await expect(page.locator('text=Science of Signs')).toBeVisible();
  });

  test('should navigate to shop page', async ({ page }) => {
    await page.click('text=Explore Curations');
    await expect(page).toHaveURL(/.*shop/);
    await expect(page.locator('h2')).toContainText('Explore Gemstone Codex');
  });

  test('should navigate to zodiac calculator', async ({ page }) => {
    await page.click('text=Find Your Zodiac Crystal');
    await expect(page).toHaveURL(/.*zodiac-calculator/);
    await expect(page.locator('h1')).toContainText('Zodiac');
  });

  test('should display bestseller products', async ({ page }) => {
    await expect(page.locator('text=Master Signature Bestsellers')).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should navigate to product detail', async ({ page }) => {
    await page.locator('[data-testid="product-card"]').first().click();
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.locator('text=Test Product')).toBeVisible();
  });
});