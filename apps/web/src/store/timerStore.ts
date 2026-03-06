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

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

interface TimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessionsCompleted: number;
  settings: Settings;
  initialized: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  initialize: () => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: "work",
  timeLeft: DEFAULT_SETTINGS.workDuration * 60,
  isRunning: false,
  sessionsCompleted: 0,
  settings: DEFAULT_SETTINGS,
  initialized: false,

  start: () => set({ isRunning: true }),

  pause: () => set({ isRunning: false }),

  reset: () => {
    const { mode, settings } = get();
    const durations = {
      work: settings.workDuration * 60,
      shortBreak: settings.shortBreakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    };
    set({ timeLeft: durations[mode], isRunning: false });
  },

  tick: () => {
    const { timeLeft, mode, sessionsCompleted, settings } = get();
    if (timeLeft > 0) {
      set({ timeLeft: timeLeft - 1 });
    } else {
      const isWork = mode === "work";
      const sessionsUntilLongBreak = (sessionsCompleted + (isWork ? 1 : 0)) % settings.longBreakInterval;
      
      let nextMode: TimerMode;
      if (isWork) {
        nextMode = sessionsUntilLongBreak === 0 ? "longBreak" : "shortBreak";
      } else {
        nextMode = "work";
      }

      const durations = {
        work: settings.workDuration * 60,
        shortBreak: settings.shortBreakDuration * 60,
        longBreak: settings.longBreakDuration * 60,
      };

      const newSessions = isWork ? sessionsCompleted + 1 : sessionsCompleted;
      const shouldAutoStart = (isWork && settings.autoStartBreaks) || (!isWork && settings.autoStartPomodoros);

      set({
        mode: nextMode,
        timeLeft: durations[nextMode],
        isRunning: shouldAutoStart,
        sessionsCompleted: newSessions,
      });
    }
  },

  setMode: (mode: TimerMode) => {
    const { settings } = get();
    const durations = {
      work: settings.workDuration * 60,
      shortBreak: settings.shortBreakDuration * 60,
      longBreak: settings.longBreakDuration * 60,
    };
    set({ mode, timeLeft: durations[mode], isRunning: false });
  },

  updateSettings: (newSettings: Partial<Settings>) => {
    const { settings, mode } = get();
    const updated = { ...settings, ...newSettings };
    const durations = {
      work: updated.workDuration * 60,
      shortBreak: updated.shortBreakDuration * 60,
      longBreak: updated.longBreakDuration * 60,
    };
    set({
      settings: updated,
      timeLeft: durations[mode],
    });
  },

  initialize: () => {
    if (typeof window === "undefined") return;
    
    try {
      const saved = localStorage.getItem("pomodoro-timer");
      if (saved) {
        const parsed = JSON.parse(saved);
        const validModes: TimerMode[] = ["work", "shortBreak", "longBreak"];
        const mode: TimerMode = validModes.includes(parsed.mode) ? parsed.mode : "work";
        const durations: Record<TimerMode, number> = {
          work: (parsed.settings?.workDuration || DEFAULT_SETTINGS.workDuration) * 60,
          shortBreak: (parsed.settings?.shortBreakDuration || DEFAULT_SETTINGS.shortBreakDuration) * 60,
          longBreak: (parsed.settings?.longBreakDuration || DEFAULT_SETTINGS.longBreakDuration) * 60,
        };
        const timeLeft = parsed.timeLeft > 0 ? parsed.timeLeft : durations[mode];
        
        set({
          mode,
          timeLeft,
          isRunning: false,
          sessionsCompleted: parsed.sessionsCompleted || 0,
          settings: parsed.settings || DEFAULT_SETTINGS,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }
  },
}));

if (typeof window !== "undefined") {
  useTimerStore.subscribe((state) => {
    if (state.initialized) {
      localStorage.setItem("pomodoro-timer", JSON.stringify({
        mode: state.mode,
        timeLeft: state.timeLeft,
        isRunning: false,
        sessionsCompleted: state.sessionsCompleted,
        settings: state.settings,
      }));
    }
  });
}

export { formatTime };
