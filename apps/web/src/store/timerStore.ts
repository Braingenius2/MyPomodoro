"use client";

import { create } from "zustand";

export type TimerMode = "work" | "shortBreak" | "longBreak";

export interface Settings {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  longBreakInterval: number;
}

export interface CompletionEvent {
  id: number;
  completedMode: TimerMode;
  nextMode: TimerMode;
  duration: number;
  autoStarted: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

export const SETTINGS_LIMITS = {
  workDuration: { min: 5, max: 60 },
  shortBreakDuration: { min: 1, max: 15 },
  longBreakDuration: { min: 10, max: 45 },
  longBreakInterval: { min: 2, max: 8 },
} as const;

const MODE_DURATION_KEYS: Record<TimerMode, keyof Pick<Settings, "workDuration" | "shortBreakDuration" | "longBreakDuration">> = {
  work: "workDuration",
  shortBreak: "shortBreakDuration",
  longBreak: "longBreakDuration",
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function clampInteger(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function getModeDurationMinutes(mode: TimerMode, settings: Settings): number {
  return settings[MODE_DURATION_KEYS[mode]];
}

function getModeDurationSeconds(mode: TimerMode, settings: Settings): number {
  return getModeDurationMinutes(mode, settings) * 60;
}

function sanitizeSettings(input: unknown): Settings {
  const candidate =
    typeof input === "object" && input !== null
      ? (input as Partial<Record<keyof Settings, unknown>>)
      : {};

  return {
    workDuration: clampInteger(
      candidate.workDuration,
      SETTINGS_LIMITS.workDuration.min,
      SETTINGS_LIMITS.workDuration.max,
      DEFAULT_SETTINGS.workDuration
    ),
    shortBreakDuration: clampInteger(
      candidate.shortBreakDuration,
      SETTINGS_LIMITS.shortBreakDuration.min,
      SETTINGS_LIMITS.shortBreakDuration.max,
      DEFAULT_SETTINGS.shortBreakDuration
    ),
    longBreakDuration: clampInteger(
      candidate.longBreakDuration,
      SETTINGS_LIMITS.longBreakDuration.min,
      SETTINGS_LIMITS.longBreakDuration.max,
      DEFAULT_SETTINGS.longBreakDuration
    ),
    autoStartBreaks: candidate.autoStartBreaks === true,
    autoStartPomodoros: candidate.autoStartPomodoros === true,
    longBreakInterval: clampInteger(
      candidate.longBreakInterval,
      SETTINGS_LIMITS.longBreakInterval.min,
      SETTINGS_LIMITS.longBreakInterval.max,
      DEFAULT_SETTINGS.longBreakInterval
    ),
  };
}

function sanitizeMode(mode: unknown): TimerMode {
  return mode === "shortBreak" || mode === "longBreak" ? mode : "work";
}

function sanitizeSessionsCompleted(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.trunc(value);
}

function getNextCompletionId(lastCompletion: CompletionEvent | null): number {
  return (lastCompletion?.id ?? 0) + 1;
}

interface CompletionSource {
  mode: TimerMode;
  sessionsCompleted: number;
  settings: Settings;
  lastCompletion: CompletionEvent | null;
  initialTimeLeft: number;
}

function buildCompletionState(source: CompletionSource, now: number) {
  const completedMode = source.mode;
  const completedDuration =
    source.initialTimeLeft > 0
      ? Math.round(source.initialTimeLeft / 60)
      : getModeDurationMinutes(completedMode, source.settings);
  const completedWorkSessions = completedMode === "work" ? source.sessionsCompleted + 1 : source.sessionsCompleted;
  const nextMode: TimerMode =
    completedMode === "work"
      ? completedWorkSessions % source.settings.longBreakInterval === 0
        ? "longBreak"
        : "shortBreak"
      : "work";
  const autoStarted =
    completedMode === "work" ? source.settings.autoStartBreaks : source.settings.autoStartPomodoros;
  const nextDuration = getModeDurationSeconds(nextMode, source.settings);

  return {
    mode: nextMode,
    timeLeft: nextDuration,
    isRunning: autoStarted,
    alarmActive: !autoStarted,
    sessionsCompleted: completedWorkSessions,
    focusMode: autoStarted && nextMode === "work",
    endAt: autoStarted ? now + nextDuration * 1000 : null,
    lastCompletion: {
      id: getNextCompletionId(source.lastCompletion),
      completedMode,
      nextMode,
      duration: completedDuration,
      autoStarted,
    },
  };
}

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  alarmActive: boolean;
  sessionsCompleted: number;
  settings: Settings;
  initialized: boolean;
  lastCompletion: CompletionEvent | null;
  initialTimeLeft: number;
  focusMode: boolean;
  endAt: number | null;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  initialize: () => void;
  acknowledgeCompletion: () => void;
  quickStart: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: "work",
  timeLeft: getModeDurationSeconds("work", DEFAULT_SETTINGS),
  isRunning: false,
  alarmActive: false,
  sessionsCompleted: 0,
  settings: DEFAULT_SETTINGS,
  initialized: false,
  lastCompletion: null,
  initialTimeLeft: 0,
  focusMode: false,
  endAt: null,

  start: () => {
    const { timeLeft } = get();
    set({
      isRunning: true,
      alarmActive: false,
      focusMode: true,
      initialTimeLeft: timeLeft,
      endAt: Date.now() + timeLeft * 1000,
    });
  },

  quickStart: () => {
    set({
      mode: "work",
      timeLeft: 300,
      isRunning: true,
      alarmActive: false,
      focusMode: true,
      initialTimeLeft: 300,
      endAt: Date.now() + 300 * 1000,
    });
  },

  pause: () => set({ isRunning: false, focusMode: false, endAt: null }),

  reset: () => {
    const { mode, settings } = get();
    set({
      timeLeft: getModeDurationSeconds(mode, settings),
      isRunning: false,
      alarmActive: false,
      focusMode: false,
      initialTimeLeft: 0,
      endAt: null,
    });
  },

  tick: () => {
    const state = get();
    const { timeLeft, endAt, isRunning } = state;

    if (isRunning && endAt !== null) {
      const remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      if (remaining > 0) {
        if (remaining !== timeLeft) {
          set({ timeLeft: remaining });
        }
        return;
      }
      set(buildCompletionState(state, Date.now()));
      return;
    }

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    set(buildCompletionState(state, Date.now()));
  },

  setMode: (mode: TimerMode) => {
    const { settings } = get();
    set({
      mode,
      timeLeft: getModeDurationSeconds(mode, settings),
      isRunning: false,
      alarmActive: false,
      focusMode: false,
      endAt: null,
    });
  },

  updateSettings: (newSettings: Partial<Settings>) => {
    const { settings, mode, isRunning } = get();
    const updated = sanitizeSettings({ ...settings, ...newSettings });

    if (!isRunning) {
      set({
        settings: updated,
        timeLeft: getModeDurationSeconds(mode, updated),
        endAt: null,
      });
    } else {
      set({ settings: updated });
    }
  },

  initialize: () => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("pomodoro-timer");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          mode?: unknown;
          timeLeft?: unknown;
          isRunning?: unknown;
          endAt?: unknown;
          initialTimeLeft?: unknown;
          sessionsCompleted?: unknown;
          settings?: unknown;
        };
        const settings = sanitizeSettings(parsed.settings);
        const mode = sanitizeMode(parsed.mode);
        const defaultTimeLeft = getModeDurationSeconds(mode, settings);
        const timeLeft =
          typeof parsed.timeLeft === "number" && Number.isFinite(parsed.timeLeft) && parsed.timeLeft > 0
            ? Math.trunc(parsed.timeLeft)
            : defaultTimeLeft;
        const savedRunning = parsed.isRunning === true;
        const savedEndAt =
          typeof parsed.endAt === "number" && Number.isFinite(parsed.endAt) ? Math.trunc(parsed.endAt) : null;
        const savedInitialTimeLeft =
          typeof parsed.initialTimeLeft === "number" && Number.isFinite(parsed.initialTimeLeft)
            ? Math.max(0, Math.trunc(parsed.initialTimeLeft))
            : 0;
        const sessionsCompleted = sanitizeSessionsCompleted(parsed.sessionsCompleted);
        const now = Date.now();

        if (savedRunning && savedEndAt !== null && savedEndAt > now) {
          // The timer was running and the deadline is still in the future.
          const remaining = Math.max(1, Math.ceil((savedEndAt - now) / 1000));
          set({
            mode,
            timeLeft: remaining,
            isRunning: true,
            alarmActive: false,
            sessionsCompleted,
            settings,
            initialized: true,
            lastCompletion: null,
            focusMode: mode === "work",
            initialTimeLeft: savedInitialTimeLeft,
            endAt: savedEndAt,
          });
          return;
        }

        if (savedRunning && savedEndAt !== null) {
          // The session finished while the tab was closed or discarded. Log it once.
          const completion = buildCompletionState(
            { mode, sessionsCompleted, settings, lastCompletion: null, initialTimeLeft: savedInitialTimeLeft },
            now
          );
          set({
            settings,
            initialized: true,
            ...completion,
          });
          return;
        }

        set({
          mode,
          timeLeft,
          isRunning: false,
          alarmActive: false,
          sessionsCompleted,
          settings,
          initialized: true,
          lastCompletion: null,
          focusMode: false,
          initialTimeLeft: savedInitialTimeLeft,
          endAt: null,
        });
      } else {
        set({
          mode: "work",
          timeLeft: getModeDurationSeconds("work", DEFAULT_SETTINGS),
          isRunning: false,
          alarmActive: false,
          sessionsCompleted: 0,
          settings: DEFAULT_SETTINGS,
          initialized: true,
          lastCompletion: null,
          focusMode: false,
          initialTimeLeft: 0,
          endAt: null,
        });
      }
    } catch {
      set({
        mode: "work",
        timeLeft: getModeDurationSeconds("work", DEFAULT_SETTINGS),
        isRunning: false,
        alarmActive: false,
        sessionsCompleted: 0,
        settings: DEFAULT_SETTINGS,
        initialized: true,
        lastCompletion: null,
        focusMode: false,
        initialTimeLeft: 0,
        endAt: null,
      });
    }
  },

  acknowledgeCompletion: () => set({ lastCompletion: null }),
}));

if (typeof window !== "undefined") {
  useTimerStore.subscribe((state) => {
    if (state.initialized) {
      try {
        localStorage.setItem("pomodoro-timer", JSON.stringify({
          mode: state.mode,
          timeLeft: state.timeLeft,
          isRunning: state.isRunning,
          endAt: state.endAt,
          initialTimeLeft: state.initialTimeLeft,
          sessionsCompleted: state.sessionsCompleted,
          settings: state.settings,
        }));
      } catch (e) {
        console.warn("Failed to save timer to localStorage:", e);
      }
    }
  });
}

export { formatTime };
