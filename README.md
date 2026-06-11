# My Pomodoro

A neon-themed Pomodoro productivity timer with task management, session history, and a desktop Tauri app.

## Tech Stack

- **Framework:** Next.js (static export) + React 19
- **Styling:** Tailwind CSS 4
- **State:** Zustand 5
- **Testing:** Vitest + Testing Library
- **Desktop:** Tauri 2 (Rust)
- **Monorepo:** pnpm workspaces

## Getting Started

```bash
pnpm install
pnpm dev        # Web dev server at localhost:3000
pnpm test       # Run tests
pnpm build      # Static export to apps/web/out/
pnpm typecheck  # TypeScript check
pnpm lint       # ESLint
```

## Project Structure

```
apps/web/          # Web application (Next.js)
packages/utils/    # Shared utilities
```

## Deployment

The web app is deployed to GitHub Pages via GitHub Actions. On every push to `main`, the app is built as a static export and published to the `gh-pages` branch.

## Desktop App

```bash
pnpm tauri:dev     # Tauri dev mode
pnpm tauri:build   # Build desktop installer
```
