import { expect, test } from '@playwright/test';

const on = process.env.FEATURE_SEO_AEO === 'true';

test('flag on: sitemap.xml lists the home page; robots.txt points to it', async ({ request }) => {
	test.skip(!on, 'flag-on assertions');
	const res = await request.get('/sitemap.xml');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('xml');
	const xml = await res.text();
	expect(xml.match(/<loc>/g)).toHaveLength(1);
	expect(xml).toContain('<loc>https://masnunsiam.com/</loc>');
	expect(xml).not.toContain('404');
	for (const tag of ['lastmod', 'changefreq', 'priority']) expect(xml).not.toContain(tag);

	const robots = await (await request.get('/robots.txt')).text();
	expect(robots).toContain('User-agent: *');
	expect(robots).toContain('Allow: /');
	expect(robots).toContain('Sitemap: https://masnunsiam.com/sitemap.xml\n');
	expect(robots).not.toContain('Disallow');
});

test('flag off: no sitemap.xml and robots.txt is unchanged', async ({ request }) => {
	test.skip(on, 'flag-off assertions');
	expect((await request.get('/sitemap.xml')).status()).toBe(404);
	expect(await (await request.get('/robots.txt')).text()).toBe('User-agent: *\nAllow: /\n');
});
