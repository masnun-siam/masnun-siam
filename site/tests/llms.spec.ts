import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { parse } from 'yaml';
import { expected, refresh } from './refresh-expected';

const on = process.env.FEATURE_SEO_AEO === 'true';

test('flag on: /llms.txt lists the content', async ({ request }) => {
	test.skip(!on, 'flag-on assertions');
	const res = await request.get('/llms.txt');
	expect(res.status()).toBe(200);
	expect(res.headers()['content-type']).toContain('text/plain');
	const body = await res.text();
	expect(body.startsWith('# Masnun Siam')).toBe(true);
	expect(body).toContain(`> ${expected.tagline} — Dhaka, Bangladesh`);
	// Four roles, in the Work section's order (newest first).
	const roles = [expected.firstRoleLine, expected.secondRoleLine];
	for (const r of roles) expect(body).toContain(r);
	expect(body.match(/^- .+ \(\w{3} \d{4} – (\w{3} \d{4}|Present)\), /gm)).toHaveLength(expected.roles);
	expect(body.match(/^- \[[^\]]+\]\(https:\/\/github\.com\/masnun-siam\/[^)]+\): /gm)).toHaveLength(expected.cards);
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

test('flag on: /llms.txt has only allowed URLs and the builder\'s own link lines', async ({ request }) => {
	test.skip(!on || !refresh, 'refreshed-content assertions');
	const body = await (await request.get('/llms.txt')).text();
	const load = (f: string) => parse(readFileSync(`src/content/refresh/${f}.yaml`, 'utf8')) as Record<string, any>[];
	const allowed = new Set<string>([
		...load('profile')[0].socials.map((s: { url: string }) => s.url),
		...load('projects').map((p) => p.repo as string),
	]);
	const outside = (body.match(/https?:\/\/[^\s)\]]+/g) ?? []).filter(
		(u) => !allowed.has(u) && new URL(u).origin !== 'https://masnunsiam.com',
	);
	expect(outside).toEqual([]);
	const linkLines = body.split('\n').filter((l) => l.includes(']('));
	for (const l of linkLines) {
		expect(l.split('](').length - 1, l).toBe(1);
		expect(l, l).toMatch(/^- \[[^\]]+\]\(https:\/\/[^)\s]+\)(: .*)?$/);
	}
	expect(body.match(/\[[^\]]*\]\([^)]*\)/g)?.length).toBe(linkLines.length);
});
