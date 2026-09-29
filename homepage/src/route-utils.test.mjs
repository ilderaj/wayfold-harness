import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHomepageRequestUrl } from './route-utils.mjs';

test('redirects the bare homepage prefix to the slash form', () => {
  const result = normalizeHomepageRequestUrl('https://vibing.paymond.me/wayfold-harness');

  assert.equal(result.action, 'redirect');
  assert.equal(result.status, 308);
  assert.equal(result.url, 'https://vibing.paymond.me/wayfold-harness/');
});

test('rewrites the homepage shell path to the asset root', () => {
  const result = normalizeHomepageRequestUrl('https://vibing.paymond.me/wayfold-harness/');

  assert.equal(result.action, 'asset');
  assert.equal(result.url, 'https://vibing.paymond.me/');
});

test('strips the homepage prefix from built asset requests', () => {
  const result = normalizeHomepageRequestUrl(
    'https://vibing.paymond.me/wayfold-harness/assets/index.js'
  );

  assert.equal(result.action, 'asset');
  assert.equal(result.url, 'https://vibing.paymond.me/assets/index.js');
});

test('preserves query strings when rewriting asset requests', () => {
  const result = normalizeHomepageRequestUrl(
    'https://vibing.paymond.me/wayfold-harness/?utm_source=github'
  );

  assert.equal(result.action, 'asset');
  assert.equal(result.url, 'https://vibing.paymond.me/?utm_source=github');
});

test('rejects paths outside the homepage prefix', () => {
  const result = normalizeHomepageRequestUrl('https://vibing.paymond.me/other');

  assert.equal(result.action, 'not_found');
  assert.equal(result.url, 'https://vibing.paymond.me/other');
});


test('redirects legacy entry and asset paths without losing queries', () => {
  const old = normalizeHomepageRequestUrl('https://example.com/superpowering-with-files');
  assert.equal(old.action, 'redirect');
  assert.equal(old.status, 308);
  assert.equal(old.url, 'https://example.com/wayfold-harness/');
  const asset = normalizeHomepageRequestUrl('https://example.com/superpowering-with-files/assets/app.js?v=2');
  assert.equal(asset.url, 'https://example.com/wayfold-harness/assets/app.js?v=2');
});
