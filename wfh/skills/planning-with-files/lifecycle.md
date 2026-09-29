# Lifecycle

Before closing, verify the user's intended outcome and required checks, resolve or explicitly retain blockers, and record acceptance. A static green result is not business delivery. Waiting/review/blocked is not closed.

Use `scripts/close-task.py <project-root> <exact-task-id> --reason <verified reason>` to record authorized closure. Use `scripts/planning_paths.py archive-active <project-root> <exact-task-id>` only when lifecycle inspection allows it. Existing companion metadata and reconciliation/receipt protections are retained for old tasks; they are not required for new tasks. Do not silently move an active or waiting task.

Use `scripts/planning_paths.py reopen <project-root> <exact-closed-task-path>` only for authorized reopening; retain the original Task ID. Reopening does not grant unattended readiness.

For an existing Linear binding, lifecycle changes must leave visible sync debt until the exact issue UUID is reconciled and read back through the independent connector. Local completion is not external synchronization. The candidate preserves this limitation explicitly; no scheduler, remote write, or old runtime fallback is invoked by a helper.
