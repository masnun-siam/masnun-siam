import { readFileSync } from 'node:fs';

const read = (file: string) => readFileSync(`src/content/${file}.yaml`, 'utf8');
const count = (file: string, re: RegExp) => read(file).match(re)?.length ?? 0;
const distinct = (file: string, re: RegExp) => new Set(read(file).match(re)).size;

// Counts come from the content files; edit the typed strings below and the yaml together.
export const expected = {
	tagline: 'Assistant Software Engineer · Laravel · AI workflows · SaaS',
	roles: count('work', /^- id:/gm),
	groups: distinct('work', /^ {2}company:.*$/gm),
	cards: count('projects', /^- id:/gm),
	skillGroups: count('skills', /^- id:/gm),
	roleTitles: ['Assistant Software Engineer', 'Junior Software Engineer', 'Senior Software Engineer (Mobile)', 'Software Engineer (Mobile)', 'Junior Flutter Developer'],
	currentRange: 'Sep 2026 – Present',
	firstRoleLine: 'Assistant Software Engineer, BluBird Interactive Ltd. (Sep 2026 – Present)',
	secondRoleLine: 'Junior Software Engineer, BluBird Interactive Ltd. (Oct 2024 – Aug 2026)',
	repos: ['ai-workflow', 'cc-profiles', 'typevocal', 'dpdc_balance_checker', 'clippy', 'bd-govt-job-autofill'],
};
