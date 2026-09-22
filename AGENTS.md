# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this repository is

KPMG Focus OS: a personal planning, focus, and study system built for Fortune Uzodinma, Analyst, Technology Risk at KPMG Nigeria. It started life as the MyPomodoro productivity app and now ships a "Performance Command Center" as the main experience.

Contents:

- `apps/web` - Next.js static-export app (React 19, Zustand, Tailwind 4, Vitest). The command center, timer, tasks, and session history live here.
- `packages/utils` - shared utilities.
- `kbac_academy_general_test_study_guide.html` - standalone, self-contained interactive study guide for the KPMG Academy General Test. Vanilla HTML/CSS/JS, no build step, opens directly in a browser.
- `context/` - working notes and handover context.

## Commands

```bash
pnpm install
pnpm dev        # local dev server on port 3000
pnpm build      # static export to apps/web/out/
pnpm test       # vitest
pnpm typecheck  # tsc --noEmit
pnpm lint       # eslint
```

## Architecture notes

- State lives in Zustand stores under `apps/web/src/store`. `planningStore.ts` owns the annual plan, monthly plans, weekly plan, daily plans, tasks, evidence ledger, automation pipeline, and KBAC study topics. It persists to `localStorage` under `kpmg-performance-command-center-v1` and parses stored data defensively (`readSnapshot`), so older snapshots receive defaults for new fields.
- `PerformanceCommandCenter.tsx` is the app shell. Tabs: Command, Horizons, KBAC sprint, Rating evidence, Automation, Roadmap.
- Styling: Tailwind utilities plus the `command-*` class system in `apps/web/src/app/globals.css`.
- The KBAC study guide is a single HTML file with no dependencies. Keep it that way unless there is a strong reason.

## Data safety rules

- Never add client names, client data, working papers, screenshots, credentials, or confidential KPMG material to this repository, the app, or the study guide.
- Planning entries are generic by design: engagement aliases and role titles only.
- The study guide is personal study material, not official KPMG content.

## Working agreements

- Keep changes consistent with existing structure, naming, and style.
- Run `pnpm typecheck` and the relevant Vitest files before finishing a change.
- User-facing copy style: direct, concise, practical, and free of em-dashes.
