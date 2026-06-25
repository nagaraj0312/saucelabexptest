import { test, expect, Page } from '@playwright/test';

const BASE = 'https://www.saucedemo.com/';

async function doLogin(page: Page): Promise<void> {
  await page.goto(BASE);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.locator('.inventory_list')).toBeVisible();
}

test.describe('Sauce Demo exploratory tests', () => {
  test('Login - Happy Path', async ({ page }) => {
    await page.goto(BASE);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Add and Remove Cart Items', async ({ page }) => {
    await doLogin(page);
    const firstAdd = page.locator('.inventory_list .inventory_item button').first();
    await expect(firstAdd).toBeVisible();
    await firstAdd.click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.click('a.shopping_cart_link');
    await expect(page.locator('.cart_list .cart_item')).toHaveCount(1);
    // Remove the item from cart
    const removeBtn = page.locator('.cart_list .cart_item button');
    await removeBtn.click();
    await expect(page.locator('.cart_list .cart_item')).toHaveCount(0);
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
  });

  test('Checkout Flow - End-to-end', async ({ page }) => {
    await doLogin(page);
    await page.locator('.inventory_list .inventory_item button').first().click();
    await page.click('a.shopping_cart_link');
    await expect(page.locator('.cart_list .cart_item')).toHaveCount(1);
    await page.click('button#checkout');
    await expect(page.locator('#first-name')).toBeVisible();
    await page.fill('#first-name', 'Test');
    await page.fill('#last-name', 'User');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');
    await expect(page.locator('.summary_info')).toBeVisible();
    await page.click('#finish');
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await page.click('#back-to-products');
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('Sorting and Filters', async ({ page }) => {
    await doLogin(page);
    const priceLocator = page.locator('.inventory_item .inventory_item_price');
    // sort low to high
    await page.selectOption('.product_sort_container', 'lohi');
    await page.waitForTimeout(300);
    const texts = await priceLocator.allTextContents();
    const nums = texts.map(t => parseFloat(t.replace('$','')));
    if (nums.length >= 2) {
      expect(nums[0]).toBeLessThanOrEqual(nums[1]);
    }
    // sort Z to A
    await page.selectOption('.product_sort_container', 'za');
    await page.waitForTimeout(300);
    const names = await page.locator('.inventory_item_name').allTextContents();
    if (names.length >= 2) {
      const first = names[0];
      const second = names[1];
      expect(first >= second).toBeTruthy();
    }
  });

  test('Logout and Session Handling', async ({ page }) => {
    await doLogin(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL(BASE);
    // try to access inventory directly
    await page.goto(BASE + 'inventory.html');
    // should be redirected to login
    await expect(page).toHaveURL(BASE);
  });
});
