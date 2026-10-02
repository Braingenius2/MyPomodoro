# KPMG Focus OS

A personal performance system for a Technology Risk analyst: plan from the year down to the next physical action, run focus sessions that survive busy tabs, track engagement work, keep an evidence ledger for performance reviews, and study for what comes next.

## What is inside

- **Performance Command Center** (`apps/web`) - the main app.
  - **Command**: daily win condition (one delivery, one capability, one leverage result), task runway with pomodoro estimates, focus timer, weekly control room, and a 10-minute closeout with a "rehash tomorrow" action.
  - **Horizons**: the full cascade. Yearly north star and quarterly milestones, monthly theme and outcomes, then the weekly and daily layers.
  - **Study**: generic learning tracks. ITGC and engagement readiness (active), Modern Technology Assurance (active), API, Data and Intelligent Workflows (planned), CISA domains (planned), and the passed KBAC Academy material (archived, with the full interactive guide still available).
  - **Engagements**: an alias-only log of workstreams, roles, review notes received, lessons learned, and the requests you are chasing.
  - **Rating evidence**: a dated ledger of contributions mapped to performance dimensions.
  - **Solutions**: a responsible pipeline for turning real assurance pain points into approved, validated improvements.
  - **Roadmap**: goals, the 12-month route, practice map, and local backup export/import.
- **Technology Assurance Field Guide** (`apps/web/public/technology_assurance_field_guide.html`) - a standalone reference for the broader Advisory Tech Risk offer: API assurance control map, ICFR and revenue assurance context, a four-week field plan, and hard guardrails. Linked from the Modern Technology Assurance track.
- **KBAC Elite Study System** (`kbac_academy_general_test_study_guide.html`, served as `kbac_study_guide.html`) - the archived interactive study guide for the Academy General Test: 16 modules, a journal entry drill, two solved class exercises, 58 flashcards, a 98-question bank, a paced mock exam, and a printable cheat sheet.
- **Pomodoro engine** - the timer, tasks, and session history that power focus blocks.

## Timer behaviour (important)

The timer is **clock-based**: starting a session stores an absolute deadline, and every tick recomputes the remaining time from the wall clock. Browsers throttle timers in hidden tabs, and Edge can freeze or discard sleeping tabs, but the countdown now snaps to the truth whenever a tick runs or the tab regains focus. Sessions that finish while the tab was hidden are logged on return. The same fix survives a page reload.

If you want the exact-second alarm while the tab is hidden, run the desktop build with Tauri (no browser throttling) or add the site to Edge's never-sleep list under Settings, System and performance.

## Tech stack

- Next.js (static export) + React 19
- Tailwind CSS 4
- Zustand 5 with localStorage persistence (versioned snapshots with migration)
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

Everything is stored in the browser's `localStorage` on the device you use. Nothing is sent anywhere. Export a backup from the Roadmap tab regularly. Stored snapshots are versioned; older data migrates forward automatically (for example, the Academy-era study list becomes the archived KBAC track and its goal is marked complete).

Do not enter client names, client data, working papers, screenshots, credentials, or confidential material. Use generic engagement aliases and role titles only.

## Deployment

The web app deploys to GitHub Pages via GitHub Actions. Every push to `main` builds the static export and publishes it.

## Desktop app

```bash
pnpm tauri:dev     # Tauri dev mode
pnpm tauri:build   # Build desktop installer
```
