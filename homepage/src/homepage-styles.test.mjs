import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const theme = readFileSync(new URL('./theme.css', import.meta.url), 'utf8');

test('keeps the Paper & Ink token contract and the dark proof surface', () => {
  assert.ok(theme.includes('color-scheme: light'));
  assert.ok(theme.includes('--background: #f7f7f4'));
  assert.ok(theme.includes('--accent: #cc785c'));
  assert.ok(theme.includes('--paper: #f7f7f4'));
  assert.ok(theme.includes('--surface-dark: #171614'));
  assert.ok(theme.includes('--line: #e3e2dd'));
  assert.ok(theme.includes("--font-sans: StyreneB, Inter, 'Helvetica Neue', Arial, sans-serif"));
  assert.ok(theme.includes("--font-mono: 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"));
});

test('v3 restraint: no serif display, no gradients, no glass, no transform hover', () => {
  const all = `${theme}\n${css}`;
  const rules = all.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(rules, /(?<!sans-)serif/);
  assert.doesNotMatch(rules, /gradient/);
  assert.doesNotMatch(rules, /backdrop-filter/);
  assert.doesNotMatch(rules, /translateY\(-2px\)/);
});

test('defines the key layout hooks used by the homepage', () => {
  for (const hook of [
    '.nav',
    '.nav-links',
    '.nav-actions',
    '.hero-grid',
    '.hero-facts',
    '.product-card',
    '.trio-card',
    '.file-row',
    '.terminal',
    '.route-card',
    '.boundary-grid',
    '.authority-card',
    '.boundary-list',
    '.skill-grid',
    '.layer-stack',
    '.lane-list',
    '.hook-grid',
    '.hook-step',
    '.hook-receipt',
    '.split',
    '.matrix-cell',
    '.evidence-band',
    '.install-card',
    '.code-block',
    '.skill-block',
    '.doc-links',
    '.cta',
    '.cta-actions',
    '.footer-links'
  ]) {
    assert.ok(css.includes(hook), `Missing layout hook: ${hook}`);
  }
});

test('keeps matrix cells readable: paper surface, muted text, never muted on muted', () => {
  const cellRule = css.match(/\.matrix-cell \{[\s\S]*?\}/);
  const strongRule = css.match(/\.matrix-cell strong \{[\s\S]*?\}/);

  assert.ok(cellRule, 'Missing .matrix-cell rule');
  assert.ok(strongRule, 'Missing .matrix-cell strong rule');
  assert.match(cellRule[0], /background: var\(--background\)/);
  assert.match(cellRule[0], /color: var\(--muted-foreground\)/);
  assert.doesNotMatch(cellRule[0], /background: var\(--muted\)/);
  assert.match(strongRule[0], /color: var\(--ink\)/);
});

test('keeps one inline-token chip contract and no selectors for removed classes', () => {
  const chipRule = css.match(/p code,\s*li code,\s*\.matrix-cell code \{[\s\S]*?\}/);
  assert.ok(chipRule, 'Inline code chip must cover prose, list items and matrix cells');
  assert.match(chipRule[0], /background: var\(--surface\)/);
  assert.match(chipRule[0], /color: var\(--ink\)/);

  const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.doesNotMatch(rules, /\.pain[\s,{:]/, 'Removed v2 class still has a rule');
});

test('includes sticky navigation and responsive single-column collapse', () => {
  assert.ok(css.includes('position: sticky'));
  assert.ok(css.includes('overflow-x: hidden;'));
  assert.ok(css.includes('@media (max-width: 920px)'));
  assert.ok(css.includes('@media (max-width: 620px)'));
  assert.ok(css.includes('grid-template-columns: 1fr'));
  assert.ok(css.includes('overflow-wrap: anywhere;'));
  assert.ok(css.includes('width: min(1180px, calc(100% - 28px));'));
  assert.ok(css.includes('font-size: clamp(34px, 12vw, 48px);'));
  assert.ok(css.includes('padding-inline: 14px;'));
  assert.ok(css.includes('.hero-actions .button,'));
  assert.ok(css.includes('.cta-actions .button {'));
  const narrowNavButton = css.match(/\.nav > \.nav-actions \.button \{[\s\S]*?\}/);
  assert.ok(narrowNavButton, 'Missing narrow topbar button rule');
  assert.doesNotMatch(narrowNavButton[0], /width: 100%/);
});
