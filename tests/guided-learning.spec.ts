import { test, expect } from '@playwright/test';

const PROGRESS_KEY = 'devops-atlas:progress:v1';

test.describe('learning progress', () => {
  test('persists completion after reload', async ({ page }) => {
    await page.goto('/foundations/');
    const button = page.getByRole('button', { name: 'Marcar como completada' });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole('button', { name: 'Marcar como pendiente' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Marcar como pendiente' })).toBeVisible();
  });

  test('continues at the next incomplete step', async ({ page }) => {
    await page.addInitScript(({ key }) => localStorage.setItem(key, JSON.stringify({ version: 1, completed: ['foundations.overview'], lastVisited: 'foundations.overview' })), { key: PROGRESS_KEY });
    await page.goto('/');
    const resume = page.locator('[data-resume-link]').first();
    await expect(resume).toContainText('Continuar aprendiendo');
    await expect(resume).toHaveAttribute('href', '/foundations/linux-cli/');
  });

  test('shares progress between languages', async ({ page }) => {
    await page.goto('/foundations/');
    await page.getByRole('button', { name: 'Marcar como completada' }).click();
    await page.getByRole('banner').getByLabel('Seleccionar idioma').selectOption({ label: 'English' });
    await expect(page).toHaveURL(/\/en\/foundations\/$/);
    await expect(page.getByRole('button', { name: 'Mark as pending' })).toBeVisible();
  });

  test('keeps lessons usable when storage is unavailable', async ({ page }) => {
    const errors: Error[] = [];
    page.on('pageerror', (error) => errors.push(error));
    await page.addInitScript(({ key }) => {
      const getItem = Storage.prototype.getItem;
      const setItem = Storage.prototype.setItem;
      Storage.prototype.getItem = function (name) { if (name.startsWith(key)) throw new DOMException('disabled', 'SecurityError'); return getItem.call(this, name); };
      Storage.prototype.setItem = function (name, value) { if (name.startsWith(key)) throw new DOMException('disabled', 'SecurityError'); return setItem.call(this, name, value); };
    }, { key: PROGRESS_KEY });
    await page.goto('/foundations/');
    await expect(page.getByRole('heading', { name: 'Fundamentos', exact: true })).toBeVisible();
    await expect(page.locator('[data-progress-control]')).toBeHidden();
    await expect(page.getByRole('link', { name: /Linux y terminal/i }).last()).toBeVisible();
    expect(errors).toEqual([]);
  });
});

test.describe('mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const path of ['/', '/foundations/linux-cli/']) {
    test(`has no horizontal overflow on ${path}`, async ({ page }) => {
      await page.goto(path);
      const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
      expect(widths.scroll).toBeLessThanOrEqual(widths.client);
      const minimum = await page.locator('button:visible, a:visible, summary:visible').evaluateAll((elements) => Math.min(...elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize))));
      expect(minimum).toBeGreaterThanOrEqual(14);
    });
  }
});
