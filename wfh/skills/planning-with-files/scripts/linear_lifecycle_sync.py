"""Stage local-only debt; never mutate an existing binding or call a connector."""
import hashlib
import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path


def stage_lifecycle_sync(project_path, task_id, plan_dir, event):
    root, plan = Path(project_path), Path(plan_dir)
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9._-]{0,79}", task_id):
        raise ValueError("unsafe task ID")
    if event not in {"close", "archive", "reopen"}:
        raise ValueError("unsupported lifecycle event")
    candidates = [root / "reports/linear" / task_id / "linear.json", plan / "linear.json"]
    bindings = [p for p in candidates if p.exists() or p.is_symlink()]
    if not bindings:
        return "local-only task; no existing Linear binding"
    for p in bindings:
        if p.is_symlink() or any(x.is_symlink() for x in p.parents):
            raise ValueError("linked Linear binding refused")
    target = root / ".wfh/linear/lifecycle-pending" / task_id
    if any(p.is_symlink() for p in (target, *target.parents)):
        raise ValueError("linked debt directory refused")
    target.mkdir(parents=True, exist_ok=True)
    record = {"taskId": task_id, "event": event, "trioPath": str(plan),
              "observedAt": datetime.now(timezone.utc).isoformat(), "pendingRetry": True,
              "bindings": [{"path": str(p), "sha256": hashlib.sha256(p.read_bytes()).hexdigest()}
                           for p in bindings]}
    fd, name = tempfile.mkstemp(prefix=event + "-", suffix=".json", dir=target)
    with os.fdopen(fd, "w") as f:
        json.dump(record, f, indent=2)
        f.write("\n")
    with (plan / "progress.md").open("a") as f:
        f.write(f"\n- Linear lifecycle {event}: pending external verification; local receipt {name}.\n")
    return "pending external synchronization; existing binding unchanged"
