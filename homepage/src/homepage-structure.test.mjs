import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { homepageSectionOrder } from './homepage-content.mjs';

const source = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8');
const normalizedSource = source.replace(/\s+/g, ' ');

test('derives rendered section order from homepageSectionOrder', () => {
  assert.match(
    normalizedSource,
    /homepageSectionOrder\.map\(\(sectionKey\) => sectionContent\[sectionKey as keyof typeof sectionContent\]\)/
  );
});

test('defines renderers for every approved homepage section in contract order', () => {
  const rendererPositions = homepageSectionOrder.map((sectionKey) => {
    const match = source.match(new RegExp(`${sectionKey}:\\s*\\(`));
    assert.ok(match, `missing renderer for section: ${sectionKey}`);
    return source.indexOf(match[0]);
  });

  const sortedPositions = [...rendererPositions].sort((a, b) => a - b);
  assert.deepEqual(rendererPositions, sortedPositions);
});

test('renders the v3 proof surface: Trio files, terminal, routes, boundaries, hooks, evidence', () => {
  assert.ok(source.includes("from './homepage-content.mjs'"));
  assert.ok(source.includes('homepageContent.topbar.cta'));
  assert.ok(source.includes('homepageContent.topbar.docs'));
  assert.ok(source.includes('homepageContent.hero.facts.map'));
  assert.ok(source.includes('homepageContent.hero.trio.files.map'));
  assert.ok(source.includes('homepageContent.hero.terminal.lines.map'));
  assert.ok(source.includes('homepageContent.hero.route.steps.map'));
  assert.ok(source.includes('homepageContent.problem.authority.files.map'));
  assert.ok(source.includes('homepageContent.problem.boundaries.map'));
  assert.ok(source.includes('homepageContent.skills.entries.map'));
  assert.ok(source.includes('homepageContent.skills.layers.map'));
  assert.ok(source.includes('homepageContent.skills.routes.map'));
  assert.ok(source.includes('homepageContent.hooks.steps.map'));
  assert.ok(source.includes('homepageContent.hooks.receipts'));
  assert.ok(source.includes('homepageContent.hooks.command'));
  assert.ok(source.includes('homepageContent.proof.tracks.map'));
  assert.ok(source.includes('homepageContent.proof.evidence'));
  assert.ok(source.includes('homepageContent.start.commands.map'));
  assert.ok(source.includes('homepageContent.start.skills.map'));
  assert.ok(source.includes('homepageContent.start.docs.map'));
  assert.ok(source.includes('homepageContent.start.cta.action'));
  assert.ok(source.includes('homepageContent.start.cta.secondaryAction'));
  assert.ok(source.includes('homepageContent.footer.links.map'));
  assert.doesNotMatch(normalizedSource, /aria-label="Project highlights"/);
});

test('keeps external links inert-safe and never renders a duplicated shell prefix', () => {
  assert.match(normalizedSource, /rel=\{external \? 'noreferrer' : undefined\}/);
  assert.match(source, /target=\{external \? '_blank' : undefined\}/);
  assert.doesNotMatch(source, /\$ \$/);
});
