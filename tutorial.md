# Learn Frontend Development With My Pomodoro

A beginner-first, zero-to-hero guide for learning frontend development by studying and extending this real project.

This tutorial is written for someone who may be starting from almost zero. If frontend has ever felt confusing, overcomplicated, or "not intuitive", that does not mean you are bad at it. It usually means too many ideas were introduced too fast and without a clear mental model.

This guide fixes that.

We will use this project as a training ground and move in stages:

1. Learn what the browser is doing.
2. Learn how React organizes UI.
3. Learn how this repo is structured.
4. Learn how state flows through the app.
5. Learn how to steer AI tools and coding agents productively.
6. Learn how to add features safely.
7. Learn how to test, debug, and think like a solid frontend developer.

By the end, you should not just be able to "follow along". You should be able to read the code, change it, explain it, steer AI with it, and build beyond the first draft with confidence.

---

## Who This Is For

This tutorial is for you if:

- You are new to frontend development.
- You understand a little HTML/CSS/JavaScript, but not enough to feel confident.
- React, Next.js, TypeScript, and state management feel like a lot.
- You want a project-based path instead of disconnected theory.

This tutorial is also useful if you are early intermediate and want to strengthen fundamentals properly.

---

## Read This Before Anything Else

Frontend development feels hard for good reasons:

- The browser has rules.
- CSS has rules.
- JavaScript has rules.
- React adds another layer.
- Frameworks like Next.js add another layer.
- Tooling adds another layer.

That is a lot.

So here is the most important mindset for this tutorial:

You do not need to understand everything at once.

At each stage, there are things to care about now and things to postpone.

### What to Worry About First

- Can you run the project?
- Can you find the file responsible for a piece of UI?
- Can you change text, spacing, colors, or layout?
- Can you explain where data lives?
- Can you explain what happens when a user clicks a button?
- Can you follow state from store to component to screen?
- Can you tell whether AI-generated code actually matches the goal?

### What Not to Worry About First

- Memorizing every React hook
- Being "clever"
- Performance micro-optimizations
- Fancy architecture names
- SSR internals
- Whether your code looks senior enough
- Building everything from memory
- Competing with AI on raw typing speed

At the beginning, clarity beats cleverness every time.

### Frontend In The AI Era

AI-assisted coding is not a side topic anymore. It is part of the job now.

That is good news for beginners, because it means you can move faster than beginners used to. You can ask for explanations, draft features, generate tests, compare approaches, and unblock yourself much more quickly than before.

But there is a catch:

AI multiplies your speed, not your judgment.

If your understanding is weak, AI can help you make mistakes faster. If your understanding is growing, AI becomes a serious force multiplier.

So the goal of this tutorial is not:

- "learn frontend without AI"
- and not "let AI do everything"

The goal is:

- learn enough frontend to steer AI well
- review what it gives you
- catch what it misses
- and extend beyond its first draft when needed

You are not trying to beat AI at typing code line by line.

You are trying to become the person who can direct it well.

---

## What Frontend Actually Is

If we strip away the jargon, a frontend app is just this:

- HTML describes what exists on the page.
- CSS describes how it looks.
- JavaScript describes how it behaves.
- React helps you generate UI from state.
- Next.js helps organize the app and ship it cleanly.

Here is the mental model you should keep repeating:

`state -> UI`

If the state changes, the UI updates.

That single idea explains a huge amount of React.

### The Three Core Web Layers

#### 1. HTML

HTML gives structure.

Examples:

- headings
- buttons
- forms
- lists
- sections

If you see JSX in React, it is mostly "HTML inside JavaScript".

#### 2. CSS

CSS controls appearance:

- colors
- spacing
- layout
- fonts
- borders
- responsiveness

In this repo, a lot of styling is done with Tailwind utility classes plus theme tokens in `apps/web/src/app/globals.css`.

#### 3. JavaScript

JavaScript handles behavior:

- clicking buttons
- updating timers
- showing and hiding UI
- saving data
- calculating progress

React uses JavaScript to describe UI in a dynamic way.

---

## The Stack In This Project, In Plain English

Here is what this project uses and why it matters.

| Tool | What it does | What a beginner should know |
| --- | --- | --- |
| `pnpm` | Installs packages and runs scripts | Think of it as the project command runner |
| `Next.js` | React framework | Organizes pages, app shell, builds, and routing |
| `React` | UI library | Components render UI from state |
| `TypeScript` | Types for JavaScript | Helps catch mistakes earlier |
| `Tailwind CSS` | Utility-first styling | You compose classes instead of writing lots of separate CSS selectors |
| `Zustand` | State management | Stores shared app state outside individual components |
| `Vitest` + Testing Library | Testing | Verifies store logic and UI behavior |
| `Tauri` | Desktop packaging | Optional for now; do not worry about it at the start |

