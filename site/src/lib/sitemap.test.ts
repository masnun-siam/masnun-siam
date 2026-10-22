import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSitemap } from './sitemap.ts';

test('one absolute <loc> per page, no optional tags', () => {
  const xml = buildSitemap(['/']);
  assert.equal(xml.match(/<loc>/g)?.length, 1);
  assert.ok(xml.includes('<loc>https://masnunsiam.com/</loc>'));
  for (const tag of ['lastmod', 'changefreq', 'priority']) assert.equal(xml.includes(tag), false);
});

test('escapes &, < and > in URLs', () => {
  assert.ok(buildSitemap(['/a?x=1&y=<2>']).includes('/a?x=1&amp;y=&lt;2&gt;</loc>'));
});
