export const homepageSectionOrder = ['hero', 'problem', 'skills', 'hooks', 'proof', 'start'];

const githubUrl = 'https://github.com/ilderaj/wayfold-harness';
const workflowUrl = `${githubUrl}/blob/main/docs/workflows.md`;
const architectureUrl = `${githubUrl}/blob/main/docs/architecture.md`;
const migrationUrl = `${githubUrl}/blob/main/docs/migration.md`;
const readmeUrl = `${githubUrl}/blob/main/README.md`;

const trioFiles = [
  { name: 'task_plan.md', role: 'Goal, scope, phases, decisions' },
  { name: 'findings.md', role: 'Facts, sources, open unknowns' },
  { name: 'progress.md', role: 'Actions, verification, blockers, next action' }
];

export const homepageContent = {
  topbar: {
    brandLabel: 'WayFold Harness',
    brandHref: '#top',
    links: [
      { label: 'Why', href: '#problem' },
      { label: 'Skills', href: '#skills' },
      { label: 'Hooks', href: '#hooks' },
      { label: 'Inspect', href: '#proof' },
      { label: 'Start', href: '#start' }
    ],
    cta: {
      label: 'View source',
      href: githubUrl,
      external: true
    },
    docs: {
      label: 'Read workflow',
      href: workflowUrl,
      external: true
    }
  },
  hero: {
    headingId: 'hero-title',
    eyebrow: 'Native Codex plugin · v3 candidate',
    headline: 'Three files hold the plan. Codex runs the work.',
    lede:
      'WayFold Harness keeps substantial work recoverable with one Task ID and three planning files. Execution, permissions and continuation stay native to Codex.',
    actions: [
      { label: 'View source', href: githubUrl, variant: 'primary', external: true },
      { label: 'Read workflow', href: workflowUrl, variant: 'secondary', external: true }
    ],
    facts: [
      { label: 'Native host', value: 'Codex' },
      { label: 'Durable state', value: '3 files' },
      { label: 'Plugin skills', value: '3 entries' },
      { label: 'Added runners', value: 'none' }
    ],
    trio: {
      title: 'The Trio',
      caption: 'One Task ID · planning/active/<task-id>/',
      files: trioFiles
    },
    terminal: {
      title: 'wayfold-harness · 3.0.0-beta.2',
      lines: [
        { tone: 'cmd', prefix: '$', text: 'npm run verify:wfh' },
        { tone: 'dim', text: 'Runs the deterministic lifecycle and identity tests.' },
        { tone: 'cmd', prefix: '$', text: 'npm run wfh:build' },
        { tone: 'dim', text: 'Builds dist/wayfold-harness and refuses to overwrite it.' },
        { tone: 'break' },
        { tone: 'hot', text: '$wayfold-harness:wayfold' },
        { tone: 'hot', text: '$wayfold-harness:planning-with-files' },
        { tone: 'hot', text: '$wayfold-harness:linear-work-control' }
      ]
    },
    route: {
      title: 'How a task moves',
      badge: 'deep is current-round',
      steps: [
        {
          number: '1',
          title: 'Classify the work',
          body: 'Quick questions and bounded edits stay direct; tracked work gets one Task ID and the Trio.'
        },
        {
          number: '2',
          title: 'Load only what helps',
          body: 'The Host selects relevant installed skills; project knowledge stays with the project.'
        },
        {
          number: '3',
          title: 'Accept the result',
          body: 'Worker results are candidates until the main session accepts them.'
        }
      ]
    }
  },
  problem: {
    id: 'problem',
    kicker: 'Why a thin layer',
    title: 'The runtime stays native. The state stays small.',
    body:
      'Continuation, permissions and model choice already belong to Codex. WayFold adds a short workflow and three readable files, and nothing that runs beside the Host.',
    authority: {
      title: 'One authority per task',
      body:
        'The Trio stays on disk under planning/active/<task-id>/. It survives a compaction and stays readable enough to review before you resume.',
      files: trioFiles
    },
    boundaries: [
      {
        icon: '01',
        title: 'No second runner',
        body: 'Native Goal and continuation run long work with no second runner and no parallel queue.'
      },
      {
        icon: '02',
        title: 'No model router',
        body: 'The Host selects the model and the effort; WayFold records the request and never invents a result.'
      },
      {
        icon: '03',
        title: 'No global policy',
        body: 'Nothing is appended to global or project policy files. Plugin hooks stay plugin-scoped and need trust.'
      },
      {
        icon: '04',
        title: 'No hidden tracker',
        body: 'Reports and receipts are evidence, never a second task database. The Task ID and the Trio stay authoritative.'
      }
    ]
  },
  skills: {
    id: 'skills',
    kicker: 'What you install',
    title: 'Three skills. One Trio. Your own specialists.',
    body:
      'The plugin ships three focused entries. Professional skills stay independent and are selected by the Host when they are relevant to the work.',
    entries: [
      {
        name: 'wayfold',
        role: 'Route the work',
        body: 'Choose the smallest useful workflow, and load quality references only when the task needs them.'
      },
      {
        name: 'planning-with-files',
        role: 'Hold the Trio',
        body: 'Keep one Task ID and three durable files; close, archive and reopen stay explicit and guarded.'
      },
      {
        name: 'linear-work-control',
        role: 'Guard Linear',
        body: 'Optional coordination with workspace, project and issue identity checks; the local files stay authoritative.'
      }
    ],
    layersTitle: 'Where the boundary sits',
    layers: [
      {
        name: 'Codex',
        role: 'Host',
        body: 'Owns tools, execution, lifecycle, permissions, continuation and model selection.'
      },
      {
        name: 'WayFold Harness',
        role: 'Thin layer',
        body: 'Owns workflow instructions, task identity and the Trio. No scheduler, no second router, no mirrored skill pack.'
      },
      {
        name: 'Your skills',
        role: 'Independent',
        body: 'Selected from what is already installed. Same-name sources are never merged and nothing is installed for you.'
      }
    ],
    routesTitle: 'Routes',
    routesNote: 'Quick and tracked route the work; deep is a current-round reasoning choice, not a task type.',
    routes: [
      { name: 'quick', body: 'Direct work. No planning files are created.' },
      { name: 'tracked', body: 'One Task ID and the Trio keep durable state.' },
      { name: 'deep', body: 'Extra reasoning for the current round only.' }
    ],
    note: 'Methods by Matt and other authors are equally eligible. Being installed does not guarantee that a model selects one correctly.'
  },
  hooks: {
    id: 'hooks',
    kicker: 'Native hooks, exact-bound scope',
    title: 'Recovery and wrap-up for the task you bound.',
    body:
      'An exact session-to-task binding opts a task into the plugin hooks. Unbound work stays direct and gets no planning intervention.',
    steps: [
      {
        event: 'SessionStart · UserPromptSubmit',
        body: 'Restore the exact bound Task ID and its three files. A task is never guessed from prompt keywords.'
      },
      {
        event: 'Stop',
        body: 'When progress.md did not change this turn, request at most one bounded wrap-up. Hooks never close, archive or reopen a task.'
      }
    ],
    receipts: {
      title: 'Receipts stay disposable',
      body:
        'One latest turn ID and progress hash per session under .wfh/planning-with-files/hook-turns/. A changed hash shows a checkpoint was written, not that its contents are correct.'
    },
    command: {
      label: 'Bind once, explicitly',
      text: 'python3 <skill>/scripts/planning_paths.py bind-thread <project-root> <task-id> <thread-id>'
    },
    note: 'Native hook trust is separate from plugin enablement. Disabling the plugin leaves your task data and your other skills in place.'
  },
  proof: {
    id: 'proof',
    kicker: 'Inspect before you install',
    title: 'What stays durable. What stays native.',
    tracks: [
      {
        title: 'Stays durable.',
        body: 'Task identity and the three files remain the only authority, readable after the session that wrote them.',
        rows: [
          [
            {
              title: 'Task identity',
              body: 'One Task ID per task; bindings are written under .wfh/ and never guessed.'
            },
            {
              title: 'The Trio',
              body: 'task_plan.md, findings.md and progress.md carry the plan, the facts and the state.'
            }
          ],
          [
            {
              title: 'Recovery',
              body: 'A new context restores the bound task instead of restarting it.'
            },
            {
              title: 'Lifecycle',
              body: 'Close, archive and reopen are explicit, guarded operations.'
            }
          ]
        ]
      },
      {
        title: 'Stays native.',
        body: 'Codex keeps the controls it already owns, so nothing has to be re-granted to a second system.',
        rows: [
          [
            {
              title: 'Execution',
              body: 'Tools, approvals and worker lifecycle remain with the Host.'
            },
            {
              title: 'Model evidence',
              body: 'Requested model and effort are intent; actual is unknown without Host evidence.'
            }
          ],
          [
            {
              title: 'Continuation',
              body: 'Native Goal and continuation keep long work moving.'
            },
            {
              title: 'Exit path',
              body: 'Source and documentation stay visible before any installation command.'
            }
          ]
        ]
      }
    ],
    evidence: {
      title: 'Four kinds of evidence',
      body:
        'Static tests, plugin installation, deployment and real user outcomes are different evidence. This page reports the repository state, not a live acceptance.',
      items: ['Static tests', 'Plugin installation', 'Deployment', 'User outcome']
    }
  },
  start: {
    id: 'start',
    kicker: 'Start here',
    title: 'Inspect the candidate, then install it through Codex.',
    body:
      'Version 3 is an implementation candidate. Verify the build and read the migration notes before you switch; the plugin is installed through native plugin management, not a global policy file.',
    checksTitle: 'Candidate checks',
    checksBody: 'Each command is explicit, so the repository state stays inspectable before you adopt it.',
    commands: ['npm run verify:wfh', 'npm run wfh:build'],
    skillsLabel: 'Skill entries after install',
    skills: [
      '$wayfold-harness:wayfold',
      '$wayfold-harness:planning-with-files',
      '$wayfold-harness:linear-work-control'
    ],
    docs: [
      { label: 'Workflow', href: workflowUrl, external: true },
      { label: 'Architecture', href: architectureUrl, external: true },
      { label: 'Migration notes', href: migrationUrl, external: true }
    ],
    trustNote: 'Review and trust the plugin hooks in /hooks before first use; installation alone does not grant hook trust.',
    cta: {
      title: 'Read the README once the proof is enough.',
      body:
        'Read the source, inspect the workflow, then install the plugin without adding a hidden control plane above the Host.',
      action: { label: 'Read the README', href: readmeUrl, external: true },
      secondaryAction: { label: 'Open GitHub and star the repo', href: githubUrl, external: true }
    }
  },
  footer: {
    left: 'WayFold Harness · Codex plugin candidate.',
    right: 'Three files · one Task ID · native execution',
    links: [
      { label: 'View source', href: githubUrl, external: true },
      { label: 'Read workflow', href: workflowUrl, external: true },
      { label: 'Migration notes', href: migrationUrl, external: true }
    ]
  }
};
