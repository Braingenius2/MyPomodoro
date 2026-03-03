"use client";

import { create } from "zustand";

export interface Session {
  id: string;
  type: "work" | "shortBreak" | "longBreak";
  duration: number;
  completedAt: string;
}

interface SessionState {
  sessions: Session[];
  initialized: boolean;
  addSession: (session: Omit<Session, "id" | "completedAt">) => void;
  clearSessions: () => void;
  initialize: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  sessions: [],
  initialized: false,

  addSession: (session) =>
    set((state) => ({
      sessions: [
        {
          ...session,
          id: Math.random().toString(36).substring(2, 9),
          completedAt: new Date().toISOString(),
        },
        ...state.sessions,
      ].slice(0, 100),
    })),

  clearSessions: () => set({ sessions: [] }),

  initialize: () => {
    if (typeof window === "undefined") return;
    
    try {
      const saved = localStorage.getItem("pomodoro-sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        set({ sessions: parsed, initialized: true });
      } else {
        set({ initialized: true });
      }
    } catch {
      set({ initialized: true });
    }
  },
}));

if (typeof window !== "undefined") {
  useSessionStore.subscribe((state) => {
    if (state.initialized) {
      localStorage.setItem("pomodoro-sessions", JSON.stringify(state.sessions));
    }
  });
}
