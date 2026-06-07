import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('should load shop page with products', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Explore Gemstone Codex');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should filter by category', async ({ page }) => {
    await page.click('button:has-text("Bracelets")');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="product-card"]').first()).toContainText('bracelet');
  });

  test('should filter by ring category', async ({ page }) => {
    await page.click('button:has-text("Rings")');
    await expect(page.locator('[data-testid="product-card"]').first()).toBeVisible();
  });

  test('should sort by price low to high', async ({ page }) => {
    await page.selectOption('#shop-sort-list', 'price-low');
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    const sorted = [...prices].sort((a, b) => parseFloat(a.replace(/[^0-9.]/g, '')) - parseFloat(b.replace(/[^0-9.]/g, '')));
    expect(prices).toEqual(sorted);
  });

  test('should sort by price high to low', async ({ page }) => {
    await page.selectOption('#shop-sort-list', 'price-high');
    const prices = await page.locator('[data-testid="product-price"]').allTextContents();
    const sorted = [...prices].sort((a, b) => parseFloat(b.replace(/[^0-9.]/g, '')) - parseFloat(a.replace(/[^0-9.]/g, '')));
    expect(prices).toEqual(sorted);
  });

  test('should add product to cart', async ({ page }) => {
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.locator('text=Added to Cart')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toContainText('1');
  });

  test('should open cart drawer', async ({ page }) => {
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await expect(page.locator('[role="dialog"][data-testid="cart-drawer"]')).toBeVisible();
  });
});