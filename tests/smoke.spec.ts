import { test, expect } from '@playwright/test';

test.describe('DevOps Atlas', () => {
  test('the landing shows every module and its pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.landing__display')).toBeVisible();
    await expect(page.locator('.mcard')).toHaveCount(5);
    await expect(page.locator('.mcard__pages li')).toHaveCount(20);
    await page.locator('.landing__cta').click();
    await expect(page).toHaveURL(/\/foundations\/$/);
  });

  test('stores no reader state', async ({ page }) => {
    await page.goto('/foundations/networking/');
    const keys = await page.evaluate(() => Object.keys(window.localStorage)
      .filter((key) => key.startsWith('devops-atlas')));
    expect(keys).toEqual([]);
  });

  test('a page carries orientation and cross-links', async ({ page }) => {
    await page.goto('/foundations/networking/');
    await expect(page.locator('.atlas-title__module')).toContainText('Fundamentos');
    await expect(page.locator('.atlas-related section')).not.toHaveCount(0);
    await expect(page.locator('.atlas-seq__link--next')).toBeVisible();
  });

  test('the A–Z lists tools with the pages that cover them', async ({ page }) => {
    await page.goto('/tools/');
    await expect(page.getByRole('heading', { name: 'Herramientas A–Z' })).toBeVisible();
    await expect(page.locator('.atlas-tools__entry').first()).toBeVisible();
    await page.locator('.atlas-tools__entry a').first().click();
    await expect(page).toHaveURL(/\/(foundations|collaboration|delivery|testing|deployment)\//);
  });

  test('serves the equivalent English index', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('.mcard')).toHaveCount(5);
    await expect(page.getByRole('heading', { name: 'Foundations', exact: true })).toBeVisible();
    await expect(page.locator('h1:visible')).toHaveCount(1);
  });
});
