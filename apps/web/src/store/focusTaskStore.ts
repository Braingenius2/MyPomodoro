"use client";

import { create } from "zustand";

export interface FocusTask {
  id: string;
  title: string;
}

interface FocusTaskState {
  task: FocusTask | null;
  initialized: boolean;
  setFocusTask: (title: string) => void;
  clearFocusTask: () => void;
  initialize: () => void;
}

const STORAGE_KEY = "pomodoro-focus-task";

export const useFocusTaskStore = create<FocusTaskState>((set) => ({
  task: null,
  initialized: false,

  setFocusTask: (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    set({
      task: {
        id: Math.random().toString(36).substring(2, 9),
        title: trimmed,
      },
    });
  },

  clearFocusTask: () => set({ task: null }),

  initialize: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.title === "string") {
          set({ task: { id: parsed.id || "", title: parsed.title }, initialized: true });
          return;
        }
      }
    } catch {}
    set({ initialized: true });
  },
}));

if (typeof window !== "undefined") {
  useFocusTaskStore.subscribe((state) => {
    if (state.initialized) {
      try {
        if (state.task) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.task));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.warn("Failed to save focus task:", e);
      }
    }
  });
}
