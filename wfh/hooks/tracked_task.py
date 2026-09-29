#!/usr/bin/env python3
"""Native plugin hook: exact binding only, no inferred tasks or lifecycle writes."""
import hashlib
import json
import os
import re
from pathlib import Path
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True
SCRIPTS = Path(__file__).resolve().parents[1] / 'skills/planning-with-files/scripts'
sys.path.insert(0, str(SCRIPTS))
from planning_paths import PLANNING_FILES, SAFE_THREAD_ID_RE, read_thread_binding


def project_root(cwd):
    root = Path(cwd).absolute()
    # Never cross the nearest checkout into a different project's binding store.
    result = subprocess.run(['git', '-C', str(root), 'rev-parse', '--show-toplevel'],
                            capture_output=True, text=True, timeout=2)
    return Path(result.stdout.strip()) if result.returncode == 0 else root


def safe_file(path):
    if any(p.is_symlink() for p in (path, *path.parents)):
        raise ValueError('linked hook state refused')
    if path.exists() and (not path.is_file() or path.stat().st_nlink != 1):
        raise ValueError('nonregular hook state refused')


def read_state(path):
    safe_file(path)
    if not path.exists():
        return {}
    value = json.loads(path.read_text())
    if not isinstance(value, dict):
        raise ValueError('invalid hook state')
    if not all(isinstance(value.get(k), str) for k in ('turn', 'task', 'progress')) or not re.fullmatch('[a-f0-9]{64}', value['progress']):
        raise ValueError('invalid hook checkpoint')
    return value


def write_state(path, value):
    safe_file(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temporary = tempfile.mkstemp(prefix='.turn-', dir=path.parent)
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(value, stream)
            stream.write('\n')
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def handle(payload):
    event = payload.get('hook_event_name')
    session = payload.get('session_id')
    if event not in {'SessionStart', 'UserPromptSubmit', 'Stop'} or payload.get('agent_id'):
        return None
    if not isinstance(session, str) or not SAFE_THREAD_ID_RE.fullmatch(session):
        return None
    cwd = payload.get('cwd')
    if not isinstance(cwd, str) or not Path(cwd).is_absolute():
        return None
    root = project_root(cwd)
    task = read_thread_binding(root, session)
    # Explicit binding is the opt-in. Never scan active tasks or infer from a prompt.
    if task is None:
        return None
    if not all((task / name).is_file() for name in PLANNING_FILES):
        raise ValueError('bound task requires all three planning files')
    turn = payload.get('turn_id')
    state_path = root / '.wfh/planning-with-files/hook-turns' / (session + '.json')
    progress = digest(task / 'progress.md')
    context = (
        'WFH tracked/planned task: ' + json.dumps(str(task)) + '. '
        'Read task_plan.md, findings.md and progress.md before continuing; preserve this exact Task ID. '
        'Use the installed planning-with-files skill. Existing waiting/blocked states grant no new authority. '
        'Before ending this turn, record verified actions, checks, blockers and next action in progress.md; '
        'update task_plan.md/findings.md where facts changed. Do not invent results or close/archive merely because a turn ends.'
    )
    if event in {'SessionStart', 'UserPromptSubmit'}:
        if event == 'UserPromptSubmit' and isinstance(turn, str) and turn:
            state = read_state(state_path)
            if state.get('turn') != turn or state.get('task') != task.name:
                write_state(state_path, {'turn': turn, 'task': task.name, 'progress': progress})
        return {'hookSpecificOutput': {'hookEventName': event, 'additionalContext': context}}
    if not isinstance(turn, str) or not turn:
        return {'systemMessage': 'WFH wrap-up not verified: Host did not supply a turn_id.'}
    state = read_state(state_path)
    same_turn = state.get('turn') == turn and state.get('task') == task.name
    if same_turn and state.get('progress') != progress:
        return None
    if payload.get('stop_hook_active') or (same_turn and state.get('requested')):
        return {'systemMessage': 'WFH wrap-up remains unverified: progress.md did not change. No further automatic continuation.'}
    # One bounded continuation, including a task bound during this turn. This receipt
    # is disposable bookkeeping, never a second task authority or completion claim.
    write_state(state_path, {'turn': turn, 'task': task.name, 'progress': progress, 'requested': True})
    return {'decision': 'block', 'reason': context + ' The turn progress checkpoint is missing. Finish only this local wrap-up, then return the final answer; do not restart implementation or repeat external writes.'}


def main():
    try:
        payload = json.load(sys.stdin)
        if not isinstance(payload, dict):
            return
        result = handle(payload)
    except (ValueError, TypeError, AttributeError, OSError, RuntimeError, subprocess.SubprocessError):
        # Never guess a task, stop a user's direct work, or print private payloads.
        result = {'systemMessage': 'WFH task hook could not verify the exact binding or local checkpoint; no task was changed.'}
    if result:
        print(json.dumps(result))


if __name__ == '__main__':
    main()
