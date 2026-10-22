import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parse } from 'yaml';

// Snapshot text becomes site copy, llms.txt and JSON-LD: text fields must be plain text (PRD FR-9).
const TEXT_FIELDS = ['tagline', 'about', 'highlights', 'description', 'tags'];
const BAD = /<|\]\(|http/i;

// Returns "<id>.<field>: <text>" for every text value that is not plain text.
export const badText = (entries: Record<string, unknown>[]): string[] =>
  entries.flatMap((e) =>
    TEXT_FIELDS.flatMap((f) =>
      [e[f]].flat().filter((v): v is string => typeof v === 'string' && BAD.test(v)).map((v) => `${e.id}.${f}: ${v}`),
    ),
  );

const load = (file: string) => parse(readFileSync(`src/content/refresh/${file}.yaml`, 'utf8')) as Record<string, unknown>[];

test('refreshed content text fields are plain text', () => {
  for (const file of ['profile', 'work', 'projects', 'skills']) assert.deepEqual(badText(load(file)), [], file);
});

test('the check catches markup, link syntax and URLs', () => {
  const bad = [{ id: 'x', about: ['fine', 'a <b>b</b>', '[a](b)', 'see https://evil.example'], tags: ['ok'] }];
  assert.equal(badText(bad).length, 3);
});
