# WayFold Harness architecture

The native Codex plugin is the only WFH activation surface. Its three skills
are `wayfold`, `planning-with-files`, and optional `linear-work-control`.
This document specifies the version 3 candidate; live acceptance is recorded
in the migration dossier, not inferred from this specification.

## Ownership

Codex owns tools, execution, permissions, model selection and worker lifecycle.
WFH owns only workflow-specific instructions and the minimum deterministic
helpers for identity and durable planning. Independent external skills are
selected through the Host's ordinary discovery and invocation behavior.
No WFH router, global dispatcher, MCP server or scheduler is added. Native plugin hooks (SessionStart, UserPromptSubmit, Stop) are included only for exact-bound tracked/planned tasks. They require Host trust and are unloaded with the plugin; no global hook registration is installed.

Quick requests do not acquire planning files. Tracked tasks retain the exact
Task ID and three-file authority. Reports and receipts are evidence, never a
second task database. Missing or conflicting bindings are explicit; waiting
or closed tasks are not reopened to satisfy a lookup.

## Activation and retirement

The package never installs global/project policies. Disabling or uninstalling
it must prevent new WFH discovery and automatic task/Linear activity without
loading a fallback from repository source or cache. Host-native safety and
independent user skills remain active. Stopping an installed plugin cannot
erase instructions from an existing model conversation or undo in-flight work.

Legacy global policies and planning hooks require one-time explicit migration
with drift-checked backups. Old scheduled jobs that read source directly stay
paused unless a real native plugin lifecycle can constrain them. A natural
language availability check is not a deterministic switch guarantee.

## Quality and compatibility

Keep observable outcome tests: permissions, exact task recovery, guarded
lifecycle transitions, Office factual accuracy/formulas/editability/rendering,
code behavior and external identity. Removing a Chief role wrapper cannot
remove those protections. Compatibility reads preserve original IDs; migration
must have one authoritative writer and reject ambiguous old/new state.

The candidate is implemented under `wfh/skills` and built by
`packages/wfh-plugin-kit`. Historical `harness/` code is retained in Git history and cold migration backups. Its global installation chain is retired and is not a supported WayFold entry.

## Tracked task hooks

An exact session-to-task binding is the opt-in for both planned and tracked work. No binding means direct work: no planning context or state writes, regardless of other active tasks. Entry restores the three-file authority without reading transcript text or guessing from prompt keywords. Stop requests one bounded reconciliation continuation only when progress.md has not changed this turn. It never closes, archives, reopens, or performs external writes. A checkpoint hash is presence evidence, not content-quality acceptance. Host interruption/crash can bypass Stop.

Hook receipts hold one latest turn/hash per session under `.wfh/planning-with-files/hook-turns/`; they are disposable and contain no prompts or secrets. Native hook trust is separate from plugin enablement. Off/untrusted hooks do not run; independent user hooks are outside WFH.
