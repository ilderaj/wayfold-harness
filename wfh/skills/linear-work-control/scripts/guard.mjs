import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ids = ['workspaceId', 'projectId', 'issueId'];
const textFields = ['taskId', 'taskMarker', 'productKey'];

export function guard(input, now = Date.now()) {
  const errors = [];
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {ok: false, errors: ['object required']};
  function scan(value) {
    if (!value || typeof value !== 'object') return;
    for (const [key, child] of Object.entries(value)) {
      if (/password|secret|api.?key|access.?token|refresh.?token|authorization/i.test(key)) errors.push('credential field refused');
      scan(child);
    }
  }
  scan(input);
  if (input.authorized !== true) errors.push('explicit authorization required');
  if (input.coverageComplete !== true) errors.push('complete identity coverage required');
  const time = Date.parse(input.observedAt);
  if (!Number.isFinite(time) || time > now || now - time > 300000) errors.push('fresh observedAt required');
  for (const side of ['expected', 'observed']) {
    const value = input[side];
    if (!value || typeof value !== 'object') { errors.push(`${side} identity required`); continue; }
    for (const key of ids) if (typeof value[key] !== 'string' || !uuid.test(value[key])) errors.push(`${side}.${key} UUID required`);
    for (const key of textFields) if (typeof value[key] !== 'string' || !value[key].trim()) errors.push(`${side}.${key} required`);
    if (!['wfh', 'swf'].includes(value.productKey)) errors.push(`${side}.productKey unsupported`);
  }
  for (const key of [...ids, ...textFields]) {
    if (input.expected?.[key] !== input.observed?.[key]) errors.push(`${key} mismatch`);
  }
  return {ok: errors.length === 0, errors};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = guard(JSON.parse(await readFile(process.argv[2], 'utf8')));
    process.stdout.write(JSON.stringify(result) + '\n');
    process.exitCode = result.ok ? 0 : 1;
  } catch {
    process.stderr.write('WFH target guard: unreadable or invalid evidence input\n');
    process.exitCode = 1;
  }
}
