#!/usr/bin/env python3
"""One-time removal of exact legacy SWF activation; never shipped in the plugin.

Plan records hashes and proposed bytes. Apply backs up originals before writing.
Rollback refuses concurrent edits. No plugin installation or credentials involved.
"""
import argparse
import base64
import hashlib
import json
import os
from pathlib import Path
import stat
import tempfile

GLOBAL_BLOCK = """# SWF Codex plugin

When SWF governance is relevant, load the installed `$harness-codex-plugin:trio` skill and follow its routing. The installed plugin contains the capability and ChiefOps instructions. Follow any project policy for local task paths and scope; Host and human gates remain binding.
"""
PROJECT_BLOCK = """# SWF Codex project policy

For tracked SWF work, use the installed `$harness-codex-plugin:trio` skill and select its `dev`, `office`, or `safety` capability. Use `$harness-codex-plugin:chiefops` when the Trio route calls for delegated primary execution. The plugin contains the runtime skill text; this repository keeps the canonical public source under `harness/`.

The task's `task_plan.md`, `findings.md`, and `progress.md` remain its durable local authority. Preserve the bound task, authorization, Host gates, and existing work outside the task's scope.
"""


def digest(data):
    return hashlib.sha256(data).hexdigest()


def read_regular(path):
    info = path.lstat()
    if not stat.S_ISREG(info.st_mode) or info.st_nlink != 1:
        raise ValueError(f"Refusing non-regular or hardlinked file: {path}")
    if any(p.is_symlink() for p in path.parents):
        raise ValueError(f"Refusing symlinked ancestor: {path}")
    return path.read_bytes(), stat.S_IMODE(info.st_mode)


def atomic_write(path, data, mode):
    fd, name = tempfile.mkstemp(prefix='.wfh-migrate-', dir=path.parent)
    try:
        with os.fdopen(fd, 'wb') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.chmod(name, mode)
        os.replace(name, path)
    finally:
        if os.path.exists(name):
            os.unlink(name)


def remove_policy(data, block):
    text = data.decode('utf-8')
    if text.count(block) != 1:
        raise ValueError('Policy does not contain exactly one reviewed legacy block')
    return text.replace(block, '', 1).encode()


def remove_hooks(data):
    doc = json.loads(data)
    removed = 0
    for event, suffix in [('SessionStart', 'session-start'), ('UserPromptSubmit', 'user-prompt-submit')]:
        command = f'''sh -c '[ -f .codex/hooks/task-scoped-hook.sh ] && bash .codex/hooks/task-scoped-hook.sh codex {suffix} || bash "$HOME/.codex/hooks/task-scoped-hook.sh" codex {suffix}' '''.rstrip()
        expected = {'type': 'command', 'command': command}
        for group in list(doc.get('hooks', {}).get(event, [])):
            if group.get('description') == 'Harness-managed planning-with-files hook':
                if group != {'description': 'Harness-managed planning-with-files hook', 'hooks': [expected]}:
                    raise ValueError('Legacy hook was edited; refusing broad removal')
                doc['hooks'][event].remove(group)
                removed += 1
    if removed != 2:
        raise ValueError('Expected exactly two reviewed legacy hooks')
    return (json.dumps(doc, indent=2) + '\n').encode()


def plan(home, project, receipt):
    operations = []
    for path, transform in [
        (home / '.codex/AGENTS.md', lambda b: remove_policy(b, GLOBAL_BLOCK)),
        (project / 'AGENTS.md', lambda b: remove_policy(b, PROJECT_BLOCK)),
        (home / '.codex/hooks.json', remove_hooks),
    ]:
        before, mode = read_regular(path)
        after = transform(before)
        operations.append({'path': str(path), 'mode': mode,
                           'before_sha256': digest(before), 'after_sha256': digest(after),
                           'before': base64.b64encode(before).decode(),
                           'after': base64.b64encode(after).decode()})
    receipt.parent.mkdir(parents=True, exist_ok=True)
    with receipt.open('x') as f:
        os.chmod(receipt, 0o600)
        json.dump({'version': 1, 'operations': operations}, f, indent=2)
        f.write('\n')


def execute(receipt, rollback=False):
    data, _ = read_regular(receipt)
    doc = json.loads(data)
    if doc.get('version') != 1:
        raise ValueError('Unsupported receipt')
    source, target = ('after', 'before') if rollback else ('before', 'after')
    # Preflight the entire batch before making any changes; partial failures are resumable.
    todo = []
    seen = set()
    for op in doc['operations']:
        path = Path(op['path'])
        if not path.is_absolute() or path in seen:
            raise ValueError('Invalid or duplicate target')
        seen.add(path)
        for key in ['before', 'after']:
            if digest(base64.b64decode(op[key], validate=True)) != op[key + '_sha256']:
                raise ValueError('Corrupt receipt bytes')
        current, mode = read_regular(path)
        if mode != op['mode']:
            raise ValueError(f'File mode drift: {path}')
        if digest(current) == op[target + '_sha256']:
            continue
        if digest(current) != op[source + '_sha256']:
            raise ValueError(f'Concurrent edit: {path}')
        todo.append(op)
    for op in todo:
        path = Path(op['path'])
        current, mode = read_regular(path)
        if digest(current) != op[source + '_sha256'] or mode != op['mode']:
            raise ValueError(f'Concurrent edit before write: {path}')
        atomic_write(path, base64.b64decode(op[target]), mode)
    return len(todo)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['plan', 'apply', 'rollback'])
    parser.add_argument('--receipt', required=True, type=Path)
    parser.add_argument('--home', type=Path)
    parser.add_argument('--project', type=Path)
    args = parser.parse_args()
    if args.action == 'plan':
        if not args.home or not args.project or not args.home.is_absolute() or not args.project.is_absolute():
            parser.error('plan requires absolute --home and --project')
        plan(args.home, args.project, args.receipt)
        print(json.dumps({'planned': 3, 'receipt': str(args.receipt)}))
    else:
        print(json.dumps({'changed': execute(args.receipt, args.action == 'rollback')}))
