const ORIGIN = 'https://masnunsiam.com';

const escapeXml = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string);

// sitemaps.org 0.9: one <loc> per page by absolute URL, no lastmod/changefreq/priority.
export const buildSitemap = (pathnames: readonly string[]): string =>
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pathnames.map((p) => `  <url><loc>${escapeXml(ORIGIN + p)}</loc></url>\n`).join('') +
  '</urlset>\n';

export const SITEMAP_URL = `${ORIGIN}/sitemap.xml`;
