import { expect, test } from '@playwright/test';

const on = process.env.FEATURE_SEO_AEO === 'true';

test('flag on: /llms.txt lists the content', async ({ request }) => {
	test.skip(!on, 'flag-on assertions');
	const res = await request.get('/llms.txt');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('text/plain');
	const body = await res.text();
	expect(body.startsWith('# Masnun Siam')).toBe(true);
	expect(body).toContain('> Software Engineer · Laravel · Flutter · AI tools — Dhaka, Bangladesh');
	// Four roles, in the Work section's order (newest first).
	const roles = [
		'Software Engineer, BluBird Interactive Ltd. (Oct 2024 – Present)',
		'Senior Software Engineer (Mobile), Binary Fusion (Mar 2024 – Oct 2024)',
	];
	for (const r of roles) expect(body).toContain(r);
	expect(body.match(/^- .+ \(\w{3} \d{4} – (\w{3} \d{4}|Present)\), /gm)).toHaveLength(4);
	expect(body.match(/^- \[[^\]]+\]\(https:\/\/github\.com\/masnun-siam\/[^)]+\): /gm)).toHaveLength(6);
	expect(body).toContain('- [ai-workflow](https://github.com/masnun-siam/ai-workflow): ');
	expect(body).toContain('- Mobile: Flutter, Dart, Firebase, Appwrite');
	expect(body).toContain('- Email: echo@masnunsiam.com');
	for (const url of [
		'https://github.com/masnun-siam',
		'https://linkedin.com/in/msiamn',
		'https://stackoverflow.com/users/13317943/masnun-siam',
		'https://codeforces.com/profile/msiamn',
	])
		expect(body).toContain(`](${url})`);
});

test('flag off: /llms.txt is a 404', async ({ request }) => {
	test.skip(on, 'flag-off assertions');
	expect((await request.get('/llms.txt')).status()).toBe(404);
});
