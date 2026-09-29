# Migrating to WayFold Harness

WayFold Harness continues the SWF lineage as a native Codex plugin. Version 3.0.0-beta.1 contains three skills and no global policies, ambient hooks, scheduler, or external-skill mirror.

Install `wayfold-harness` through the native plugin manager. Before removing an old installation, preserve task data and personal assets. Remove old global/project SWF policy blocks and hook registrations using reviewed backups. Disable independent scheduled jobs that load retired source. Uninstall the old plugin; do not keep both versions active.

The plugin switch controls new WFH skill discovery. Disabling it does not delete task records, disable independently installed user skills, undo actions, or erase instructions already present in an existing conversation. Use a fresh context to verify activation changes. No legacy runtime should be loaded as a fallback.

Existing task IDs and three-file plans remain unchanged. Planning helpers read legacy binding records for continuity and write new bindings under `.wfh`. Conflicts require explicit reconciliation. Archive and reopen operations preserve task identity and lifecycle evidence.

Figma project rules, Kami and personal templates are independent user assets. Pen installation is outside this package. Professional methods are selected by the Host from available plugins without author-specific routing.

The beta has deterministic lifecycle/identity tests and native install/discovery/switch checks. Complete paired model-outcome and cost comparisons are not claimed. Linear support is a narrow target guard and visible synchronization debt, not the retired nightly runner or full project bootstrap.

Legacy source and full historical suites remain recoverable from Git history. They are not supported installation paths. The old CLI and adoption entry points fail closed. Local migration receipts and private backups are deliberately excluded from this public repository.
