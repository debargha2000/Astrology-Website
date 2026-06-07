import { test, expect } from '@playwright/test';

test.describe('Zodiac Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zodiac-calculator');
  });

  test('should load zodiac calculator page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Zodiac');
    await expect(page.locator('[name="birthDate"]')).toBeVisible();
  });

  test('should calculate zodiac sign from birth date', async ({ page }) => {
    await page.fill('[name="birthDate"]', '1990-05-15');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.locator('text=Taurus')).toBeVisible();
    await expect(page.locator('text=Venus')).toBeVisible();
  });

  test('should show recommended products for sign', async ({ page }) => {
    await page.fill('[name="birthDate"]', '1990-07-25');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.locator('text=Leo')).toBeVisible();
    await expect(page.locator('[data-testid="recommended-product"]').first()).toBeVisible();
  });

  test('should add recommended product to cart', async ({ page }) => {
    await page.fill('[name="birthDate"]', '1990-07-25');
    await page.click('button:has-text("Calculate")');
    
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.locator('text=Added to Cart')).toBeVisible();
  });

  test('should show element and ruling planet', async ({ page }) => {
    await page.fill('[name="birthDate"]', '1990-03-21');
    await page.click('button:has-text("Calculate")');
    
    await expect(page.locator('text=Fire')).toBeVisible();
    await expect(page.locator('text=Mars')).toBeVisible();
  });
});