### What Matters Most Right Now

If you are starting from zero, focus on these in order:

1. React components
2. Props and state
3. Event handling
4. Shared state with Zustand
5. Effects and browser APIs
6. Testing

Everything else can be layered on later.

---

## The AI-Native Frontend Mindset

A beginner today can operate much closer to the frontier than beginners could a few years ago.

That part is real.

Modern AI tools and coding agents can help you:

- scaffold components
- draft styles
- explain unfamiliar files
- suggest tests
- refactor repetitive code
- search a codebase faster
- turn product ideas into first drafts

That is a massive productivity multiplier.

But frontend still needs a human owner.

AI is good at producing plausible code. A frontend developer must decide whether the code is:

- correct
- clear
- accessible
- aligned with the actual UX goal
- consistent with the codebase
- safe to keep

### What AI Is Good At

- turning plain-English feature requests into a first pass
- generating repetitive UI variants
- suggesting boilerplate for stores, forms, and tests
- summarizing files and patterns
- proposing multiple approaches quickly

### What You Still Need To Know

- how the UI is supposed to behave
- where state should live
- what file owns a feature
- how to run the app and verify changes
- how to read errors and trace bugs
- how to recognize when the AI overcomplicated something
- how to polish UX beyond a generic first draft

### The Modern Developer Loop

This is a practical loop for working with AI and agents on frontend tasks:

1. Define the outcome in plain English.
2. Find the files that likely own the behavior.
3. Ask for a small, scoped change instead of a giant rewrite.
4. Review the generated code line by line.
5. Run the app and test the behavior yourself.
6. Run tests or add tests.
7. Tweak, simplify, or redesign beyond the AI draft if needed.

That loop is more important than typing speed.

### The Core Human Advantage

The strongest frontend developers in the AI era are not the ones who type the most code manually.

They are the ones who can:

- frame the problem well
- spot mismatches quickly
- combine product sense with technical judgment
- and refine rough AI output into something genuinely good

That is the version of "frontend intuition" this tutorial is trying to build.

---

## Your First Goal: Run The App

From the repo root:

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

You should see:

- the app title
- the main timer
- the task list
- settings
- session history

If you can run the app locally, you already crossed an important beginner milestone: you have a working environment and a real app to explore.

### Beginner Win

Before reading more, make one tiny change:

- change the heading text in `apps/web/src/app/page.tsx`
- save the file
- watch the browser update

That moment matters. It teaches you that code is not abstract anymore. You can touch the app and see cause and effect.

---

## The Repo Tour: Learn The Project In The Right Order

Do not read this codebase randomly. Read it in this order:

1. `apps/web/src/app/layout.tsx`
2. `apps/web/src/app/page.tsx`
3. `apps/web/src/components/ui/Button.tsx`
4. `apps/web/src/components/ui/Panel.tsx`
5. `apps/web/src/components/TaskList.tsx`
6. `apps/web/src/store/taskStore.ts`
7. `apps/web/src/components/Timer.tsx`
8. `apps/web/src/store/timerStore.ts`
9. `apps/web/src/store/sessionStore.ts`
10. `apps/web/src/components/SessionHistory.tsx`
11. the test files in `apps/web/src/**/*.test.*`

Why this order?

- `layout.tsx` shows the app shell.
- `page.tsx` shows the top-level page composition.
- the UI files show reusable building blocks.
- `TaskList` is easier to understand than the timer.
- the timer introduces more advanced ideas like effects, persistence, and browser APIs.
- tests show how the logic is supposed to behave.

That is how you reduce overwhelm: not by reading less, but by reading in the right sequence.

---

## Stage 1: Understand The App Shell

Start with `apps/web/src/app/layout.tsx`.

This file wraps the app with the global HTML structure:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-dark-bg font-mono text-text-primary antialiased">
        <main>{children}</main>
      </body>
    </html>
  );
}
```

What this teaches:

- React components are functions.
- Components return JSX.
- `children` means "whatever content gets placed inside this layout".
- global classes can set the default look and feel.

Then open `apps/web/src/app/page.tsx`.

That file composes the main page:

```tsx
<main className="flex-1 max-w-[1400px] mx-auto px-4 py-8 w-full">
  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
    <div className="xl:col-span-8 flex justify-center w-full">
      <Timer />
    </div>
    <div className="xl:col-span-4 ...">
      <TaskList />
    </div>
  </div>
