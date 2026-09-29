import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp, mkdir, readFile, rm, symlink} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {build} from '../../packages/wfh-plugin-kit/build.mjs';

test('candidate builds reproducibly and refuses overwriting a package', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'wfh-build-'));
  try {
    await mkdir(path.join(temp, 'a')); await mkdir(path.join(temp, 'b'));
    const a = await build({output:path.join(temp, 'a/wayfold-harness')});
    const b = await build({output:path.join(temp, 'b/wayfold-harness')});
    assert.deepEqual(a.receipt,b.receipt);
    const manifest = JSON.parse(await readFile(path.join(a.output, '.codex-plugin/plugin.json')));
    assert.equal(manifest.name,'wayfold-harness');
    for (const field of ['hooks','mcpServers','apps']) assert.equal(manifest[field],undefined);
    assert.equal(a.receipt.files.filter(x=>x.path.endsWith('/SKILL.md')).length,3);
    const hooks = JSON.parse(await readFile(path.join(a.output, 'hooks/hooks.json')));
    assert.deepEqual(Object.keys(hooks.hooks), ['SessionStart','UserPromptSubmit','Stop']);
    assert.ok(a.receipt.files.some(x=>x.path === 'hooks/tracked_task.py'));
    assert.ok(!a.receipt.files.some(x=> /kami|pen-design|night-queue|\.pyc|__pycache__/.test(x.path)));
    await assert.rejects(build({output:a.output}), /EEXIST/);
  } finally {await rm(temp,{recursive:true,force:true});}
});

test('builder rejects a linked source skill', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(),'wfh-link-'));
  try {
    await mkdir(path.join(temp,'source/skills'),{recursive:true});
    for (const name of ['wayfold','planning-with-files','linear-work-control']) await symlink(process.cwd(),path.join(temp,'source/skills',name));
    await assert.rejects(build({source:path.join(temp,'source'),output:path.join(temp,'out/wayfold-harness')}),/symlink/);
  } finally {await rm(temp,{recursive:true,force:true});}
});
