import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isContentRefreshOn, isSeoAeoOn } from './flag.ts';

test('only the exact value "true" turns the flag on', () => {
  assert.equal(isSeoAeoOn({ FEATURE_SEO_AEO: 'true' }), true);
  for (const value of [undefined, '', '1', 'TRUE', 'false']) {
    assert.equal(isSeoAeoOn({ FEATURE_SEO_AEO: value }), false);
  }
  assert.equal(isSeoAeoOn({}), false);
});

test('content refresh flag is on only for the exact value "true"', () => {
  assert.equal(isContentRefreshOn({ FEATURE_CONTENT_REFRESH: 'true' }), true);
  for (const value of [undefined, '', '1', 'TRUE', 'false']) {
    assert.equal(isContentRefreshOn({ FEATURE_CONTENT_REFRESH: value }), false);
  }
  assert.equal(isContentRefreshOn({}), false);
});