</main>
```

This is a powerful beginner lesson:

- big UIs are assembled from smaller components
- layout is separate from logic
- the page does not manage the timer itself; it delegates work to child components

### Worry About

- How components are nested
- Which component is responsible for which part of the screen
- How layout classes change on different screen sizes

### Do Not Worry Yet

- Why `page.tsx` is a Server Component by default
- deep Next.js rendering internals
- advanced routing

---

## Stage 2: Learn Styling Without Drowning

Frontend students often get stuck because styling feels magical. It is not magical. It is just a pile of small decisions.

This project uses two main styling layers:

1. global design tokens in `apps/web/src/app/globals.css`
2. utility classes written directly in JSX

### Global Theme Tokens

Open `apps/web/src/app/globals.css`.

You will see theme values like:

```css
@theme {
  --color-dark-bg: #0a0a12;
  --color-neon-cyan: #00f5ff;
  --color-neon-pink: #ff00aa;
  --color-neon-green: #00ff88;
  --color-text-primary: #e0e0ff;
}
```

These are reusable design values.

Think of them as your design vocabulary.

If you want to change the personality of the whole app, this file is one of the first places to look.

### Utility Classes In JSX

Now look at examples like:

```tsx
className="text-2xl sm:text-3xl font-black uppercase tracking-[0.2em] text-text-primary"
```

You do not need to memorize every utility class. Learn the categories:

- layout: `flex`, `grid`, `items-center`, `justify-center`
- spacing: `p-4`, `px-4`, `mt-8`, `gap-3`
- size: `w-full`, `max-w-xl`, `min-h-screen`
- color: `bg-dark-bg`, `text-neon-cyan`
- borders and effects: `border`, `rounded-xl`, `shadow-[...]`
- typography: `text-sm`, `font-black`, `uppercase`, `tracking-wider`
- responsive prefixes: `sm:`, `lg:`, `xl:`

If you learn those buckets, Tailwind becomes much less scary.

### Reusable Styling Components

Read these next:

- `apps/web/src/components/ui/Panel.tsx`
- `apps/web/src/components/ui/Button.tsx`

These files teach a very important pattern:

Build a reusable visual base once, then reuse it everywhere.

For example, `Panel` centralizes shared surface styling. `Button` centralizes variants, sizes, colors, and focus states.

That is real frontend maturity: not copying styles endlessly.

### Worry About

- Can you read a `className` and roughly tell what it affects?
- Can you identify repeated styling and put it in a reusable component?
- Can you change colors and spacing without breaking layout?

### Do Not Worry Yet

- memorizing every Tailwind class
- whether Tailwind is "better" than plain CSS
- animation perfection
- pixel-perfect design systems

### Practice

Try these changes:

1. Change the neon accent colors in `globals.css`.
2. Make the header text bigger in `page.tsx`.
3. Change the `Panel` border radius and see how the whole app personality changes.
4. Add extra padding to the `TaskList` panel.

---

## Stage 3: Understand React Components The Simple Way

A React component is usually just:

- a function
- that receives inputs called props
- and returns JSX

That is it.

### Example: A Reusable Button

In `apps/web/src/components/ui/Button.tsx`, the component accepts props like:

- `variant`
- `colorScheme`
- `size`
- all normal button HTML props

This teaches a core React idea:

One component can be reused in many ways by changing props.

### Example: A Feature Component

In `apps/web/src/components/TaskList.tsx`, the component is more than just styling. It has:

- local input state
- event handlers
- store access
- conditional rendering
- list rendering

This is where frontend starts feeling like "real app development".

### The React Questions You Should Always Ask

When reading a component, ask:

1. What does this component render?
2. What data does it need?
3. Where does that data come from?
4. What user actions can happen here?
5. What changes when the action happens?

If you can answer those five questions, you can read a lot of React already.

### Worry About

- props
- local state
- event handlers
- conditional rendering
- list rendering with `map`

### Do Not Worry Yet

- advanced composition jargon
- custom render props
- React internals
- clever abstractions

---

## Stage 4: Local State vs Shared State

This is one of the biggest beginner breakthroughs.

Not all state should live in the same place.

### Local State

Local state is state only one component cares about.

Example from `TaskList.tsx`:

```tsx
const [newTaskTitle, setNewTaskTitle] = useState("");
```

This state is only for the input field while the user types.

Another example is `SettingsPanel.tsx`, which uses local state for temporary settings before the user clicks Save.

That is smart:

- the user can experiment
- the app does not commit changes immediately
- Cancel can restore the original settings

### Shared State

Shared state is state that multiple parts of the app care about.

Examples in this repo:

- timer state in `timerStore.ts`
- tasks in `taskStore.ts`
- completed sessions in `sessionStore.ts`

This state lives in Zustand stores so multiple components can read and update it.

### The Rule Of Thumb

Ask this:

"Who needs this state?"

- If only one component needs it, local state is often enough.
- If many components need it, shared state may be better.

That simple question saves a lot of confusion.

### Worry About

- owning state in the smallest reasonable place
- avoiding duplicate sources of truth
- understanding whether data is temporary or shared

### Do Not Worry Yet

- Redux debates
- global state purity
- whether every little value should be in a store

---

## Stage 5: Zustand Without The Mystery

Zustand is one of the friendliest state libraries for beginners because it is small and direct.

Open `apps/web/src/store/timerStore.ts`.

A Zustand store usually contains:

- state values
- actions that update state
- helper functions used by the actions

### The Timer Store Shape

This store owns:

- the current mode
- the remaining time
- whether the timer is running
- whether the alarm is active
- how many sessions were completed
- the app settings
- the last completion event

This is the heart of the timer feature.

### Read The Store In This Order

When reading a store, do not start in the middle. Read it in this order:

1. the types
2. the defaults
3. the helper functions
4. the store state
5. the actions
6. the initialization and persistence logic

That reading order makes big files much easier.

### A Key Action: `tick`

The `tick` action is where the timer advances by one second.

Its job is:

- if time remains, subtract one second
- if time is over, choose the next mode
- update session counts
- decide whether the next session auto-starts
- store a completion event for the UI to react to

This is a great example of business logic living in the store instead of the UI.

That is a strong pattern.

The component should not have to figure out all timer rules on every render. The store owns the rules. The component displays the results.

### Store Selectors

In `Timer.tsx` you will see patterns like:

```tsx
const timeLeft = useTimerStore((s) => s.timeLeft);
const isRunning = useTimerStore((s) => s.isRunning);
const start = useTimerStore((s) => s.start);
```

This means:

- read only the piece of state you need
- read only the action you need

This is both tidy and efficient.

### Worry About

- keeping business rules together
- using clear action names like `start`, `pause`, `reset`, `setMode`
- selecting only the data a component needs
- making defaults obvious

### Do Not Worry Yet

- state library wars
- advanced middleware
- over-engineering store structure

### Practice

Try these:

1. Change `DEFAULT_SETTINGS.workDuration` from `25` to `15`.
2. Change the maximum `workDuration` limit.
3. Add a new setting and follow it through the store and UI.

If you can do that, you are genuinely learning state management.

---

## Stage 6: Learn `useEffect` And Browser-Only Code The Practical Way

`useEffect` is one of the places beginners get lost, so let us simplify it.

Use an effect when your component needs to do something after render, such as:

- start an interval
- sync with `localStorage`
- call a browser API
- initialize client-side data

### Example: Start The Timer Interval

In `apps/web/src/components/Timer.tsx`:

```tsx
useEffect(() => {
  if (!isRunning) return;

  const interval = setInterval(() => {
    useTimerStore.getState().tick();
  }, 1000);

  return () => clearInterval(interval);
}, [isRunning]);
```

What this teaches:

- effects can start side effects
- effects can clean up side effects
- cleanup matters

If you forget cleanup for intervals, you can accidentally create duplicate timers.

### Example: Initialize Client-Side State

Also in `Timer.tsx`:

```tsx
useEffect(() => {
  initTimer();
  initSessions();
}, [initTimer, initSessions]);
```

This loads persisted client data after the component mounts in the browser.

### Example: Browser APIs

`Timer.tsx` also interacts with:

- `Notification`
- `<audio>`
- `window`

That is why the file starts with:

```tsx
"use client";
```

That line tells Next.js this component needs browser capabilities.

### Beginner Rule For Effects

When you see an effect, ask:

1. What external thing is this syncing with?
2. What causes it to run?
3. Does it need cleanup?

That is usually enough.

### Worry About

- cleanup
- dependency awareness
- whether code needs the browser
- separating effect logic from render logic

### Do Not Worry Yet

- memorizing every effect rule from articles
- chasing "perfect" dependencies before you understand the feature
- deep React scheduling internals

---

## Stage 7: Persistence And Defensive Coding

A real app does not just render pretty UI. It protects user data and handles bad input safely.

This repo teaches that well.

### Local Storage

The stores use `localStorage` to persist data:

- timer state saves to `pomodoro-timer`
- tasks save to `pomodoro-tasks`
- sessions save to `pomodoro-sessions`

The pattern is:

1. initialize from storage
2. sanitize if necessary
3. subscribe to changes
4. save back to storage

### Sanitizing Saved Data

One excellent beginner lesson in `timerStore.ts` is that persisted data is not trusted blindly.

Functions like:

- `sanitizeSettings`
- `sanitizeMode`
- `sanitizeSessionsCompleted`

protect the app from weird or corrupted stored values.

That is an important professional habit:

Never assume external data is perfect, even if your own app created it.

### Worry About

- fallback defaults
- invalid data handling
- not crashing when storage is broken

### Do Not Worry Yet

- databases
- backend persistence
- enterprise caching strategy

---

## Stage 8: Learn The Task Feature Before The Timer Feature

If the timer logic feels heavy, that is normal. So use the task feature as your training ground first.

Open:

- `apps/web/src/components/TaskList.tsx`
- `apps/web/src/store/taskStore.ts`

This feature is a great beginner lab because it teaches:

- form submission
- controlled inputs
- trimming and validating input
- list rendering
- toggling completion
- deleting items
- clearing completed items
- loading and saving local data

### Controlled Input

This line is foundational:

```tsx
value={newTaskTitle}
onChange={(e) => setNewTaskTitle(e.target.value)}
```

That means React state is the source of truth for the input value.

This pattern appears everywhere in frontend work.

### Event Handlers

Example:

```tsx
const handleAdd = (e: React.FormEvent) => {
  e.preventDefault();
  if (newTaskTitle.trim()) {
    addTask(newTaskTitle.trim());
    setNewTaskTitle("");
  }
};
```

This is a very "real app" pattern:

- stop default browser form submission
- validate input
- update state
- reset the field

Learn this well. It transfers to forms everywhere.

### Practice

Before touching the timer, do these exercises:

1. Change the empty state text.
2. Add a character counter.
3. Prevent duplicate tasks.
4. Add a "remaining tasks" count.
5. Write a test for your new behavior.

If you can do those, you are already moving beyond beginner.

---

## Stage 9: Read The Timer Feature Like A Professional

The timer is the most instructive part of this app because it combines:

- shared state
- effects
- derived values
- audio
- notifications
- reusable UI
- persistence

Open `apps/web/src/components/Timer.tsx`.

Do not try to understand everything in one pass.

Read it in layers.

### Layer 1: What Does It Render?

You can quickly spot:

- mode tabs
- circular timer display
- running/paused/alarm status
- action buttons
- session count
- settings panel
- session history

That is just the screen structure.

### Layer 2: What Data Does It Read?

It reads from:

- `useTimerStore`
- `useSessionStore`

This teaches you that a component can depend on multiple shared state sources.

### Layer 3: What Side Effects Does It Run?

It:

- initializes stores
- starts the ticking interval
- reacts to completion events
- plays and stops audio
- requests notification permission

This is where the component becomes more than simple rendering.

### Layer 4: What Values Are Derived?

These values are calculated from other state:

- `totalDuration`
- `progress`
- `progressColor`
- `ready`

This is another crucial frontend concept:

Not everything needs to be stored.

If a value can be calculated from existing state, calculate it instead of storing it.

That avoids bugs and duplicate truth.

### Worry About

- reading components in passes
- separating state, effects, and rendering mentally
- recognizing derived values
- tracing one interaction end to end

### Do Not Worry Yet

- writing the timer from scratch on your first try
- understanding every single class immediately
- making the SVG ring from memory

---

## Stage 10: Patterns That Actually Matter

You mentioned resources like patterns.dev. That instinct is good. The key is to learn patterns as mental models, not as vocabulary to impress people.

This repo contains several patterns worth learning.

### 1. Composition

Small pieces build bigger pieces.

Examples:

- `page.tsx` composes `Timer` and `TaskList`
- `Timer.tsx` composes `Panel`, `Button`, `SettingsPanel`, and `SessionHistory`

This is one of the most important React patterns.

### 2. Single Source Of Truth

The timer rules live in `timerStore.ts`.

That means components do not invent their own alternate timer logic.

This reduces contradictions and bugs.

### 3. State Ownership

- temporary settings edits live in `SettingsPanel`
- actual saved settings live in `timerStore`

That is excellent state ownership.

### 4. Derived State

`progress` is calculated from `timeLeft` and `totalDuration`.

This is better than storing a separate `progress` value that can get out of sync.

### 5. Reusable UI Primitives

`Button`, `Panel`, and `RangeInput` are primitives.

Instead of restyling raw elements everywhere, the app builds reusable pieces.

### 6. Feature Separation

Different stores handle different concerns:

- timer
- tasks
- sessions

That keeps complexity from piling into one giant file.

### 7. Testable Logic

Timer rules live in a store where they can be tested directly.

That is much easier than burying all rules inside JSX.

### Pattern Lesson

The real lesson is not "memorize these pattern names".

The lesson is:

When something feels messy, ask whether a pattern can make ownership, reuse, or data flow clearer.

---

## Stage 11: Learn Testing Earlier Than Most People Do

Many beginners postpone testing because they think it is advanced. That is understandable, but it slows growth.

Testing helps you answer:

- What is this code supposed to do?
- Did I break anything?
- Can I refactor safely?

### Where To Start In This Repo

Read these first:

- `apps/web/src/store/timerStore.test.ts`
- `apps/web/src/components/Timer.test.tsx`
- `apps/web/src/components/TaskList.test.tsx`

### Why Store Tests Are Great For Beginners

Store tests are often easier to understand than UI tests because they focus on logic.

For example, `timerStore.test.ts` checks things like:

- formatting time correctly
- loading defaults
- handling corrupted storage
- transitioning from work to break
- auto-start behavior

That teaches you what the app promises to do.

### Why Component Tests Matter

Component tests verify user-facing behavior:

- can the user click Start?
- does the mode change?
- does the reset button work?
- does the loading state show?

This builds the habit of thinking in user outcomes, not just internal code.

### Commands You Should Know

From the repo root:

```bash
pnpm test
pnpm typecheck
pnpm lint
```

These are not "extra". They are part of real development.

### Worry About

- testing behavior, not implementation trivia
- writing tests for important logic branches
- using tests as reading guides

### Do Not Worry Yet

- perfect coverage
- every testing philosophy debate
- snapshot obsession

---

## Stage 12: Debugging Without Panic

Debugging is not a sign you failed. Debugging is the job.

Use this calm sequence:

1. Reproduce the issue on purpose.
2. State what you expected.
3. State what actually happened.
4. Find the file that owns the behavior.
5. Add logs or inspect state.
6. Change one thing at a time.
7. Run tests after the fix.

### Common Frontend Failure Categories

#### 1. Render Problems

Symptoms:

- text not showing
- wrong component appearing
- layout looks broken

Usually check:

- JSX
- conditional rendering
- class names
- missing data

#### 2. State Problems

Symptoms:

- button click does nothing
- timer shows wrong value
- settings do not stick

Usually check:

- which store owns the state
- whether the right action is called
- whether state is being overwritten elsewhere

#### 3. Effect Problems

Symptoms:

- duplicate intervals
- notification issues
- unexpected browser-only errors

Usually check:

- `useEffect`
- cleanup
- browser guards like `typeof window !== "undefined"`

#### 4. Persistence Problems

Symptoms:

- stale old data
- weird values on refresh
- crashes after loading saved data

Usually check:

- local storage keys
- parsing
- sanitization logic

### Debugging Skill To Build

Do not ask only:

"What line is wrong?"

Also ask:

"What assumption was wrong?"

That question levels you up much faster.

---

## Stage 13: TypeScript Without Fear

TypeScript can feel like extra noise at first, but it becomes helpful once you see its job:

It tells you the shape of data and catches mismatches early.

Examples from this repo:

- `TimerMode`
- `Settings`
- `CompletionEvent`
- `Task`
- `Session`

These types answer practical questions:

- what values are allowed?
- what fields exist?
- which functions expect what inputs?

### Beginner Advice For TypeScript

At first, focus on:

- reading interfaces and type aliases
- understanding function parameter types
- understanding return types when they are obvious

You do not need to master advanced generics to become productive in this repo.

### Worry About

- data shapes
- union types like `"work" | "shortBreak" | "longBreak"`
- catching mistakes early

### Do Not Worry Yet

- advanced generic wizardry
- type-level tricks
- making every type maximally fancy

Good types should make code clearer, not scarier.

---

## Stage 14: How To Work With AI And Agents Without Becoming Dependent On Them

The old version of this tutorial leaned too hard into an AI-first workflow for where a beginner actually is.

The fix is not to ignore AI. The fix is to use it in the right order and with the right responsibilities.

Here is the healthier order:

1. Understand the feature in plain English.
2. Find the owning files.
3. Make one small manual change yourself.
4. Then use AI to accelerate, not replace understanding.

That approach matters because modern tools can help you operate far above beginner speed, but only if you can steer them.

### Good AI Uses For Beginners

- explain a file in simpler language
- suggest naming improvements
- draft a small feature
- generate tests for behavior you already understand
- compare two implementation options
- summarize a diff before you review it carefully

### Bad AI Uses For Beginners

- pasting giant code dumps without reading them
- asking AI to redesign the architecture before you understand the app
- accepting code you cannot explain
- letting an agent modify many files when you have not defined the scope

### What Coding Agents Are Especially Good At

Agents are useful when the task is concrete and bounded.

Good agent tasks:

- search the codebase for the files related to one feature
- draft a test file for a specific behavior
- implement a small, isolated UI change
- compare two refactor options
- trace where one piece of state is read and written

Bad agent tasks:

- "improve the whole app"
- "make the codebase better"
- "redesign everything"
- large rewrites without clear ownership or acceptance criteria

Treat agents like fast junior-to-mid collaborators: powerful, useful, and still in need of direction and review.

### Best Prompt Pattern

Use this structure:

1. What file or feature you are working on
2. What the app currently does
3. What you want to change
4. What constraints matter
5. What you already tried

Example:

> In `taskStore.ts`, prevent duplicate tasks that differ only in letter case. Keep the current API and add tests.

That is much better than:

> Fix tasks

### A Strong Prompt Includes

- the exact file or feature area
- the current behavior
- the desired behavior
- constraints you do not want broken
- what "done" looks like

The tighter the scope, the better the result.

### What You Must Still Own

Even in an AI-native workflow, the frontend developer still owns:

- product intent
- UX quality
- accessibility
- data flow correctness
- review of generated code
- testing and verification
- the final decision to keep, reject, or rewrite the output

This is the real dividing line in the AI era.

The tool can propose.
You must judge.

### How To Go Beyond AI Instead Of Stopping At AI

AI often gets you to a plausible first draft.

Real frontend work starts after that:

- simplify a solution the AI overcomplicated
- align the UI more closely with the actual user need
- remove code that does not fit the repo's patterns
- improve accessibility labels and keyboard behavior
- improve naming and structure
- combine several partial ideas into one better final version

That is how you create beyond the model instead of just accepting it.

### A Practical Review Checklist For AI Output

Before keeping AI-generated code, ask:

1. Does it actually solve the requested problem?
2. Does it fit the current codebase style and patterns?
3. Does the state live in the right place?
4. Did it introduce unnecessary complexity?
5. Did it preserve accessibility and user experience?
6. Can I explain this code to another person?
7. Did I run it and verify it myself?

### The Real Goal

Use AI and agents to speed up repetition, exploration, and drafting, but never to outsource reasoning, ownership, or taste.

---

## Stage 15: Zero-To-Hero Roadmap

This is a practical path through the project.

### Level 1: Absolute Beginner

Goal: become comfortable touching the UI.

Do these:

- change heading text in `page.tsx`
- change colors in `globals.css`
- change empty state text in `TaskList.tsx`
- change default timer lengths in `timerStore.ts`

Skills you gain:

- finding files
- saving and seeing results
- reading JSX
- reading utility classes

AI practice at this level:

Ask AI to explain a file in simpler terms, then confirm the explanation by making one tiny manual change yourself.

### Level 2: Beginner

Goal: understand component behavior.

Do these:

- add a remaining tasks count
- add helper text below the task input
- make the reset button show text as well as icon
- change the session history heading

Skills you gain:

- props
- conditionals
- lists
- event handling

AI practice at this level:

Use AI to propose two or three small UI changes, then choose one, implement it, and verify the result in the browser yourself.

### Level 3: Strong Beginner

Goal: understand state ownership and shared state.

Do these:

- add a setting for a custom alarm volume or mute toggle
- add a "hide completed tasks" option
- add a new timer preset
- write tests for each addition

Skills you gain:

- local state
- shared state
- store updates
- persistence
- testing

AI practice at this level:

Use AI or an agent to draft a small feature or a test, but review every changed file and be able to explain why each change is needed.

### Level 4: Early Intermediate

Goal: build whole features confidently.

Do these:

- add task priorities
- add session streaks
- add weekly stats
- add a confirmation before clearing all history

Skills you gain:

- feature design
- data modeling
- UI state design
- safer refactoring

AI practice at this level:

Delegate bounded tasks to agents, keep the scope narrow, and integrate their output like a reviewer rather than accepting it blindly.

### Level 5: Intermediate And Beyond

Goal: think like an owner, not just an implementer.

Do these:

- refactor repeated patterns into clearer primitives
- improve accessibility labels and keyboard flows
- make responsive behavior even better on small screens
- profile and optimize only after measuring a real issue

Skills you gain:

- architecture judgment
- accessibility awareness
- quality thinking
- performance discipline

AI practice at this level:

Use AI for speed, but rely on your own product sense, architectural judgment, and review standards to shape the final result.

---

## What To Worry About At Each Stage

Here is the simplest version.

### Early Stage

Worry about:

- reading code slowly
- tracing data flow
- making tiny safe changes
- understanding the difference between local and shared state
- checking whether AI output matches the actual requirement

Do not worry about:

- code elegance
- clever abstractions
- advanced Next.js topics

### Middle Stage

Worry about:

- where logic should live
- writing tests for important behavior
- naming things clearly
- handling invalid data safely
- giving AI and agents tighter scopes and clearer instructions

Do not worry about:

- building your own framework
- optimizing before there is a problem
- copying advanced patterns you do not need

### Later Stage

Worry about:

- maintainability
- accessibility
- extensibility
- confidence while refactoring
- refining AI drafts into stronger final solutions

Do not worry about:

- impressing people with complexity
- following trends blindly

---

## A Beginner-Friendly Reading Checklist

Whenever you open a new file, ask:

1. Is this a layout file, a UI file, a store, or a test?
2. What is this file responsible for?
3. What state does it read?
4. What state does it change?
5. What can the user do here?
6. What would break if this file disappeared?

That checklist will keep you grounded.

---

## Suggested Practice Schedule

If you want a structured progression, follow this:

### Week 1

- run the app
- tour the repo
- change text, colors, and spacing
- learn the page and layout files

### Week 2

- study `TaskList.tsx` and `taskStore.ts`
- add one small task feature
- write or update one test

### Week 3

- study `Timer.tsx` and `timerStore.ts`
- trace the full timer flow
- change one timer rule safely

### Week 4

- study settings, sessions, and persistence
- add one new setting
- verify it persists correctly

### Week 5

- read the tests more deeply
- add tests for a bug fix
- practice debugging a deliberately broken feature

### Week 6 And Beyond

- build a feature from idea to implementation to tests
- refactor one rough spot you now understand better

That is how you go from "I can follow code" to "I can own code".

---

## Final Advice For The Student Going From Zero To Hero

You do not become good at frontend by reading one magical article or memorizing every standard practice.

You become good by repeatedly doing this:

1. understand the goal
2. find the owning files
3. make a change
4. test the change
5. reflect on what happened

That loop, repeated many times, is what builds intuition.

In the AI era, that loop becomes even more powerful because you can move faster between idea, draft, review, and refinement. But the loop still needs you in the middle making decisions.

This Pomodoro project is a strong teaching project because it contains the right kind of real-world frontend problems:

- layout
- styling
- inputs
- shared state
- side effects
- persistence
- testing
- UI feedback

If you work through this tutorial patiently and actually do the exercises instead of only reading, you will not stay a beginner for long.

You will become the kind of developer who can use modern tools well without being trapped by them.

---

## Quick Reference

### If You Forget What React Is

React is a way to describe UI as a function of state.

### If You Forget What A Store Is

A store is a shared home for app state and the actions that update it.

### If You Forget What `useEffect` Is For

Use it when your component needs to synchronize with something outside normal rendering.

### If You Forget What To Do Next

Open one file.
Understand one responsibility.
Make one change.
Run one test.

That is enough.

---

## Graduation Goal

You have "graduated" from this tutorial when you can do all of the following without feeling lost:

- explain how the timer works
- explain why tasks live in a store
- add a setting and persist it
- write a test for your change
- debug a broken interaction calmly
- use AI and agents as force multipliers instead of crutches
- improve or replace an AI draft when it is not good enough

If you can do those things, you are no longer just starting frontend.

You are building it.
