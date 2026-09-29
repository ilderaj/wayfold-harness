export const homepageSectionOrder = ['hero', 'problem', 'system', 'workflow', 'start'];

const githubUrl = 'https://github.com/ilderaj/wayfold-harness';
const workflowUrl = `${githubUrl}/blob/main/docs/workflows.md`;
const readmeUrl = `${githubUrl}/blob/main/README.md`;

export const homepageContent = {
  topbar: {
    brandLabel: 'WayFold Harness',
    brandHref: '#top',
    links: [
      { label: 'Why', href: '#problem' },
      { label: 'System', href: '#system' },
      { label: 'Proof', href: '#workflow' },
      { label: 'Start', href: '#start' }
    ],
    cta: {
      label: 'View source',
      href: githubUrl,
      external: true
    },
    github: {
      label: 'Read workflow',
      href: workflowUrl
    }
  },
  hero: {
    headingId: 'hero-title',
    eyebrow: 'A thin Codex plugin',
    headline: 'Plan in one session. Execute with proof.',
    lede:
      'Keep long work recoverable with three planning files. Use the professional skills you choose, while Codex handles execution and permissions.',
    actions: [
      { label: 'View source', href: githubUrl, variant: 'primary', external: true },
      { label: 'Read workflow', href: workflowUrl, variant: 'secondary', external: true }
    ],
    proofPoints: [
      { value: '1', label: 'native host: Codex' },
      { value: '3', label: 'only durable task files' },
      { value: '3', label: 'focused skill entries' },
      { value: '0', label: 'second runners' }
    ],
    terminal: {
      title: 'WayFold Harness',
      lines: [
        { tone: 'cmd', prefix: '$', text: '$wayfold-harness:wayfold' },
        { tone: 'dim', text: 'Host owns lifecycle, permissions, and continuation.' },
        { tone: 'hot', text: 'task_plan.md · findings.md · progress.md' },
        { tone: 'hot', text: 'quality references only when the task needs them' },
        { tone: 'break' },
        { tone: 'cmd', prefix: '$', text: 'npm run verify:wfh' },
        { tone: 'dim', text: 'Requested model and effort are intent; actual is unknown without Host evidence.' }
      ]
    },
    route: {
      title: 'Routed by task',
      badge: 'deep is current-round',
      steps: [
        {
          number: '1',
          title: 'Choose the route',
          body: 'Quick and tracked classify durable work. Deep is a current-round reasoning choice, not a task type.'
        },
        {
          number: '2',
          title: 'Use the right method',
          body: 'Use relevant installed skills from any author; keep project knowledge with the project.'
        },
        {
          number: '3',
          title: 'Keep Host control',
          body: 'Worker results are candidates until the main session accepts them.'
        }
      ]
    }
  },
  problem: {
    id: 'problem',
    kicker: 'Why WayFold',
    title: 'Avoid a second control plane.',
    body:
      'Durable task state and long-task runtime should stay small, visible, and native to the Host.',
    quoteTitle: 'The durable state is only three files.',
    quoteBody:
      'The Trio keeps task_plan.md, findings.md, and progress.md together while the Host keeps its own controls.',
    pains: [
      {
        icon: '01',
        title: 'Host boundaries blur',
        body: 'Codex supplies execution and permissions. WFH does not add a second runner or model router.'
      },
      {
        icon: '02',
        title: 'State spreads',
        body: 'Tracked work needs one small authority, not task facts scattered across chats and side systems.'
      },
      {
        icon: '03',
        title: 'Reasoning becomes a label',
        body: 'Quick and tracked route the work; deep is a current-round decision when uncertainty earns it.'
      },
      {
        icon: '04',
        title: 'Worker status overclaims',
        body: 'A worker result is evidence for acceptance, never automatic completion.'
      }
    ]
  },
  system: {
    id: 'system',
    kicker: 'How WayFold works',
    title: 'Keep the authority small and the runtime native.',
    body:
      'The Trio is the durable authority. Native Goal and continuation run long work with no second runner.',
    modules: [
      {
        label: 'Host',
        title: 'Codex stays native',
        body: 'The Host owns lifecycle, permissions, continuation, and authenticated actual model evidence.'
      },
      {
        label: 'Trio',
        title: 'Three files, one authority',
        body: 'Tracked work lives only in task_plan.md, findings.md, and progress.md.'
      },
      {
        label: 'Skills',
        title: 'Load only what is needed',
        body: 'A workflow entry, planning continuity and optional Linear coordination.'
      },
      {
        label: 'Runtime',
        title: 'Continue natively',
        body: 'Native Goal and continuation recover long work without adding a second runner.'
      }
    ],
    lanes: ['quick', 'tracked', 'deep']
  },
  workflow: {
    id: 'workflow',
    kicker: 'Public boundaries',
    title: 'Inspect the Trio and Host boundaries.',
    tracks: [
      {
        title: 'What stays durable.',
        body:
          'Only the Trio remains on disk as task authority; its contents are readable, reviewable, and ready to resume.',
        rows: [
          [
            { title: 'Core state', body: 'Only task_plan.md, findings.md, and progress.md live under planning/active/<task-id>/.' },
            { title: 'Relevant method', body: 'External methods stay independent; WFH retains only short quality contracts.' }
          ],
          [
            { title: 'Route', body: 'Quick and tracked are routes; deep is a current-round reasoning choice.' },
            { title: 'Acceptance', body: 'Worker results remain candidates until the main session accepts them.' }
          ]
        ]
      },
      {
        title: 'What stays native.',
        body:
          'The Host keeps control of lifecycle, permissions, continuation, and authenticated evidence instead of handing those roles to another runtime.',
        rows: [
          [
            { title: 'Model evidence', body: 'Requested model and effort are intent; actual is unknown without Host evidence.' },
            { title: 'Long tasks', body: 'Native Goal and continuation run long work with no second runner.' }
          ],
          [
            { title: 'Native host', body: 'One Codex plugin. No ambient hooks or global policy installation.' },
            { title: 'Proof path', body: 'Source and workflow docs stay visible before anyone chooses an installation command.' }
          ]
        ]
      }
    ]
  },
  start: {
    id: 'start',
    kicker: 'Start here',
    title: 'Start with the WayFold candidate.',
    body:
      'Version 3 is a migration candidate. Inspect the source and validation before adopting it; live cutover is tracked separately.',
    quickStartTitle: 'Candidate checks',
    quickStartBody: 'The command names stay explicit so each step remains easy to inspect before use.',
    commands: [
      'codex plugin list --json',
      'npm run verify:wfh',
      'npm run wfh:build',
      '$wayfold-harness:wayfold',
      '$wayfold-harness:planning-with-files',
      '$wayfold-harness:linear-work-control'
    ],
    cta: {
      title: 'Read the README once the repo proof is enough.',
      body: 'Read the source, inspect the workflow, then use the Trio without adding a hidden control plane above the Host.',
      action: { label: 'Read the README', href: readmeUrl, external: true },
      secondaryAction: { label: 'Open GitHub and star the repo', href: githubUrl, external: true }
    }
  },
  footer: {
    left: 'WayFold Harness · Codex plugin candidate.',
    right: 'Native Host control · repo-native proof',
    github: {
      label: 'View source',
      href: githubUrl
    }
  }
};
