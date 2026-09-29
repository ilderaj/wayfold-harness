import test from 'node:test';
import assert from 'node:assert/strict';
import { homepageContent, homepageSectionOrder } from './homepage-content.mjs';

test('defines the approved five-section homepage flow with matching content keys', () => {
  const sectionKeys = ['hero', 'problem', 'system', 'workflow', 'start'];

  assert.deepEqual(homepageSectionOrder, sectionKeys);

  for (const sectionKey of sectionKeys) {
    assert.ok(sectionKey in homepageContent, `Expected homepageContent.${sectionKey} to exist`);
  }
});

test('locks the WayFold public story and CTA hierarchy', () => {
  const githubUrl = 'https://github.com/ilderaj/wayfold-harness';
  const workflowUrl = `${githubUrl}/blob/main/docs/workflows.md`;
  const readmeUrl = `${githubUrl}/blob/main/README.md`;

  assert.equal(homepageContent.topbar.brandLabel, 'WayFold Harness');
  assert.deepEqual(homepageContent.topbar.links.map(({ label }) => label), ['Why', 'System', 'Proof', 'Start']);
  assert.deepEqual(homepageContent.topbar.links.map(({ href }) => href), ['#problem', '#system', '#workflow', '#start']);
  assert.equal(homepageContent.topbar.cta.label, 'View source');
  assert.equal(homepageContent.topbar.cta.href, githubUrl);
  assert.equal(homepageContent.topbar.github.label, 'Read workflow');
  assert.equal(homepageContent.topbar.github.href, workflowUrl);

  assert.equal(homepageContent.hero.eyebrow, 'A thin Codex plugin');
  assert.equal(homepageContent.hero.headline, 'Plan in one session. Execute with proof.');
  assert.match(homepageContent.hero.lede, /three planning files/i);
  assert.match(homepageContent.hero.lede, /Codex handles execution and permissions/i);
  assert.deepEqual(homepageContent.hero.actions.map(({ label }) => label), ['View source', 'Read workflow']);
  assert.deepEqual(homepageContent.hero.actions.map(({ href }) => href), [githubUrl, workflowUrl]);

  assert.equal(homepageContent.start.cta.action.label, 'Read the README');
  assert.equal(homepageContent.start.cta.action.href, readmeUrl);
  assert.equal(homepageContent.start.cta.secondaryAction.label, 'Open GitHub and star the repo');
  assert.equal(homepageContent.start.cta.secondaryAction.href, githubUrl);
});

test('captures every required WayFold public boundary without retired claims', () => {
  const publicStory = JSON.stringify(homepageContent);

  for (const requiredFact of [
    'task_plan.md',
    'findings.md',
    'progress.md',
    'quality references only when the task needs them',
    'Quick and tracked',
    'current-round reasoning choice',
    'Host owns lifecycle, permissions, and continuation',
    'candidates until the main session accepts them',
    'Requested model and effort are intent',
    'actual is unknown without Host evidence',
    'Native Goal and continuation',
    'no second runner'
  ]) {
    assert.match(publicStory, new RegExp(requiredFact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  for (const retiredClaim of [
    'GitHub Copilot',
    'Cursor',
    'Claude Code',
    'Superpowers',
    'companion plan',
    'reconciliation.md',
    'ChiefOps',
    'MCP',
    '--targets=all',
    'policy renders'
  ]) {
    assert.doesNotMatch(publicStory, new RegExp(retiredClaim.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  assert.equal(homepageContent.footer.github.label, 'View source');
  assert.deepEqual(homepageContent.system.lanes, ['quick', 'tracked', 'deep']);
  assert.deepEqual(homepageContent.start.commands, [
    'codex plugin list --json',
    'npm run verify:wfh',
    'npm run wfh:build',
    '$wayfold-harness:wayfold',
    '$wayfold-harness:planning-with-files',
    '$wayfold-harness:linear-work-control'
  ]);
});
