import { expect, test } from '@playwright/test';

// Flag-off outputs; the flag-on specs (llms, sitemap, jsonld) assert the opposite state.
test.skip(process.env.FEATURE_SEO_AEO === 'true', 'flag-off assertions');

test('flag off: no sitemap, no llms.txt, plain robots.txt, no JSON-LD', async ({ page, request }) => {
	expect((await request.get('/sitemap.xml')).status()).toBe(404);
	expect((await request.get('/llms.txt')).status()).toBe(404);
	const robots = await (await request.get('/robots.txt')).text();
	expect(robots).toBe('User-agent: *\nAllow: /\n');
	expect(robots).not.toContain('Sitemap:');
	await page.goto('/');
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
});
