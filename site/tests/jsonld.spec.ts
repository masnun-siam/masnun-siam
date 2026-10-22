import { expect, test } from '@playwright/test';

const on = process.env.FEATURE_SEO_AEO === 'true';
const ID = 'https://masnunsiam.com/#';

test('flag on: one JSON-LD block with the Person facts', async ({ page, request }) => {
	test.skip(!on, 'flag-on assertions');
	await page.goto('/');
	const blocks = page.locator('script[type="application/ld+json"]');
	await expect(blocks).toHaveCount(1);
	const raw = (await blocks.textContent()) ?? '';
	expect(raw).not.toContain('<');
	expect(raw.length).toBeLessThan(3072);

	const graph = JSON.parse(raw)['@graph'];
	const node = (type: string) => graph.find((n: { '@type': string }) => n['@type'] === type);
	expect(graph).toHaveLength(3);
	expect(node('ProfilePage').mainEntity['@id']).toBe(`${ID}person`);
	expect(node('ProfilePage').isPartOf['@id']).toBe(`${ID}website`);
	const person = node('Person');
	expect(person.name).toBe('Masnun Siam');
	expect(person.description).toBe('Software Engineer · Laravel · Flutter · AI tools');
	expect(person.jobTitle).toBe('Software Engineer');
	expect(person.worksFor.name).toBe('BluBird Interactive Ltd.');
	expect(person.address).toMatchObject({ addressLocality: 'Dhaka', addressCountry: 'Bangladesh' });
	expect(person.sameAs).toEqual([
		'https://github.com/masnun-siam',
		'https://linkedin.com/in/msiamn',
		'https://stackoverflow.com/users/13317943/masnun-siam',
		'https://codeforces.com/profile/msiamn',
	]);
	expect(person.knowsAbout).toContain('Laravel');
	expect(person.email).toBeUndefined();
	expect(person.image).toBeUndefined();

	// The 404 page never carries JSON-LD.
	expect(await (await request.get('/no-such-page')).text()).not.toContain('application/ld+json');
});

test('flag off: no JSON-LD on / or the 404 page', async ({ page, request }) => {
	test.skip(on, 'flag-off assertions');
	await page.goto('/');
	await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
	expect(await (await request.get('/no-such-page')).text()).not.toContain('application/ld+json');
});
