import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildLlmsTxt } from './llms.ts';

const profile = {
  name: 'Masnun Siam',
  tagline: 'Engineer',
  location: 'Dhaka, Bangladesh',
  about: ['One.', 'Two.'],
  email: 'a@b.co',
  socials: [{ label: 'GitHub', url: 'https://github.com/x' }],
};
const roles = [
  { title: 'Dev', company: 'Old', start: '2018-01', end: '2019-03', location: 'Dhaka', mode: 'On-site' },
  { title: 'Lead', company: 'A', start: '2020-01', location: 'Dhaka', mode: 'Remote' },
];
const projects = [
  { order: 2, name: 'b', repo: 'https://github.com/x/b', description: 'Second' },
  { order: 1, name: 'a', repo: 'https://github.com/x/a', description: 'First' },
];
const skills = [
  { order: 2, title: 'Tools', items: ['Git'] },
  { order: 1, title: 'Backend', items: ['PHP', 'Laravel'] },
];

test('sections come in order with the exact line formats', () => {
  assert.equal(
    buildLlmsTxt(profile, roles, projects, skills),
    [
      '# Masnun Siam',
      '> Engineer — Dhaka, Bangladesh',
      'One.',
      'Two.',
      '## Work',
      '- Lead, A (Jan 2020 – Present), Dhaka · Remote\n- Dev, Old (Jan 2018 – Mar 2019), Dhaka · On-site',
      '## Projects',
      '- [a](https://github.com/x/a): First\n- [b](https://github.com/x/b): Second',
      '## Skills',
      '- Backend: PHP, Laravel\n- Tools: Git',
      '## Contact',
      '- Email: a@b.co\n- [GitHub](https://github.com/x)',
    ].join('\n\n') + '\n',
  );
});

test('an empty list drops its section entirely', () => {
  const out = buildLlmsTxt(profile, [], [], []);
  for (const h of ['## Work', '## Projects', '## Skills']) assert.equal(out.includes(h), false, h);
  assert.ok(out.includes('## Contact'));
});
