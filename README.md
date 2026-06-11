# My Pomodoro

A neon-themed Pomodoro productivity timer with task management, session history, and a desktop Tauri app.

🌐 **Live app:** https://braingenius2.github.io/MyPomodoro/

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

The web app is deployed to GitHub Pages via GitHub Actions. Every push to `main` triggers an automatic build and deploy.

## Desktop App

```bash
pnpm tauri:dev     # Tauri dev mode
pnpm tauri:build   # Build desktop installer
```
