import { expect, test } from '@playwright/test';
import { expected } from './refresh-expected';

test.beforeEach(async ({ page }) => {
	await page.goto('/');
});

test('hero shows name, tagline, location and three links', async ({ page }) => {
	const about = page.locator('#about');
	await expect(page.locator('h1')).toHaveCount(1);
	await expect(page.locator('h1')).toHaveText('Masnun Siam');
	await expect(about).toContainText(expected.tagline);
	await expect(about).toContainText('Dhaka, Bangladesh');
	await expect(about.locator('a')).toHaveCount(3);
	await expect(about.locator('a[href="mailto:echo@masnunsiam.com"]')).toHaveCount(1);
});

test('cursor blinks, and stops under reduced motion', async ({ page }) => {
	const animationName = () =>
		page.getByTestId('cursor').evaluate((el) => getComputedStyle(el).animationName);
	expect(await animationName()).not.toBe('none');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	expect(await animationName()).toBe('none');
});

test('work timeline: four roles in three company groups, newest first', async ({ page }) => {
	await expect(page.getByTestId('role')).toHaveCount(expected.roles);
	await expect(page.getByTestId('company-group')).toHaveCount(expected.groups);
	await expect(page.getByTestId('role').locator('h4')).toHaveText(expected.roleTitles);
	await expect(page.locator('#work')).toContainText(expected.currentRange);
});

test('project cards in order with repo links', async ({ page }) => {
	const { repos } = expected;
	const cards = page.getByTestId('project-card');
	await expect(cards).toHaveCount(expected.cards);
	await expect(cards.locator('h3')).toHaveText(repos);
	const hrefs = await cards.locator('a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
	expect(hrefs).toEqual(repos.map((r) => `https://github.com/masnun-siam/${r}`));
});

test('skill groups', async ({ page }) => {
	await expect(page.getByTestId('skill-group')).toHaveCount(expected.skillGroups);
	await expect(page.getByTestId('skill-group').locator('h3')).toHaveText(['Mobile', 'Backend & Web', 'Tools & DevOps']);
	await expect(page.locator('#skills img')).toHaveCount(0);
});

test('contact links have the exact targets and attributes', async ({ page }) => {
	const links = await page.locator('#contact a').evaluateAll((els) =>
		els.map((el) => [el.getAttribute('href'), el.getAttribute('target'), el.getAttribute('rel')]),
	);
	const external = ['noopener noreferrer'];
	expect(links).toEqual([
		['mailto:echo@masnunsiam.com', null, null],
		['https://github.com/masnun-siam', '_blank', external[0]],
		['https://linkedin.com/in/msiamn', '_blank', external[0]],
		['https://stackoverflow.com/users/13317943/masnun-siam', '_blank', external[0]],
		['https://codeforces.com/profile/msiamn', '_blank', external[0]],
	]);
});
