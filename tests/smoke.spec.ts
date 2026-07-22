import { test, expect } from '@playwright/test';

test.describe('DevOps Atlas', () => {
  test('presents the guided route', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Entiende el recorrido/i })).toBeVisible();
    await expect(page.locator('[data-module-id]')).toHaveCount(4);
    await expect(page.locator('[data-progress-step]')).toHaveCount(16);
    await expect(page.getByText('ATLAS / 001')).toHaveCount(0);
    await expect(page.getByText(/VALPARAÍSO/)).toHaveCount(0);
  });

  test('serves the equivalent English route', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.getByRole('heading', { name: /Understand the path/i })).toBeVisible();
    await expect(page.getByText('Foundations', { exact: true }).first()).toBeVisible();
    await expect(page.locator('h1:visible')).toHaveCount(1);
  });

  test('opens the first learning step', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Comenzar la ruta/i }).click();
    await expect(page).toHaveURL(/\/foundations\/$/);
    await expect(page.getByRole('heading', { name: 'Fundamentos', exact: true })).toBeVisible();
    await expect(page.getByText('Al terminar podrás', { exact: true })).toBeVisible();
  });
});
