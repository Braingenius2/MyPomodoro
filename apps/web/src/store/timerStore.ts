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

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  alarmActive: boolean;
  sessionsCompleted: number;
  settings: Settings;
  initialized: boolean;
  lastCompletion: CompletionEvent | null;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  initialize: () => void;
  acknowledgeCompletion: () => void;
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

  start: () => set({ isRunning: true, alarmActive: false }),

  pause: () => set({ isRunning: false }),

  reset: () => {
    const { mode, settings } = get();
    set({
      timeLeft: getModeDurationSeconds(mode, settings),
      isRunning: false,
      alarmActive: false,
    });
  },

  tick: () => {
    const { timeLeft, mode, sessionsCompleted, settings, lastCompletion } = get();

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    const completedMode = mode;
    const completedDuration = getModeDurationMinutes(completedMode, settings);
    const completedWorkSessions = completedMode === "work" ? sessionsCompleted + 1 : sessionsCompleted;
    const nextMode: TimerMode =
      completedMode === "work"
        ? completedWorkSessions % settings.longBreakInterval === 0
          ? "longBreak"
          : "shortBreak"
        : "work";
    const autoStarted =
      completedMode === "work" ? settings.autoStartBreaks : settings.autoStartPomodoros;

    set({
      mode: nextMode,
      timeLeft: getModeDurationSeconds(nextMode, settings),
      isRunning: autoStarted,
      alarmActive: !autoStarted,
      sessionsCompleted: completedWorkSessions,
      lastCompletion: {
        id: getNextCompletionId(lastCompletion),
        completedMode,
        nextMode,
        duration: completedDuration,
        autoStarted,
      },
    });
  },

  setMode: (mode: TimerMode) => {
    const { settings } = get();
    set({
      mode,
      timeLeft: getModeDurationSeconds(mode, settings),
      isRunning: false,
      alarmActive: false,
    });
  },

  updateSettings: (newSettings: Partial<Settings>) => {
    const { settings, mode, isRunning } = get();
    const updated = sanitizeSettings({ ...settings, ...newSettings });

    if (!isRunning) {
      set({
        settings: updated,
        timeLeft: getModeDurationSeconds(mode, updated),
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

        set({
          mode,
          timeLeft,
          isRunning: false,
          alarmActive: false,
          sessionsCompleted: sanitizeSessionsCompleted(parsed.sessionsCompleted),
          settings,
          initialized: true,
          lastCompletion: null,
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
          isRunning: false,
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
