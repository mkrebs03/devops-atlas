import { test, expect } from '@playwright/test';
import { MODULE_IDS, modules, pages } from '../src/data/curriculum.mjs';

// Derived, so renaming a module in the curriculum cannot leave this assertion
// silently passing against a directory that no longer exists.
const anyModulePath = new RegExp(`/(${MODULE_IDS.join('|')})/`);

test.describe('DevOps Atlas', () => {
  test('the landing shows every module and its pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.landing__display')).toBeVisible();
    await expect(page.locator('.mcard')).toHaveCount(modules.length);
    await expect(page.locator('.mcard__pages li')).toHaveCount(pages.length);
    await page.locator('.landing__cta').click();
    await expect(page).toHaveURL(/\/what-is-devops\/$/);
  });

  test('stores no reader state beyond the theme choice', async ({ page }) => {
    await page.goto('/foundations/networking/');
    await page.locator('[data-atlas-theme-toggle]').first().click();
    const keys = await page.evaluate(() => Object.keys(window.localStorage));
    expect(keys).toEqual(['starlight-theme']);
  });

  test('a page carries orientation and cross-links', async ({ page }) => {
    await page.goto('/foundations/networking/');
    await expect(page.locator('.atlas-title__module')).toContainText('Fundamentos');
    await expect(page.locator('.atlas-related section')).not.toHaveCount(0);
    await expect(page.locator('.atlas-seq__link--next')).toBeVisible();
  });

  test('the English mirror carries the same orientation and cross-links', async ({ page }) => {
    await page.goto('/en/foundations/networking/');
    await expect(page.locator('.atlas-title__module')).toContainText('Foundations');
    await expect(page.locator('.atlas-related section')).not.toHaveCount(0);
    await expect(page.locator('.atlas-seq__link--next')).toBeVisible();
  });

  test('the A–Z lists tools with the pages that cover them', async ({ page }) => {
    await page.goto('/tools/');
    await expect(page.getByRole('heading', { name: 'Herramientas A–Z' })).toBeVisible();
    await expect(page.locator('.atlas-tools__entry').first()).toBeVisible();
    await page.locator('.atlas-tools__entry a').first().click();
    await expect(page).toHaveURL(anyModulePath);
  });

  test('serves the equivalent English index', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('.mcard')).toHaveCount(modules.length);
    await expect(page.getByRole('heading', { name: 'Foundations', exact: true })).toBeVisible();
    await expect(page.locator('h1:visible')).toHaveCount(1);
  });

  test('an unknown route answers with a real 404', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
  });

  test('the retired linux-cli slugs redirect to terminal', async ({ page }) => {
    await page.goto('/foundations/linux-cli/');
    await expect(page).toHaveURL(/\/foundations\/terminal\/$/);
    await page.goto('/en/foundations/linux-cli/');
    await expect(page).toHaveURL(/\/en\/foundations\/terminal\/$/);
  });

  test('the pre-restructure module slugs still resolve', async ({ page }) => {
    await page.goto('/delivery/docker/');
    await expect(page).toHaveURL(/\/containers\/docker\/$/);
    await page.goto('/delivery/github-actions/');
    await expect(page).toHaveURL(/\/integration\/github-actions\/$/);
    await page.goto('/testing/in-ci/');
    await expect(page).toHaveURL(/\/integration\/tests-in-ci\/$/);
    await page.goto('/en/collaboration/github-flow/');
    await expect(page).toHaveURL(/\/en\/collaboration\/pull-requests\/$/);
    await page.goto('/deployment/proxy/');
    await expect(page).toHaveURL(/\/server\/proxy-tls\/$/);
    await page.goto('/deployment/observability/');
    await expect(page).toHaveURL(/\/scaling\/observability\/$/);
  });

  test('the retired testing module resolves inside integration', async ({ page }) => {
    await page.goto('/testing/');
    await expect(page).toHaveURL(/\/integration\/$/);
    await page.goto('/testing/pyramid/');
    await expect(page).toHaveURL(/\/integration\/pyramid\/$/);
    await page.goto('/en/testing/lab-first-test/');
    await expect(page).toHaveURL(/\/en\/integration\/lab-ci\/$/);
  });

  test('the sample application page is reachable in both editions', async ({ page }) => {
    await page.goto('/sample-app/');
    await expect(page.getByRole('heading', { level: 1, name: 'La aplicación de ejemplo' })).toBeVisible();
    await page.goto('/en/sample-app/');
    await expect(page.getByRole('heading', { level: 1, name: 'The sample application' })).toBeVisible();
  });

  test('mermaid blocks render as diagrams', async ({ page }) => {
    await page.goto('/foundations/networking/');
    await expect(page.locator('figure.atlas-diagram svg').first()).toBeVisible({ timeout: 15_000 });
  });

  test('search finds a known term', async ({ page }) => {
    // Pagefind only indexes the built output: dev mode has no index to query.
    test.skip(!process.env.CI, 'Search runs against the built site (astro preview in CI)');
    await page.goto('/');
    await page.locator('button[data-open-modal]').click();
    const input = page.locator('.pagefind-ui__search-input');
    await expect(input).toBeVisible();
    await input.fill('Docker');
    await expect(page.locator('.pagefind-ui__result-link').first()).toBeVisible({ timeout: 15_000 });
  });
});
