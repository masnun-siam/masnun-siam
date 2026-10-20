import { expect, test } from '@playwright/test';

test('SEO tags are in the HTML', async ({ page, request }) => {
	await page.goto('/');
	const content = (selector: string) => page.locator(selector).getAttribute('content');
	await expect(page).toHaveTitle('Masnun Siam — Software Engineer');
	expect(await content('meta[name=description]')).toContain('software engineer');
	await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://masnunsiam.com/');
	expect(await content('meta[property="og:title"]')).toBe('Masnun Siam — Software Engineer');
	expect(await content('meta[property="og:description"]')).toBeTruthy();
	expect(await content('meta[property="og:image"]')).toBe('https://masnunsiam.com/og.png');
	expect(await content('meta[name="twitter:card"]')).toBe('summary_large_image');
	await expect(page.locator('link[rel=icon]')).toHaveCount(1);

	expect((await request.get('/og.png')).status()).toBe(200);
	expect(await (await request.get('/robots.txt')).text()).toContain('Allow: /');
});
