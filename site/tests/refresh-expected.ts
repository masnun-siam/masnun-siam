import { readFileSync } from 'node:fs';

// FEATURE_CONTENT_REFRESH is read at build time; the specs must run against a build made in the same state.
export const refresh = process.env.FEATURE_CONTENT_REFRESH === 'true';

const read = (file: string) => readFileSync(`src/content/refresh/${file}.yaml`, 'utf8');
const count = (file: string, re: RegExp) => read(file).match(re)?.length ?? 0;
const distinct = (file: string, re: RegExp) => new Set(read(file).match(re)).size;

const repos = ['ai-workflow', 'cc-profiles', 'typevocal', 'dpdc_balance_checker', 'clippy', 'bd-govt-job-autofill'];

const off = {
	tagline: 'Software Engineer · Laravel · Flutter · AI tools',
	roles: 4,
	groups: 3,
	cards: 6,
	skillGroups: 3,
	roleTitles: ['Software Engineer', 'Senior Software Engineer (Mobile)', 'Software Engineer (Mobile)', 'Junior Flutter Developer'],
	firstRoleLine: 'Software Engineer, BluBird Interactive Ltd. (Oct 2024 – Present)',
	secondRoleLine: 'Senior Software Engineer (Mobile), Binary Fusion (Mar 2024 – Oct 2024)',
	repos,
};

// On state: counts come from the refreshed files; the content issues edit the typed strings below and the yaml together.
const on = {
	tagline: 'Software Engineer · Laravel · Flutter · AI tools',
	roles: count('work', /^- id:/gm),
	groups: distinct('work', /^ {2}company:.*$/gm),
	cards: count('projects', /^- id:/gm),
	skillGroups: count('skills', /^- id:/gm),
	roleTitles: ['Software Engineer', 'Senior Software Engineer (Mobile)', 'Software Engineer (Mobile)', 'Junior Flutter Developer'],
	firstRoleLine: 'Software Engineer, BluBird Interactive Ltd. (Oct 2024 – Present)',
	secondRoleLine: 'Senior Software Engineer (Mobile), Binary Fusion (Mar 2024 – Oct 2024)',
	repos,
};

export const expected = refresh ? on : off;
