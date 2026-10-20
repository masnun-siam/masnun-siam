import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'dark' });

test('follows the system theme, toggles, and the choice persists', async ({ page }) => {
	await page.goto('/');
	const html = page.locator('html');
	await expect(html).toHaveAttribute('data-theme', 'dark');
	await expect(page.locator('#theme-toggle')).toHaveAttribute('aria-pressed', 'true');

	await page.locator('#theme-toggle').click();
	await expect(html).toHaveAttribute('data-theme', 'light');
	expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('light');

	await page.reload();
	await expect(html).toHaveAttribute('data-theme', 'light');
});

test('an invalid stored value falls back to the system theme', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('theme', 'purple'));
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('still toggles with storage blocked, without console errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	page.on('pageerror', (e) => errors.push(e.message));
	await page.addInitScript(() => {
		const fail = () => {
			throw new DOMException('blocked', 'SecurityError');
		};
		Storage.prototype.getItem = fail;
		Storage.prototype.setItem = fail;
	});
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
	await page.locator('#theme-toggle').click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	expect(errors).toEqual([]);
});
