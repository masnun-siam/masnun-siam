import assert from 'node:assert/strict';
import { test } from 'node:test';
import { needsCspHash } from './inline-script.ts';

test('only an exact JSON-LD type skips the hash check', () => {
  assert.equal(needsCspHash(' type="application/ld+json"'), false);
  for (const attrs of [
    '',
    ' type="module"',
    ' type="text/javascript"',
    ' type="application/ld+json" ',
    " type='application/ld+json'",
  ]) {
    assert.equal(needsCspHash(attrs), true, attrs);
  }
});

test('scripts with a src are never inline', () => {
  assert.equal(needsCspHash(' src="/a.js"'), false);
});
