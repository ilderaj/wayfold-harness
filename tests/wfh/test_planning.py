import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import unittest

SCRIPTS = Path(__file__).resolve().parents[2] / 'wfh/skills/planning-with-files/scripts'


class PlanningTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name).resolve()

    def tearDown(self):
        self.temp.cleanup()

    def task(self, name='demo', state='active', reconcile='not_required'):
        p = self.root / 'planning/active' / name
        p.mkdir(parents=True)
        (p/'task_plan.md').write_text(f'# Task\nTask ID: {name}\n\n## Current State\nStatus: {state}\nArchive Eligible: {"yes" if state == "closed" else "no"}\nReconcile: {reconcile}\n')
        for f in ['findings.md','progress.md']:
            (p/f).write_text('# Record\n')
        return p

    def run_helper(self, command, *args, ok=True):
        result = subprocess.run(['python3',str(SCRIPTS/'planning_paths.py'),command,str(self.root),*args],capture_output=True,text=True)
        self.assertEqual(result.returncode == 0,ok,result.stderr)
        return result.stdout.strip()

    def legacy(self, task='demo'):
        p=self.root/'.harness/planning-with-files/thread-bindings/thread.json'
        p.parent.mkdir(parents=True,exist_ok=True)
        p.write_text(json.dumps({'schemaVersion':1,'taskId':task}))
        return p

    def test_legacy_waiting_recovery_and_single_new_writer(self):
        task=self.task(state='waiting_review');legacy=self.legacy();original=legacy.read_bytes()
        self.assertEqual(self.run_helper('bound-task','thread'),str(task))
        self.run_helper('bind-thread','demo','thread')
        self.assertTrue((self.root/'.wfh/planning-with-files/thread-bindings/thread.json').exists())
        self.assertEqual(legacy.read_bytes(),original)
        self.assertIn('Status: waiting_review',(task/'task_plan.md').read_text())
        self.run_helper('clear-thread-binding','thread')
        self.assertEqual(self.run_helper('bound-task','thread'),'')

    def test_conflicting_binding_and_closed_task_not_implicitly_reopened(self):
        self.task();self.task('other');self.legacy()
        self.run_helper('bind-thread','other','thread',ok=False)
        p=self.root/'.wfh/planning-with-files/thread-bindings/thread.json';p.parent.mkdir(parents=True)
        p.write_text(json.dumps({'taskId':'other'}))
        self.run_helper('bound-task','thread',ok=False)

    def test_archive_rejects_open_reconciliation_and_reopen_keeps_identity(self):
        task=self.task(state='closed',reconcile='open')
        self.run_helper('archive-active','demo',ok=False)
        (task/'task_plan.md').write_text((task/'task_plan.md').read_text().replace('Reconcile: open','Reconcile: not_required'))
        archived=Path(self.run_helper('archive-active','demo'))
        self.assertFalse(task.exists());self.assertTrue(archived.exists())
        self.run_helper('reopen',str(archived))
        self.assertIn('Task ID: demo',(task/'task_plan.md').read_text())
        self.assertIn('Status: active',(task/'task_plan.md').read_text())
        self.assertIn('Archive Eligible: no',(task/'task_plan.md').read_text())

    def test_closed_and_mismatched_identity_never_resume_implicitly(self):
        task=self.task(state='closed');self.legacy()
        self.assertEqual(self.run_helper('bound-task','thread'),'')
        (task/'task_plan.md').write_text((task/'task_plan.md').read_text().replace('Task ID: demo','Task ID: other'))
        self.run_helper('bound-task','thread',ok=False)

    def test_linked_task_refused(self):
        task=self.task();(task/'findings.md').unlink();(task/'findings.md').symlink_to(task/'progress.md')
        self.run_helper('bind-thread','demo','thread',ok=False)

    def test_companion_cannot_escape_project(self):
        task=self.task(state='closed')
        with (task/'task_plan.md').open('a') as f:
            f.write('\n- Companion plan: `../outside.md`\n')
        self.run_helper('archive-active','demo',ok=False)
        self.assertTrue(task.exists())

    def test_linear_lifecycle_leaves_debt_without_changing_binding(self):
        task=self.task(state='closed');binding=task/'linear.json';binding.write_text('{"private":"fixture"}')
        original=binding.read_bytes();archived=Path(self.run_helper('archive-active','demo'))
        self.assertEqual((archived/'linear.json').read_bytes(),original)
        receipts=list((self.root/'.wfh/linear/lifecycle-pending/demo').glob('*.json'))
        self.assertEqual(len(receipts),1)
        self.assertTrue(json.loads(receipts[0].read_text())['pendingRetry'])
        self.assertIn('pending external verification',(archived/'progress.md').read_text())


if __name__ == '__main__':
    unittest.main()
