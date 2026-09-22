# KPMG Focus OS

A personal performance system for a Technology Risk Analyst at KPMG Nigeria: plan from the year down to the next physical action, run focus sessions, keep an evidence ledger for performance reviews, and study for the Academy.

## What is inside

- **Performance Command Center** (`apps/web`) - the main app.
  - **Command**: daily win condition (one delivery, one capability, one leverage result), task runway with pomodoro estimates, focus timer, weekly control room, and a 10-minute closeout with a "rehash tomorrow" action.
  - **Horizons**: the full cascade. Yearly north star and quarterly milestones, monthly theme and outcomes, then the weekly and daily layers pulled from the command view.
  - **KBAC sprint**: Academy study modules, recall prompts, and a self-test.
  - **Rating evidence**: a dated ledger of contributions mapped to performance dimensions.
  - **Automation**: a responsible pipeline for capturing safe automation opportunities.
  - **Roadmap**: goals, the 12-month route, and local backup export/import.
- **KBAC Elite Study System** (`kbac_academy_general_test_study_guide.html`) - a standalone interactive study guide for the Academy General Test. 14 modules, a journal entry drill, 30 flashcards, a 42-question bank, a timed mock exam, and a printable cheat sheet. Open it directly in a browser; progress saves to `localStorage`.
- **Pomodoro engine** - the original timer, tasks, and session history that power focus blocks inside the command center.

## Tech stack

- Next.js (static export) + React 19
- Tailwind CSS 4
- Zustand 5 with localStorage persistence
- Vitest + Testing Library
- Tauri 2 (optional desktop packaging)
- pnpm workspaces

## Getting started

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # vitest
pnpm typecheck  # tsc --noEmit
pnpm build      # static export to apps/web/out/
```

## Data and privacy

Everything is stored in the browser's `localStorage` on the device you use. Nothing is sent anywhere. Export a backup from the Roadmap tab regularly.

Do not enter client names, client data, working papers, screenshots, credentials, or confidential KPMG material. Use generic engagement aliases and role titles only.

## Deployment

The web app deploys to GitHub Pages via GitHub Actions. Every push to `main` builds the static export and publishes it.

## Desktop app

```bash
pnpm tauri:dev     # Tauri dev mode
pnpm tauri:build   # Build desktop installer
```
