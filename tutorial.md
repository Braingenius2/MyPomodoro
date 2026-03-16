# Build a Modern Pomodoro App with AI

A practical guide to frontend development using this project as a real-world example. Learn how to leverage AI coding tools effectively while understanding the fundamentals.

---

## Introduction

In this tutorial, you'll learn frontend development by building a real Pomodoro timer application. But here's what makes this different: instead of just copying code, you'll learn *how* modern developers actually work with AI assistance—and how to debug, tweak, and own the code when AI gets it wrong.

### What We're Building

A productivity timer with:
- Focus/break sessions (Pomodoro technique)
- Task management
- Session history tracking
- Desktop app packaging (via Tauri)
- A distinctive neon cyberpunk aesthetic

### The Modern AI-First Workflow

The workflow you'll learn:
1. **Describe** what you want to build (in English, not code)
2. **AI generates** the initial implementation
3. **Review** the code—understand what it does
4. **Iterate**—tell AI what's wrong or needs changing
5. **Own it**—make manual tweaks when needed

> **Key Skill**: The ability to review and tweak AI code is what separates developers who use AI effectively from those who struggle with it.

---

## Project Architecture

Before writing code, understand the structure.

### Monorepo with Turbo

```
my-pomodoro/
├── apps/
│   └── web/              # Next.js frontend
│       ├── src/
│       │   ├── app/      # App Router pages
│       │   ├── components/
│       │   ├── store/   # Zustand stores
│       │   └── lib/     # Utilities
│       └── src-tauri/   # Rust desktop app
├── packages/
│   └── utils/           # Shared utilities
├── turbo.json           # Turborepo config
└── package.json
```

**Why this structure?** Turbo only rebuilds what's changed. If you edit `apps/web`, it won't rebuild `packages/utils`.

### Next.js App Router

In `apps/web/src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>...</header>
      <main>...</main>
    </div>
  );
}
```

This is a **Server Component** by default. It renders on the server (fast initial load) but can't use React hooks directly.

### The "use client" Directive

In `apps/web/src/components/Timer.tsx`:

```tsx
"use client";  // ← This line makes it a Client Component

import { useEffect, useState } from "react";

export function Timer() {
  const [mounted, setMounted] = useState(false);
  // ...
}
```

**Rule of thumb**: Add `"use client"` when you need:
- React hooks (`useState`, `useEffect`, `useRef`)
- Browser APIs (localStorage, notifications)
- Event handlers (onClick, onChange)

---

## Tailwind CSS Mastery

This project uses a custom Tailwind theme with neon colors. Let's break it down.

### Custom Color Palette

In `apps/web/tailwind.config.ts`:

```ts
theme: {
  extend: {
    colors: {
      'dark-bg': '#0a0a12',
      'dark-panel': '#12121f',
      'neon-cyan': '#00f5ff',
      'neon-pink': '#ff00aa',
      'neon-yellow': '#ffdd00',
      'neon-green': '#00ff88',
      'neon-red': '#ff4444',
      'text-primary': '#e0e0ff',
      'text-dim': '#6a6a8a',
    },
  },
}
```

These become utility classes: `bg-neon-cyan`, `text-neon-pink`, etc.

### Responsive Design

```tsx
// From page.tsx
<div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
  <div className="xl:col-span-8">Timer</div>
  <div className="xl:col-span-4">TaskList</div>
</div>
```

- `grid-cols-1` → single column on mobile
- `xl:grid-cols-12` → 12-column grid on extra-large screens
- `xl:col-span-8` → spans 8 columns on XL screens

### Glow Effects & Gradients

```tsx
// From Timer.tsx
<div style={{ 
  textShadow: `0 0 30px ${progressColor}`,
  filter: `drop-shadow(0 0 8px ${progressColor})`,
}}>
```

Tailwind's arbitrary values let you use any CSS:

