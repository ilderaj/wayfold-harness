# WayFold Harness

WayFold Harness (WFH) is a small Codex plugin for keeping substantial work
recoverable without building another agent runtime. Codex supplies execution,
permissions and skill selection. WFH supplies a short workflow, three planning
files and optional guarded Linear coordination.

## Migration status

Version 3 is an implementation candidate. Installation, live behavior, release
and local workspace migration are tracked separately in the
[migration notes](docs/migration.md).
A successful build does not establish production cutover or cost savings.
Historical SWF source is recoverable from Git history and cold backups; it is not a second WFH installation method. Do not run legacy adoption or projection commands to
install this candidate.

## Three skills

- **wayfold**: choose the smallest useful workflow; use external professional
  skills when available and relevant. Ordinary quick work stays direct.
- **planning-with-files**: preserve one Task ID and `task_plan.md`, `findings.md`,
  `progress.md`; recover and checkpoint when something material changes.
- **linear-work-control**: optional external coordination with workspace,
  Project and issue identity checks. Local planning files remain authoritative.

Engineering, Office quality, safety, visual review and simplification are
short on-demand references. WFH does not bundle a second scheduler, model
router, MCP server, global hooks, IDE projections, or a mirrored specialist
skill collection. Matt and other external methods are independently supplied;
being installed does not guarantee that a model selects a skill correctly.

## Build and verify the candidate

```sh
npm run verify:wfh
npm run wfh:build
```

The builder refuses to overwrite an existing output. For another candidate use
`npm run wfh:build -- --output /absolute/new-directory/wayfold-harness`.

The plugin must be installed through Codex's native plugin manager. It does not
append instructions to global or project `AGENTS.md`. Disable it to stop new
WFH activation; existing running sessions need the Host's supported stop and
fresh-session boundary. Task files and independently installed user skills stay
available. See the [activation contract](docs/architecture.md).

## Migration and ownership

The product continues the SWF lineage. Original Task IDs, UUIDs and Git history
are retained. The target product and plugin name is `wayfold-harness`; source,
registry, remote and local path migrations require their own verified receipts.
The independent WayFold design checkout is not replaced.

Figma project rules, Kami resources and personal templates belong in the user
layer. Pen is not part of WFH; a later Magpie installation is independent.
Third-party licenses and provenance remain attached to retained source.

Read the [daily workflow](docs/workflows.md) and the
[migration and activation notes](docs/migration.md).
