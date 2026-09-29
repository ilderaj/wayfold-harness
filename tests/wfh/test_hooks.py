import json
from pathlib import Path
import subprocess
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
HOOK = ROOT / 'wfh/hooks/tracked_task.py'
HELPER = ROOT / 'wfh/skills/planning-with-files/scripts/planning_paths.py'


class HookTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name).resolve()
        self.task = self.root / 'planning/active/demo'

    def tearDown(self):
        self.temp.cleanup()

    def bind(self, status='active', legacy=False):
        self.task.mkdir(parents=True)
        (self.task / 'task_plan.md').write_text('Task ID: demo\n\n## Current State\nStatus: ' + status + '\nArchive Eligible: no\n')
        for name in ['findings.md', 'progress.md']:
            (self.task / name).write_text('# Record\n')
        p = self.root / ('.harness' if legacy else '.wfh') / 'planning-with-files/thread-bindings/thread.json'
        p.parent.mkdir(parents=True)
        p.write_text(json.dumps({'taskId': 'demo'}))

    def run_hook(self, event, **extra):
        payload = {'hook_event_name': event, 'session_id': 'thread', 'turn_id': 'turn-1', 'cwd': str(self.root), **extra}
        result = subprocess.run(['python3', str(HOOK)], input=json.dumps(payload), text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
        return json.loads(result.stdout) if result.stdout else None

    def test_direct_no_binding_even_with_other_plans_has_no_effect(self):
        self.task.mkdir(parents=True)
        (self.task / 'task_plan.md').write_text('Task ID: demo\n')
        before = sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*'))
        for event in ['SessionStart', 'UserPromptSubmit', 'Stop']:
            self.assertIsNone(self.run_hook(event))
        self.assertEqual(before, sorted(str(p.relative_to(self.root)) for p in self.root.rglob('*')))

    def test_entry_exact_recovery_and_once_only_wrapup(self):
        self.bind()
        original = (self.task / 'task_plan.md').read_bytes()
        self.assertIn(str(self.task), self.run_hook('SessionStart')['hookSpecificOutput']['additionalContext'])
        self.run_hook('UserPromptSubmit')
        self.assertEqual(self.run_hook('Stop')['decision'], 'block')
        self.assertNotIn('decision', self.run_hook('Stop'))
        with (self.task / 'progress.md').open('a') as stream:
            stream.write('Verified checks; blocked on review; next step recorded.\n')
        self.assertIsNone(self.run_hook('Stop', stop_hook_active=True))
        self.assertEqual(original, (self.task / 'task_plan.md').read_bytes())

    def test_normal_checkpoint_does_not_force_extra_turn(self):
        self.bind(); self.run_hook('UserPromptSubmit')
        (self.task / 'progress.md').write_text('Turn result and next action\n')
        self.assertIsNone(self.run_hook('Stop'))
        self.run_hook('UserPromptSubmit', turn_id='turn-2')
        self.assertEqual(self.run_hook('Stop', turn_id='turn-2')['decision'], 'block')

    def test_bound_mid_turn_requests_checkpoint_and_never_loops(self):
        self.assertIsNone(self.run_hook('UserPromptSubmit'))
        self.bind()
        self.assertEqual(self.run_hook('Stop')['decision'], 'block')
        self.assertNotIn('decision', self.run_hook('Stop', stop_hook_active=True))

    def test_waiting_legacy_and_clear_to_direct(self):
        self.bind('waiting_review', legacy=True)
        self.assertIn('grant no new authority', self.run_hook('UserPromptSubmit')['hookSpecificOutput']['additionalContext'])
        subprocess.run(['python3', str(HELPER), 'clear-thread-binding', str(self.root), 'thread'], check=True)
        self.assertIsNone(self.run_hook('Stop'))
        self.assertIn('waiting_review', (self.task / 'task_plan.md').read_text())

    def test_closed_not_reopened_and_subagents_do_not_write_parent(self):
        self.bind('closed')
        self.assertIsNone(self.run_hook('UserPromptSubmit'))
        self.assertIsNone(self.run_hook('Stop'))
        self.assertIsNone(self.run_hook('UserPromptSubmit', agent_id='child'))
        self.assertFalse((self.root / '.wfh/planning-with-files/hook-turns').exists())

    def test_linked_progress_and_linked_state_refused(self):
        self.bind()
        target = self.root / 'outside.md'; target.write_text('unchanged')
        (self.task / 'progress.md').unlink(); (self.task / 'progress.md').symlink_to(target)
        self.assertIn('could not verify', self.run_hook('Stop')['systemMessage'])
        self.assertEqual(target.read_text(), 'unchanged')
        (self.task / 'progress.md').unlink(); (self.task / 'progress.md').write_text('# Record\n')
        state = self.root / '.wfh/planning-with-files/hook-turns'; state.symlink_to(self.root, target_is_directory=True)
        self.assertIn('could not verify', self.run_hook('UserPromptSubmit')['systemMessage'])
        self.assertFalse((self.root / 'thread.json').exists())

    def test_missing_turn_and_changed_binding_do_not_pass_silently(self):
        self.bind(); self.run_hook('UserPromptSubmit')
        self.assertIn('turn_id', self.run_hook('Stop', turn_id=None)['systemMessage'])
        (self.task / 'task_plan.md').write_text('Task ID: different\n\n## Current State\nStatus: active\n')
        self.assertIn('could not verify', self.run_hook('Stop')['systemMessage'])


if __name__ == '__main__':
    unittest.main()
