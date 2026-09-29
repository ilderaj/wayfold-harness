# WayFold Harness — Homepage Design Contract (v3, "Paper & Ink")

Status: **active** (2026-09-29, v3). Supersedes the v2 contract, which had
been written for the retired SWF Trio runtime. Exact values live in
[UX-TOKENS.md](UX-TOKENS.md) and `src/theme.css`; this file is the directional
contract only.

## Overview

This homepage should feel useful, calm, and inspectable: a near-neutral paper
canvas, ink type, hairlines instead of shadows, and one coral accent used
sparingly. The visual language is drawn from the restraint of
[opencodex.me/zh-cn](https://opencodex.me/zh-cn/) and
[cursor.com](https://cursor.com/), with interaction components aligned to the
[shadcn/ui](https://github.com/shadcn-ui/ui) semantic contract (ink primary
buttons, hairline cards, pills on CTAs and badges, crisp ink focus rings).

The page exists to make a **thin** plugin tangible: the durable state is three
files, the runtime stays with Codex, and the newest implementation surface —
plugin-owned hooks bound to one exact task — is described in public terms.
Source and documentation stay the primary exit paths, not marketing chrome.

## Voice

- Lead with the concrete value: three readable files keep substantial work
  recoverable without a second control plane.
- Keep sentences short and specific.
- Prefer verbs such as hold, route, bind, restore, inspect, verify, and accept.
- Name the real artifacts: `task_plan.md`, `findings.md`, `progress.md`,
  `planning/active/<task-id>/`, `.wfh/planning-with-files/hook-turns/`.
- State limits as facts, not disclaimers: requested effort is intent, a helper
  result is a candidate, and four kinds of evidence are not interchangeable.
- Avoid hype language, inflated claims, and vague productivity promises.

## Page Structure

1. **Topbar:** full-width 60px hairline bar with brand mark, section anchors
   (Why · Skills · Hooks · Inspect · Start), the workflow link, and a primary
   `View source` CTA.
2. **Hero:** candidate kicker, direct sans headline, short lede, `View source`
   primary action, `Read workflow` secondary action, and a hairline **fact
   row** (native host, durable state, plugin skills, added runners).
3. **Hero proof surface:** one white card holding the Trio file rows, the dark
   terminal with real commands, and the routing card for how a task moves.
4. **Why a thin layer:** the dark authority card (one authority per task, with
   the three file rows) beside four boundaries the project refuses to cross.
5. **Three skills:** the three shipped skill entries, the boundary stack
   (Codex / WayFold Harness / your skills), and the quick · tracked · deep
   routes.
6. **Native hooks:** the bound-task lifecycle (SessionStart ·
   UserPromptSubmit, Stop), the disposable receipts path, one real bind
   command, and the trust/disable note.
7. **Inspect before you install:** durable-versus-native matrix plus the
   four-kinds-of-evidence band.
8. **Start:** candidate checks (build and verify commands), the skill entries,
   documentation links, and the closing CTA after the proof.

## Color Guidance

Use the near-neutral paper `#f7f7f4` as the page floor and ink `#1f1e1a` for
type and primary actions. Hairlines `#e3e2dd` separate surfaces; white cards
`#ffffff` carry raised content; `#efeeea` carries quiet bands such as the
receipt panel and the evidence strip. Coral `#cc785c` is reserved for tiny
accents — the hero status dot, route and skill chips, lane bullets, and hover
emphasis — never for fills. Dark `#171614` appears only on terminal and
authority surfaces plus the brand mark. Do not introduce cool blue, purple,
neon green, pure black canvases, or gradient washes.

## Typography Guidance

All type is sans-first. Headlines use the sans stack at 680 weight, tight
`-0.03em` tracking, and `text-wrap: balance`. Body copy stays 14-18px with
generous line height. Labels and kickers may be uppercase 11-12px with `0.08em`
tracking, in muted ink — they are markers, not accents. Mono is reserved for
code, filenames, and event names.

## Layout Guidance

The page uses a compact tool rhythm: a sticky full-width hairline topbar, a
hero split (copy left, proof mock right), sections separated by 1px hairlines
with 52px vertical padding, and a centered shell `min(1180px, calc(100% - 40px))`.
Cards are used where they carry real content; nested card walls are avoided —
inner groups are hairline rows or `--background` cells.

## Components

### Topbar

A thin, full-width hairline band, not a floating pill. Brand mark is a dark
28px square with an 8px radius. It orients the user and keeps source and docs
one click away. Below 620px it stays one row: brand left, compact CTA right.

### Hero Buttons

Hero primary action is always `View source` (ink fill, pill). Hero secondary
action is `Read workflow` (white fill + hairline, pill). Installation is
described later on the page, after the proof has earned it. Hover is a 150ms
surface shift — never a transform.

### File rows (the recurring motif)

The Trio, the authority card, and the receipts panel all use the same row
shape: a mono filename in ink over a 1px hairline, with a muted role sentence
beside it. This is the page's substitute for illustration — the durable state
is shown as the files it actually is. Asset types on this page are therefore:
hairline rows, the dark terminal surface, and hairline matrices. There is no
stock imagery; the only bitmap asset is the social card.

### Product Surface

The proof cluster is the visual anchor: a white card holding Trio file rows, a
dark terminal mock with flat coral/paper dots (no glow), and the routing card
explaining how a task is classified, how methods are loaded, and how results
are accepted.

### Proof Section

The durable-versus-native matrix stays inspectable: paper `--background` cells
with ink titles and muted bodies (never a muted fill behind muted text), plus
an evidence band naming the four kinds of evidence the project distinguishes.

## SEO Guidance

Search metadata describes the project as a thin Codex plugin for durable
planning, not a generic AI productivity site. Use the stable canonical URL
under `https://vibing.paymond.me/wayfold-harness/`. Social metadata points to
`wfh-social.png` in `homepage/public/`. `theme-color` is the paper token
`#f7f7f4`. The deploy smoke check in `.github/workflows/homepage-deploy.yml`
greps the exact `<title>` — change both together.

## Do

- Use paper, ink, hairline, white cards, and coral only as a tiny accent.
- Keep source and workflow inspection ahead of installation.
- Explain the workflow in concrete file-based terms.
- Preserve responsive single-column collapse for narrow screens.
- Keep SEO metadata aligned with the visible page promise.

## Don't

- Do not reintroduce the v1 warm-editorial layer (serif display, cream/coral
  fills, 18-20px radii, floating pill topbar, BMW M colors) or the v2
  SWF-specific identity (unrelated blue/orange or green brand marks).
- Do not use gradient text, glass effects, glow, side-stripe borders, or
  icon-card grids.
- Do not add product claims that are not visible in the repository.
- Do not make the page feel like a generic AI platform landing page.