```tsx
className="shadow-[0_0_20px_rgba(0,245,255,0.4)]"
className="backdrop-blur-xl"
className="bg-gradient-to-b from-dark-panel to-dark-surface"
```

### AI Prompt for Tailwind

**Instead of**: "Make it look good"
**Try**: "Create a dark panel with a subtle cyan glow border and glassmorphism effect using Tailwind"

The more specific you are about visual requirements, the better AI can help.

---

## State Management with Zustand

Zustand is simpler than Redux and cleaner than React Context for this use case.

### The Timer Store

In `apps/web/src/store/timerStore.ts`:

```ts
interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  settings: Settings;
  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
}
```

### Creating the Store

```ts
export const useTimerStore = create<TimerState>((set, get) => ({
  mode: "work",
  timeLeft: 25 * 60,
  isRunning: false,
  sessionsCompleted: 0,
  settings: DEFAULT_SETTINGS,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),
  
  tick: () => {
    const { timeLeft } = get();
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      // Handle timer completion
    }
  },
}));
```

### Using the Store in Components

```ts
// Optimized selector - only re-renders when timeLeft changes
const timeLeft = useTimerStore((s) => s.timeLeft);
const isRunning = useTimerStore((s) => s.isRunning);

// Call actions directly
const start = useTimerStore((s) => s.start);
```

**Why selectors matter**: Without selectors, any store change re-renders the component. With selectors, only the specific values you need trigger re-renders.

### Persistence (localStorage)

```ts
// Auto-save on every state change
useTimerStore.subscribe((state) => {
  if (state.initialized) {
    localStorage.setItem("pomodoro-timer", JSON.stringify({
      mode: state.mode,
      timeLeft: state.timeLeft,
      settings: state.settings,
    }));
  }
});
```

### AI Prompt for Zustand

**Try**: "Create a Zustand store for a todo list with add, remove, and toggle-complete actions, persisted to localStorage"

---

## Component Architecture

Building reusable UI components is a key skill.

### The Button Component

