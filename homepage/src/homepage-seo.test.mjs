import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const compactHtml = html.replace(/\s+/g, ' ');

const expectedUrl = 'https://vibing.paymond.me/wayfold-harness/';
const expectedImage = 'https://vibing.paymond.me/wayfold-harness/wfh-social.png';
const expectedTitle = 'WayFold Harness | Durable planning for Codex';
const expectedDescription =
  'A thin Codex plugin for durable planning, relevant quality checks, and independently supplied professional skills.';
const expectedKeywords = [
  'Codex',
  'WayFold Harness',
  'thin plugin',
  'planning with files',
  'durable planning',
  'task_plan.md',
  'findings.md',
  'progress.md',
  'native hooks',
  'independent skills',
  'no second runner'
];

test('defines search-ready title, description, canonical, robots, and theme color', () => {
  assert.match(compactHtml, new RegExp(`<title>${expectedTitle}<\\/title>`));
  assert.match(compactHtml, new RegExp(`<meta name="description" content="${expectedDescription}" \\/>`));
  assert.match(compactHtml, new RegExp(`<link rel="canonical" href="${expectedUrl}" \\/>`));
  assert.match(compactHtml, /<meta name="robots" content="index, follow, max-image-preview:large" \/>/);
  assert.match(compactHtml, /<meta name="theme-color" content="#f7f7f4" \/>/);
});

test('defines Open Graph and Twitter metadata for repository sharing', () => {
  for (const tag of [
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="WayFold Harness" />',
    `<meta property="og:url" content="${expectedUrl}" />`,
    `<meta property="og:title" content="${expectedTitle}" />`,
    `<meta property="og:description" content="${expectedDescription}" />`,
    `<meta property="og:image" content="${expectedImage}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${expectedTitle}" />`,
    `<meta name="twitter:description" content="${expectedDescription}" />`,
    `<meta name="twitter:image" content="${expectedImage}" />`
  ]) {
    assert.ok(compactHtml.includes(tag), `Missing SEO tag: ${tag}`);
  }
});

test('links the single WayFold favicon asset from the homepage shell', () => {
  assert.match(compactHtml, /<link rel="icon" type="image\/svg\+xml" href="\/favicon\.svg" \/>/);
});

test('ships exactly the published brand assets under public/', () => {
  const publicDir = new URL('../public/', import.meta.url);
  const expectedAssets = ['favicon.svg', 'wfh-social.svg', 'wfh-social.png'];

  for (const asset of expectedAssets) {
    assert.equal(existsSync(new URL(asset, publicDir)), true, `Missing public asset: ${asset}`);
  }
});

test('keeps planning, host, and runtime facts aligned across metadata and JSON-LD', () => {
  const keywords = expectedKeywords.join(', ');
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);

  assert.ok(jsonLdMatch, 'Missing JSON-LD script');
  assert.match(compactHtml, new RegExp(`<meta name="keywords" content="${keywords}" \\/>`));

  const jsonLd = JSON.parse(jsonLdMatch[1]);
  assert.equal(jsonLd.name, 'WayFold Harness');
  assert.equal(jsonLd.description, expectedDescription);
  assert.deepEqual(jsonLd.keywords, expectedKeywords);

  for (const requiredFact of ['Codex plugin', 'durable planning', 'professional skills']) {
    assert.match(jsonLd.description, new RegExp(requiredFact, 'i'));
  }

  for (const retiredClaim of ['Cursor', 'GitHub Copilot', 'Claude Code', 'governance', 'multi-host']) {
    assert.doesNotMatch(html, new RegExp(retiredClaim, 'i'));
  }
});
