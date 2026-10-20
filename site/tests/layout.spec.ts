import { expect, test } from '@playwright/test';

const SECTIONS = ['about', 'work', 'projects', 'skills', 'contact'];

test('five sections in order, each with a visible heading', async ({ page }) => {
	await page.goto('/');
	const ids = await page.locator('main > section').evaluateAll((els) => els.map((el) => el.id));
	expect(ids).toEqual(SECTIONS);
	for (const id of SECTIONS) {
		const labelledby = await page.locator(`#${id}`).getAttribute('aria-labelledby');
		await expect(page.locator(`#${labelledby}`)).toBeVisible();
	}
});

test('nav and footer links target existing sections', async ({ page }) => {
	await page.goto('/');
	const navHrefs = await page.locator('header nav a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
	expect(navHrefs).toEqual(['/#work', '/#projects', '/#skills']);
	const footer = page.locator('footer a', { hasText: 'to contact' });
	await expect(footer).toHaveAttribute('href', '/#contact');
	for (const href of [...navHrefs, '/#contact']) {
		await expect(page.locator(`[id="${href?.slice(2)}"]`)).toHaveCount(1);
	}
});

test('every internal link resolves', async ({ page, request }) => {
	await page.goto('/');
	const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href') ?? ''));
	expect(hrefs.length).toBeGreaterThan(0);
	for (const href of new Set(hrefs)) {
		const [path, hash] = href.split('#');
		expect((await request.get(path || '/')).status(), href).toBe(200);
		if (hash) await expect(page.locator(`[id="${hash}"]`), href).toHaveCount(1);
	}
});

test('console has no errors', async ({ page }) => {
	const errors: string[] = [];
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
	page.on('pageerror', (e) => errors.push(e.message));
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	expect(errors).toEqual([]);
});

test('no horizontal scroll at 320px', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 640 });
	await page.goto('/');
	const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
	expect(overflow).toBeLessThanOrEqual(0);
});

test('Tab reaches every link and the theme toggle', async ({ page }) => {
	await page.goto('/');
	const focusable = page.locator('a[href], button');
	const total = await focusable.count();
	const reached = new Set<string>();
	for (let i = 0; i < total + 1; i++) {
		await page.keyboard.press('Tab');
		reached.add(
			await page.evaluate(() => {
				const el = document.activeElement;
				return `${el?.tagName}|${el?.getAttribute('href') ?? el?.id}|${el?.textContent?.trim()}`;
			}),
		);
		if (i === 0) await expect(page.locator('a.skip-link')).toBeFocused();
	}
	const expected = await focusable.evaluateAll((els) =>
		els.map((el) => `${el.tagName}|${el.getAttribute('href') ?? el.id}|${el.textContent?.trim()}`),
	);
	for (const key of expected) expect(reached.has(key), key).toBe(true);
});

test('unknown path is a 404 with the custom page', async ({ page }) => {
	const response = await page.goto('/nope');
	expect(response?.status()).toBe(404);
	await expect(page.locator('h1')).toHaveText('E37: No such page');
	await expect(page.locator('main a[href="/"]')).toBeVisible();
});
