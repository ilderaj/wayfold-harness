import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../', import.meta.url));
for (const entry of ['scripts/harness', 'scripts/adopt-global-skills.mjs']) {
  test(`${entry} cannot activate or install a non-plugin harness`, () => {
    const cwd = mkdtempSync(path.join(tmpdir(), 'wfh-retired-'));
    try {
      const result = spawnSync(entry.endsWith('.mjs') ? process.execPath : 'sh',
        [path.join(root, entry), '--help'], { cwd, encoding: 'utf8' });
      assert.equal(result.status, 64);
      assert.match(result.stderr, /retired/i);
      assert.match(result.stderr, /WayFold Harness/);
      assert.deepEqual(readdirSync(cwd), []);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
}
