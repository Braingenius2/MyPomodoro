"use client";

import { create } from "zustand";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskState {
  tasks: Task[];
  initialized: boolean;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearCompleted: () => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  initialize: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  initialized: false,

  addTask: (title: string) => {
    const newTask: Task = {
      id: generateId(),
      title,
      completed: false,
    };
    set({ tasks: [...get().tasks, newTask] });
  },

  toggleTask: (id: string) => {
    set({
      tasks: get().tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      ),
    });
  },

  deleteTask: (id: string) => {
    set({
      tasks: get().tasks.filter((task) => task.id !== id),
    });
  },

  clearCompleted: () => {
    set({
      tasks: get().tasks.filter((task) => !task.completed),
    });
  },

  reorderTasks: (startIndex: number, endIndex: number) => {
    const result = Array.from(get().tasks);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    set({ tasks: result });
  },

  initialize: () => {
    if (typeof window === "undefined") return;
    
    try {
      const saved = localStorage.getItem("pomodoro-tasks");
      if (saved) {
        set({
          tasks: JSON.parse(saved) || [],
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
  useTaskStore.subscribe((state) => {
    if (state.initialized) {
      try {
        localStorage.setItem("pomodoro-tasks", JSON.stringify(state.tasks));
      } catch (e) {
        console.warn("Failed to save tasks to localStorage:", e);
      }
    }
  });
}