In `apps/web/src/components/ui/Button.tsx`:

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  colorScheme?: "cyan" | "pink" | "yellow" | "green";
  size?: "sm" | "md" | "lg";
}
```

**Variants** change visual style:
- `primary`: Filled background
- `secondary`: Outlined
- `ghost`: Text only

**Color schemes** apply different neon colors to the same variant.

### forwardRef for DOM Access

```ts
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, colorScheme, children, ...props }, ref) => {
    return (
      <button ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
```

**Why forwardRef?** Sometimes you need direct DOM access—focusing an input, measuring size, or integrating with non-React libraries.

### The cn() Utility

In `apps/web/src/lib/utils.ts`:

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This merges Tailwind classes intelligently:

```ts
className={cn(
  "base-styles",
  variant === "primary" && "primary-styles",
  className // allows overrides
)}
```

### AI Prompt for Components

**Try**: "Create a Card component with variants (default, glass, outlined), optional glow effect, and support for dark/light themes"

---

## React + TypeScript Patterns

### useEffect Timing

```ts
useEffect(() => {
  if (!isRunning) return;
  
  const interval = setInterval(() => {
    useTimerStore.getState().tick();
  }, 1000);
  
  return () => clearInterval(interval);  // ← Always clean up!
}, [isRunning]);
```

**Common mistake**: Forgetting to return cleanup function → memory leaks, double intervals.

### useRef for Imperative Control

```ts
const audioRef = useRef<HTMLAudioElement | null>(null);

// Play audio
audioRef.current?.play();

// Pause audio
audioRef.current?.pause();
audioRef.current.currentTime = 0;
```

`useRef` doesn't trigger re-renders—perfect for things that change without visual updates.

### Hydration-Safe Components

```ts
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return <LoadingSkeleton />;
```

**Why needed**: Next.js renders on the server first. `localStorage` and `window` don't exist on the server. This prevents hydration mismatches.

### TypeScript Types

```ts
export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}
```

**Tip**: Let AI generate types, then review them. You often know the shape of your data even if you don't want to write every line.

---

## AI Workflows That Work

Here's how to use AI effectively as an intermediate developer.

### Writing Effective Prompts

**Bad**: "Add a settings panel"
**Good**: "Add a settings panel with sliders for work duration (1-60 min), break durations, and toggle switches for auto-start options. Use the existing Panel and RangeInput components."

**Bad**: "Fix the bug"
**Good**: "The timer resets unexpectedly when I change modes while running. The expected behavior is to either warn the user or reset the new mode's timer. Look at the setMode function in timerStore.ts"

### Code Review is Your Superpower

AI generates code, but you must verify it:

1. **Does it match the requirements?** Test the functionality
2. **Does it follow existing patterns?** Check similar code in the project
3. **Are there edge cases?** What happens with empty data? Invalid input?
4. **Is it accessible?** Keyboard navigation, screen readers

### When AI Gets It Wrong

AI often:
- Misses edge cases
- Uses outdated patterns
- Overcomplicates simple tasks

**Example of manual fix**:

AI generated:
```ts
const timeString = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
```

Better (used in this project):
```ts
const timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
```

Know enough to make these judgment calls.

### Prompt Debugging

When AI code doesn't work:

1. **Copy the error message exactly**
2. **Tell AI what you expected vs what happened**
3. **Ask specifically**: "What in this code could cause [specific error]?"

---

## Testing with Vitest

Tests verify your code works and prevent regressions.

### Component Test

In `apps/web/src/components/Timer.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { Timer } from "./Timer";

test("displays initial time", () => {
  render(<Timer />);
  expect(screen.getByText("25:00")).toBeInTheDocument();
});
```

### Store Test

In `apps/web/src/store/timerStore.test.ts`:

```tsx
import { useTimerStore } from "./timerStore";

test("tick decrements timeLeft", () => {
  useTimerStore.setState({ timeLeft: 60, isRunning: true });
  useTimerStore.getState().tick();
  expect(useTimerStore.getState().timeLeft).toBe(59);
});
```

### Running Tests

```bash
pnpm test
# or with Vitest UI
pnpm test --ui
```

---

## Running the App

### Development

```bash
# Start all services
pnpm dev

# Start just the web app
cd apps/web && pnpm dev
```

### Build

```bash
pnpm build
```

### Desktop App (Tauri)

```bash
pnpm tauri:dev    # Development
pnpm tauri:build  # Production build
```

---

## Next Steps

Now that you've walked through this project:

1. **Add a feature**: Use AI to add a daily statistics view
2. **Improve styling**: Customize the theme with your own colors
3. **Add tests**: Test the TaskList and SettingsPanel components
4. **Deploy**: Push to Vercel or Netlify (already configured for static export)

### Recommended Learning Path

1. **Week 1**: Recreate the Timer component from scratch using AI assistance
2. **Week 2**: Add a new feature (e.g., sound selection) following the existing patterns
3. **Week 3**: Write tests for the store logic
4. **Week 4**: Customize the styling and theme

---

## Quick Reference

### Tailwind Cheatsheet
- `flex justify-center items-center` → center content
- `gap-4` → spacing between items
- `p-4` / `px-4 py-2` → padding
- `m-4` / `mx-auto` → margin
- `w-full max-w-xl` → width with max constraint
- `text-sm md:text-lg` → responsive text sizes

### Zustand Pattern
```ts
const value = useStore(s => s.property);
const action = useStore(s => s.action);
```

### Common Errors
- `"use client" missing` → Client Component needs the directive
- `localStorage not defined` → Wrap in `typeof window !== "undefined"`
- `Hydration mismatch` → Use mounted state
- `Too many re-renders` → Check dependency arrays in useEffect

---

*Built with Next.js, Tailwind CSS, Zustand, and Tauri*
