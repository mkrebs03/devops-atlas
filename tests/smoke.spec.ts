import { test, expect } from '@playwright/test';

test.describe('DevOps Atlas', () => {
  test('renders the visual route and module cards', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /Aprende la cadena/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Fundamentos/i }).first()).toBeVisible();
    await expect(page.locator('[data-atlas-card]')).toHaveCount(5);
  });

  test('filters the atlas by content type', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-atlas-filter="type"]').selectOption('lab');
    await expect(page.locator('[data-atlas-card]:visible')).toHaveCount(1);
    await expect(page.locator('[data-atlas-card]:visible')).toContainText(/pipeline/i);
  });

  test('serves the English route', async ({ page }) => {
    await page.goto('/en/');

    await expect(page.getByRole('heading', { name: /Learn the chain/i })).toBeVisible();
    await expect(page.getByText('Foundations', { exact: true }).first()).toBeVisible();
  });

  test('opens the first learning module', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Explorar módulo/i }).first().click();
    await expect(page).toHaveURL(/\/foundations\/$/);
    await expect(page.getByRole('heading', { name: 'Fundamentos', exact: true })).toBeVisible();
  });
});
