"use client";

import { useEffect } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerMode = "work" | "shortBreak" | "longBreak";

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
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  setMode: (mode: TimerMode) => void;
}

const DURATIONS: Record<TimerMode, number> = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      mode: "work",
      timeLeft: DURATIONS.work,
      isRunning: false,
      sessionsCompleted: 0,

      start: () => set({ isRunning: true }),

      pause: () => set({ isRunning: false }),

      reset: () => {
        const { mode } = get();
        set({ timeLeft: DURATIONS[mode], isRunning: false });
      },

      tick: () => {
        const { timeLeft, mode, sessionsCompleted } = get();
        if (timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else {
          const nextMode = mode === "work" ? "shortBreak" : "work";
          const newSessions =
            mode === "work" ? sessionsCompleted + 1 : sessionsCompleted;
          set({
            mode: nextMode,
            timeLeft: DURATIONS[nextMode],
            isRunning: false,
            sessionsCompleted: newSessions,
          });
        }
      },

      setMode: (mode: TimerMode) => {
        set({ mode, timeLeft: DURATIONS[mode], isRunning: false });
      },
    }),
    {
      name: "pomodoro-timer",
    },
  ),
);

export function Timer() {
  const {
    mode,
    timeLeft,
    isRunning,
    sessionsCompleted,
    start,
    pause,
    reset,
    setMode,
    tick,
  } = useTimerStore();

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick, timeLeft]);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex gap-2">
        {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              mode === m
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {m === "work"
              ? "Work"
              : m === "shortBreak"
                ? "Short Break"
                : "Long Break"}
          </button>
        ))}
      </div>

      <div className="text-8xl font-mono font-bold">{formatTime(timeLeft)}</div>

      <div className="flex gap-4">
        <button
          onClick={isRunning ? pause : start}
          className="px-8 py-3 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="text-gray-600">
        Sessions completed: {sessionsCompleted}
      </div>
    </div>
  );
}
