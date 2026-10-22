import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildGraph, serialize } from './jsonld.ts';

const profile = {
  name: 'Masnun Siam',
  tagline: 'Engineer',
  location: 'Dhaka, Bangladesh',
  socials: [{ url: 'https://github.com/x' }, { url: 'https://example.com/y' }],
};
const page = { url: 'https://masnunsiam.com/', title: 'Masnun Siam' };
const roles = [
  { company: 'Old', title: 'Dev', start: '2018-01', end: '2019-01' },
  { company: 'A', title: 'Lead', start: '2020-01' },
];
const skills = [{ items: ['PHP', 'Laravel'] }, { items: ['Laravel', 'Flutter'] }];

const person = (g: ReturnType<typeof buildGraph>) => g['@graph'][2] as Record<string, unknown>;

test('graph has the three nodes with exact ids', () => {
  const g = buildGraph(profile, roles, skills, page);
  assert.deepEqual(
    g['@graph'].map((n) => [n['@type'], n['@id']]),
    [
      ['WebSite', 'https://masnunsiam.com/#website'],
      ['ProfilePage', 'https://masnunsiam.com/#profilepage'],
      ['Person', 'https://masnunsiam.com/#person'],
    ],
  );
  const p = person(g);
  assert.equal(p.jobTitle, 'Lead');
  assert.deepEqual(p.worksFor, { '@type': 'Organization', name: 'A' });
  assert.deepEqual(p.address, { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'Bangladesh' });
  assert.deepEqual(p.sameAs, ['https://github.com/x', 'https://example.com/y']);
  assert.equal('email' in p, false);
  assert.equal('image' in p, false);
});

test('skills are de-duplicated in content order; none omits knowsAbout', () => {
  assert.deepEqual(person(buildGraph(profile, roles, skills, page)).knowsAbout, ['PHP', 'Laravel', 'Flutter']);
  assert.equal('knowsAbout' in person(buildGraph(profile, roles, [], page)), false);
});

test('no current role omits jobTitle and worksFor; several pick the newest start', () => {
  const p = person(buildGraph(profile, [roles[0]], skills, page));
  assert.equal('jobTitle' in p, false);
  assert.equal('worksFor' in p, false);
  const several = [{ company: 'B', title: 'Old', start: '2019-01' }, ...roles];
  assert.equal(person(buildGraph(profile, several, skills, page)).jobTitle, 'Lead');
});

test('location without a comma omits address; the last comma splits', () => {
  assert.equal('address' in person(buildGraph({ ...profile, location: 'Dhaka' }, roles, skills, page)), false);
  const p = person(buildGraph({ ...profile, location: 'A, B, C' }, roles, skills, page));
  assert.deepEqual(p.address, { '@type': 'PostalAddress', addressLocality: 'A, B', addressCountry: 'C' });
});

test('serialize escapes <, > and & and stays valid JSON', () => {
  const g = buildGraph({ ...profile, tagline: '</script><b>&' }, roles, skills, page);
  const out = serialize(g);
  assert.equal(out.includes('<'), false);
  assert.equal(out.includes('>'), false);
  assert.equal(out.includes('&'), false);
  assert.ok(out.includes('\\u003c/script\\u003e\\u003cb\\u003e\\u0026'));
  assert.equal(person(JSON.parse(out)).description, '</script><b>&');
});
