// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://masnunsiam.com',
	// Keep the toggle handler an external file so a script-src 'self' CSP allows it.
	// CSS ships as /_astro/*.css so style-src 'self' is enough.
	build: { inlineStylesheets: 'never' },
	vite: { build: { assetsInlineLimit: 0 } },
});
