import { defineConfig, devices } from '@playwright/test';

// Runs against the built site: `npm run build` first, `astro preview` serves dist/.
export default defineConfig({
	testDir: 'tests',
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
	use: { baseURL: 'http://127.0.0.1:4321' },
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: 'npm run preview -- --host 127.0.0.1 --port 4321 --ignore-lock',
		url: 'http://127.0.0.1:4321',
		reuseExistingServer: !process.env.CI,
	},
});
