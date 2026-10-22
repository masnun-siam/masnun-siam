import assert from 'node:assert/strict';
import { test } from 'node:test';
import { currentRole, monthLabel, sortRoles } from './work.ts';

test('monthLabel', () => {
  assert.equal(monthLabel('2024-03'), 'Mar 2024');
  assert.equal(monthLabel('2019-12'), 'Dec 2019');
});

test('sortRoles: ongoing first, then newest end, ties by newest start', () => {
  const roles = [
    { id: 'old', start: '2018-01', end: '2019-01' },
    { id: 'tie-early', start: '2019-02', end: '2021-06' },
    { id: 'now-early', start: '2022-01' },
    { id: 'tie-late', start: '2020-05', end: '2021-06' },
    { id: 'now-late', start: '2023-04' },
  ];
  assert.deepEqual(
    sortRoles(roles).map((r) => r.id),
    ['now-late', 'now-early', 'tie-late', 'tie-early', 'old'],
  );
  assert.equal(roles[0].id, 'old', 'input is not mutated');
});

test('currentRole', () => {
  assert.equal(currentRole([{ start: '2020-01', end: '2021-01' }]), undefined);
  assert.equal(currentRole([]), undefined);
  const one = { id: 'a', start: '2020-01' };
  assert.equal(currentRole([{ id: 'x', start: '2019-01', end: '2020-01' }, one]), one);
  const newer = { id: 'b', start: '2022-01' };
  assert.equal(currentRole([one, newer]), newer);
});
