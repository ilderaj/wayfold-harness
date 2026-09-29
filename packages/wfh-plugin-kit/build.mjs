import { mkdir, readdir, readFile, writeFile, lstat } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const expected = ['linear-work-control', 'planning-with-files', 'wayfold'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

export async function build({ source = path.join(repo, 'wfh'), output = path.join(repo, 'dist/wayfold-harness'), version = '3.0.0-beta.1' } = {}) {
  source = path.resolve(source); output = path.resolve(output);
  if (output === source || output.startsWith(source + path.sep)) throw Error('output cannot be inside source');
  if (path.basename(output) !== 'wayfold-harness') throw Error('output folder must match plugin name');
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(version)) throw Error('invalid version');
  const skills = (await readdir(path.join(source, 'skills'))).sort();
  if (JSON.stringify(skills) !== JSON.stringify(expected)) throw Error('exactly the three reviewed skills are required');
  const entries = [];
  async function visit(directory, prefix) {
    for (const name of (await readdir(directory)).sort()) {
      const abs = path.join(directory, name), rel = prefix ? `${prefix}/${name}` : name;
      const stat = await lstat(abs);
      if (stat.isSymbolicLink()) throw Error(`symlink refused: ${rel}`);
      if (name === '__pycache__' || name === '.DS_Store' || name.endsWith('.pyc')) continue;
      if (stat.isDirectory()) await visit(abs, rel);
      else if (stat.isFile()) entries.push([rel, await readFile(abs)]);
      else throw Error(`unsupported file: ${rel}`);
    }
  }
  await visit(path.join(source, 'skills'), 'skills');
  for (const skill of expected) if (!entries.some(([name]) => name === `skills/${skill}/SKILL.md`)) throw Error('missing skill entry');
  entries.push(['NOTICE.md', await readFile(path.join(source, 'NOTICE.md'))]);
  const manifest = {
    name: 'wayfold-harness', version,
    description: 'Thin task continuity and evidence checks for Codex.',
    author: {name: 'WayFold Harness'}, license: 'UNLICENSED', skills: './skills/',
    interface: {displayName: 'WayFold Harness', shortDescription: 'Thin task continuity and evidence checks',
      longDescription: 'Three on-demand skills. No global policies, ambient hooks, scheduler, or external-skill repackaging.',
      developerName: 'WayFold Harness', category: 'Productivity', capabilities: ['Read', 'Write'],
      defaultPrompt: ['Resume this tracked task with its existing plan and evidence.']}
  };
  entries.push(['.codex-plugin/plugin.json', Buffer.from(JSON.stringify(manifest, null, 2) + '\n')]);
  entries.sort(([a], [b]) => a.localeCompare(b, 'en'));
  const receipt = {schemaVersion: 1, plugin: manifest.name, version,
    files: entries.map(([name, bytes]) => ({path: name, bytes: bytes.length, sha256: hash(bytes)}))};
  // Refuse overwrite rather than replacing unrelated or installed files.
  await mkdir(output, {recursive: false});
  for (const [name, bytes] of entries) {
    const target = path.join(output, name);
    await mkdir(path.dirname(target), {recursive: true});
    await writeFile(target, bytes, {flag: 'wx'});
  }
  await writeFile(path.join(output, 'build-receipt.json'), JSON.stringify(receipt, null, 2) + '\n', {flag: 'wx'});
  return {output, files: entries.length, bytes: entries.reduce((n, [, b]) => n + b.length, 0), receipt};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  if (args.length && (args.length !== 2 || args[0] !== '--output')) throw Error('usage: build.mjs [--output <new-parent/wayfold-harness>]');
  const output = args[1] ? path.resolve(args[1]) : path.join(repo, 'dist/wayfold-harness');
  await mkdir(path.dirname(output), {recursive: true});
  const {receipt, ...summary} = await build({output});
  console.log(JSON.stringify(summary));
}
