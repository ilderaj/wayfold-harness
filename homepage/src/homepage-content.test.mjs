import test from 'node:test';
import assert from 'node:assert/strict';
import { homepageContent, homepageSectionOrder } from './homepage-content.mjs';

test('defines the approved six-section homepage flow with matching content keys', () => {
  const sectionKeys = ['hero', 'problem', 'skills', 'hooks', 'proof', 'start'];

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
  assert.deepEqual(homepageContent.topbar.links.map(({ label }) => label), [
    'Why',
    'Skills',
    'Hooks',
    'Inspect',
    'Start'
  ]);
  assert.deepEqual(homepageContent.topbar.links.map(({ href }) => href), [
    '#problem',
    '#skills',
    '#hooks',
    '#proof',
    '#start'
  ]);
  assert.equal(homepageContent.topbar.cta.label, 'View source');
  assert.equal(homepageContent.topbar.cta.href, githubUrl);
  assert.equal(homepageContent.topbar.docs.label, 'Read workflow');
  assert.equal(homepageContent.topbar.docs.href, workflowUrl);

  assert.equal(homepageContent.hero.eyebrow, 'Native Codex plugin · v3 candidate');
  assert.equal(homepageContent.hero.headline, 'Three files hold the plan. Codex runs the work.');
  assert.match(homepageContent.hero.lede, /three planning files/i);
  assert.match(homepageContent.hero.lede, /native to Codex/i);
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
    'Owns tools, execution, lifecycle, permissions, continuation and model selection',
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

  assert.equal(homepageContent.footer.links[0].label, 'View source');
  assert.deepEqual(homepageContent.skills.routes.map(({ name }) => name), ['quick', 'tracked', 'deep']);
  assert.deepEqual(homepageContent.start.commands, ['npm run verify:wfh', 'npm run wfh:build']);
});

test('names only the three reviewed skills that the plugin builder ships', () => {
  const reviewed = ['wayfold', 'planning-with-files', 'linear-work-control'];

  assert.deepEqual(homepageContent.skills.entries.map(({ name }) => name), reviewed);
  assert.deepEqual(
    homepageContent.start.skills,
    reviewed.map((skill) => `$wayfold-harness:${skill}`)
  );
  assert.deepEqual(homepageContent.hero.terminal.lines.slice(-3).map(({ text }) => text),
    reviewed.map((skill) => `$wayfold-harness:${skill}`));
});

test('keeps every published command and path grounded in the repository', () => {
  const publicStory = JSON.stringify(homepageContent);

  for (const groundedFact of [
    'npm run verify:wfh',
    'npm run wfh:build',
    'planning/active/<task-id>/',
    '.wfh/planning-with-files/hook-turns/',
    'bind-thread <project-root> <task-id> <thread-id>',
    'SessionStart',
    'UserPromptSubmit',
    'Stop',
    '/hooks',
    '3.0.0-beta.2'
  ]) {
    assert.match(publicStory, new RegExp(groundedFact.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
  }

  for (const documentationLink of ['docs/workflows.md', 'docs/architecture.md', 'docs/migration.md']) {
    assert.match(publicStory, new RegExp(documentationLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});
