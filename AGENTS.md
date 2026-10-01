# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this repository is

KPMG Focus OS: a personal planning, focus, and study system built for Fortune Uzodinma, Analyst, Technology Risk at KPMG Nigeria. It started life as the MyPomodoro productivity app and now ships a "Performance Command Center" as the main experience.

Contents:

- `apps/web` - Next.js static-export app (React 19, Zustand, Tailwind 4, Vitest). The command center, timer, tasks, and session history live here.
- `packages/utils` - shared utilities.
- `kbac_academy_general_test_study_guide.html` - standalone, self-contained study guide for the KPMG Academy General Test, served from the app as `kbac_study_guide.html`. Vanilla HTML/CSS/JS, no build step.
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

- State lives in Zustand stores under `apps/web/src/store`.
  - `planningStore.ts` owns the year plan, monthly plans, weekly plan, daily plans, tasks, evidence ledger, automation pipeline, study tracks, and engagement log. It persists to `localStorage` under `kpmg-performance-command-center-v1`. Snapshots are versioned (`version: 2`): `readSnapshot` migrates v1 Academy-era data forward (study topics become the archived KBAC track, the Academy goal is marked complete, untouched Academy defaults are replaced with engagement-era defaults) and rejects unknown versions.
  - `timerStore.ts` is clock-based: a running session stores `endAt` and every tick recomputes the remaining seconds from `Date.now()`. Never reintroduce counter-only countdowns; browsers throttle hidden tabs and the timer must stay truthful. `Timer.tsx` resyncs on `visibilitychange`, `focus`, and `pageshow`, and sessions that finish while hidden are completed on the next tick. Persisted state includes `isRunning` and `endAt` so a reload recovers correctly.
- `PerformanceCommandCenter.tsx` is the app shell. Tabs: Command, Horizons, Study, Engagements, Rating evidence, Automation, Roadmap.
- Styling: Tailwind utilities plus the `command-*` class system in `apps/web/src/app/globals.css`.
- The study guide is a single HTML file with no dependencies. Keep it that way unless there is a strong reason.

## Data safety rules

- Never add client names, client data, working papers, screenshots, credentials, or confidential material to this repository, the app, or the study guide.
- Planning entries are generic by design: engagement aliases and role titles only.

## Working agreements

- Keep changes consistent with existing structure, naming, and style.
- Run `pnpm typecheck` and the relevant Vitest files before finishing a change.
- User-facing copy style: direct, concise, practical, and free of em-dashes.
