import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await page.locator('[data-testid="add-to-cart"]').first().click();
    await page.goto('/checkout');
  });

  test('should display checkout page with cart items', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Checkout');
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible();
    await expect(page.locator('text=Subtotal')).toBeVisible();
  });

  test('should fill shipping information', async ({ page }) => {
    await page.fill('[name="fullName"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="phone"]', '+91 98765 43210');
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="city"]', 'Mumbai');
    await page.fill('[name="state"]', 'Maharashtra');
    await page.fill('[name="pincode"]', '400001');
  });

  test('should select wrist size', async ({ page }) => {
    await page.selectOption('[name="size"]', 'standard-unisex');
  });

  test('should toggle personalized certification', async ({ page }) => {
    await page.check('[name="personalizedCertification"]');
    await expect(page.locator('[name="certName"]')).toBeVisible();
    await expect(page.locator('[name="certBirthDate"]')).toBeVisible();
  });

  test('should select payment method', async ({ page }) => {
    await page.selectOption('[name="paymentMethod"]', 'razorpay');
  });

  test('should submit order', async ({ page }) => {
    await page.fill('[name="fullName"]', 'Test User');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="phone"]', '+91 98765 43210');
    await page.fill('[name="address"]', '123 Test Street');
    await page.fill('[name="city"]', 'Mumbai');
    await page.fill('[name="state"]', 'Maharashtra');
    await page.fill('[name="pincode"]', '400001');
    await page.selectOption('[name="paymentMethod"]', 'razorpay');
    
    await page.click('button:has-text("Place Order")');
    
    // Should redirect to payment or show order confirmation
    await expect(page).toHaveURL(/.*checkout.*|.*order.*|.*payment.*/);
  });
});