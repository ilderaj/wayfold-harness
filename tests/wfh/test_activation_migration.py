import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

SOURCE = Path(__file__).resolve().parents[2] / 'scripts/migrate-wfh-activation.py'
spec = importlib.util.spec_from_file_location('migration', SOURCE)
migration = importlib.util.module_from_spec(spec)
spec.loader.exec_module(migration)


class ActivationMigrationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        # macOS /var may be a symlink; production code rejects symlink ancestors.
        self.root = Path(self.temp.name).resolve()
        self.home = self.root / 'home'
        self.project = self.root / 'project'
        (self.home / '.codex').mkdir(parents=True)
        self.project.mkdir()
        self.global_file = self.home / '.codex/AGENTS.md'
        self.global_file.write_text('User preferences\n' + migration.GLOBAL_BLOCK + 'Independent rule\n')
        (self.project / 'AGENTS.md').write_text(migration.PROJECT_BLOCK + '\nPreserve project instructions.\n')
        hooks = {'hooks': {}}
        for event, suffix in [('SessionStart', 'session-start'), ('UserPromptSubmit', 'user-prompt-submit')]:
            command = f'''sh -c '[ -f .codex/hooks/task-scoped-hook.sh ] && bash .codex/hooks/task-scoped-hook.sh codex {suffix} || bash "$HOME/.codex/hooks/task-scoped-hook.sh" codex {suffix}' '''.rstrip()
            hooks['hooks'][event] = [{'description': 'Harness-managed planning-with-files hook', 'hooks': [{'type': 'command', 'command': command}]}]
        hooks['hooks']['SessionStart'].append({'hooks': [{'type': 'command', 'command': 'user-command'}]})
        (self.home / '.codex/hooks.json').write_text(json.dumps(hooks))
        self.receipt = self.root / 'receipt.json'
        self.originals = {p: p.read_bytes() for p in [self.global_file, self.project / 'AGENTS.md', self.home / '.codex/hooks.json']}

    def tearDown(self):
        self.temp.cleanup()

    def test_removes_only_owned_activation_and_roundtrips_bytes(self):
        migration.plan(self.home, self.project, self.receipt)
        self.assertEqual(migration.execute(self.receipt), 3)
        self.assertEqual(self.global_file.read_text(), 'User preferences\nIndependent rule\n')
        hooks = json.loads((self.home / '.codex/hooks.json').read_text())
        self.assertEqual(hooks['hooks']['SessionStart'], [{'hooks': [{'type': 'command', 'command': 'user-command'}]}])
        self.assertEqual(migration.execute(self.receipt), 0)
        self.assertEqual(migration.execute(self.receipt, rollback=True), 3)
        for path, data in self.originals.items():
            self.assertEqual(path.read_bytes(), data)

    def test_preflight_stops_all_writes_on_drift(self):
        migration.plan(self.home, self.project, self.receipt)
        self.global_file.write_text('New user policy\n')
        with self.assertRaisesRegex(ValueError, 'Concurrent edit'):
            migration.execute(self.receipt)
        self.assertEqual((self.project / 'AGENTS.md').read_bytes(), self.originals[self.project / 'AGENTS.md'])

    def test_rollback_does_not_overwrite_later_user_change(self):
        migration.plan(self.home, self.project, self.receipt)
        migration.execute(self.receipt)
        self.global_file.write_text('Later user change\n')
        with self.assertRaisesRegex(ValueError, 'Concurrent edit'):
            migration.execute(self.receipt, rollback=True)
        self.assertEqual(self.global_file.read_text(), 'Later user change\n')

    def test_edited_hook_and_link_are_refused(self):
        p = self.home / '.codex/hooks.json'
        p.write_text(p.read_text().replace('session-start', 'session-start-changed'))
        with self.assertRaisesRegex(ValueError, 'hook was edited'):
            migration.plan(self.home, self.project, self.receipt)
        self.assertFalse(self.receipt.exists())
        self.global_file.unlink()
        self.global_file.symlink_to(self.project / 'AGENTS.md')
        with self.assertRaisesRegex(ValueError, 'non-regular'):
            migration.plan(self.home, self.project, self.receipt)


if __name__ == '__main__':
    unittest.main()
