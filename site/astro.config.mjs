// @ts-check
import { appendFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { SITEMAP_URL, buildSitemap } from './src/lib/sitemap.ts';

// Flag on: publish sitemap.xml (pages minus 404) and point robots.txt at it. Flag off: nothing changes.
// ponytail: flag.ts is TS and this config compares inline; keep it the same strict `=== 'true'`.
/** @type {import('astro').AstroIntegration} */
const seoSitemap = {
	name: 'seo-sitemap',
	hooks: {
		'astro:build:done': ({ dir, pages }) => {
			if (process.env.FEATURE_SEO_AEO !== 'true') return;
			const paths = pages.map((p) => `/${p.pathname}`).filter((p) => p !== '/404/');
			writeFileSync(new URL('sitemap.xml', dir), buildSitemap(paths));
			appendFileSync(fileURLToPath(new URL('robots.txt', dir)), `Sitemap: ${SITEMAP_URL}\n`);
		},
	},
};

// https://astro.build/config
export default defineConfig({
	site: 'https://masnunsiam.com',
	integrations: [seoSitemap],
	// Keep the toggle handler an external file so a script-src 'self' CSP allows it.
	// CSS ships as /_astro/*.css so style-src 'self' is enough.
	build: { inlineStylesheets: 'never' },
	vite: { build: { assetsInlineLimit: 0 } },
});
