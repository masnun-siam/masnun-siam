// Fails the build when the CSP in dist/_headers and the built pages disagree.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { needsCspHash } from '../src/lib/inline-script.ts';

const csp = readFileSync('dist/_headers', 'utf8')
	.split('\n')
	.find((line) => line.trim().startsWith('Content-Security-Policy:'));
if (!csp) {
	console.error('check-headers: no Content-Security-Policy in dist/_headers');
	process.exit(1);
}
const scriptSrc = csp.split(';').find((d) => d.trim().startsWith('script-src')) ?? '';

const errors = [];
for (const file of ['dist/index.html', 'dist/404.html']) {
	const html = readFileSync(file, 'utf8');
	// Inline scripts are those without a src attribute, minus the JSON-LD data block.
	for (const [, attrs, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
		if (!needsCspHash(attrs)) continue;
		const source = `'sha256-${createHash('sha256').update(body).digest('base64')}'`;
		if (!scriptSrc.includes(source)) errors.push(`${file}: inline script hash ${source} is not in the CSP`);
	}
	// style-src 'self' makes the browser drop both.
	if (/<style[\s>]/.test(html)) errors.push(`${file}: contains a <style> tag`);
	if (/\sstyle="/.test(html)) errors.push(`${file}: contains a style= attribute`);
}
if (errors.length) {
	console.error(`check-headers failed:\n${errors.join('\n')}`);
	process.exit(1);
}
