import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SETTINGS,
  formatTime,
  useTimerStore,
} from "@/store/timerStore";

function resetTimerStore() {
  useTimerStore.setState({
    mode: "work",
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    alarmActive: false,
    sessionsCompleted: 0,
    settings: DEFAULT_SETTINGS,
    initialized: false,
    lastCompletion: null,
  });
}

describe("timerStore", () => {
  beforeEach(() => {
    resetTimerStore();
    localStorage.clear();
  });

  describe("formatTime", () => {
    it("formats seconds as MM:SS", () => {
      expect(formatTime(0)).toBe("00:00");
      expect(formatTime(59)).toBe("00:59");
      expect(formatTime(65)).toBe("01:05");
      expect(formatTime(3660)).toBe("61:00");
    });
  });

  describe("initialization", () => {
    it("loads defaults when storage is empty", () => {
      useTimerStore.getState().initialize();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "work",
        timeLeft: 1500,
        isRunning: false,
        sessionsCompleted: 0,
        settings: DEFAULT_SETTINGS,
        initialized: true,
        lastCompletion: null,
      });
    });

    it("loads persisted state when storage is valid", () => {
      localStorage.setItem(
        "pomodoro-timer",
        JSON.stringify({
          mode: "shortBreak",
          timeLeft: 180,
          sessionsCompleted: 2,
          settings: {
            workDuration: 30,
            shortBreakDuration: 3,
            longBreakDuration: 20,
            autoStartBreaks: true,
            autoStartPomodoros: false,
            longBreakInterval: 5,
          },
        })
      );

      useTimerStore.getState().initialize();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        timeLeft: 180,
        sessionsCompleted: 2,
        initialized: true,
        settings: {
          workDuration: 30,
          shortBreakDuration: 3,
          longBreakDuration: 20,
          autoStartBreaks: true,
          autoStartPomodoros: false,
          longBreakInterval: 5,
        },
      });
    });

    it("sanitizes invalid persisted values", () => {
      localStorage.setItem(
        "pomodoro-timer",
        JSON.stringify({
          mode: "invalid",
          timeLeft: -10,
          sessionsCompleted: -4,
          settings: {
            workDuration: 99,
            shortBreakDuration: -4,
            longBreakDuration: 0,
            autoStartBreaks: "yes",
            autoStartPomodoros: 1,
            longBreakInterval: 100,
          },
        })
      );

      useTimerStore.getState().initialize();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "work",
        timeLeft: 3600,
        sessionsCompleted: 0,
        initialized: true,
        settings: {
          workDuration: 60,
          shortBreakDuration: 1,
          longBreakDuration: 10,
          autoStartBreaks: false,
          autoStartPomodoros: false,
          longBreakInterval: 8,
        },
      });
    });

    it("falls back to defaults for corrupted storage", () => {
      localStorage.setItem("pomodoro-timer", "not valid json");

      expect(() => useTimerStore.getState().initialize()).not.toThrow();
      expect(useTimerStore.getState()).toMatchObject({
        mode: "work",
        timeLeft: 1500,
        settings: DEFAULT_SETTINGS,
        initialized: true,
      });
    });
  });

  describe("timer transitions", () => {
    it("decrements by one second while time remains", () => {
      useTimerStore.setState({ timeLeft: 1500, isRunning: true });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState().timeLeft).toBe(1499);
      expect(useTimerStore.getState().mode).toBe("work");
      expect(useTimerStore.getState().lastCompletion).toBeNull();
    });

    it("completes work immediately when ticking from one second", () => {
      useTimerStore.setState({ mode: "work", timeLeft: 1, isRunning: true });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        timeLeft: 300,
        isRunning: false,
        sessionsCompleted: 1,
        lastCompletion: {
          completedMode: "work",
          nextMode: "shortBreak",
          duration: 25,
          autoStarted: false,
        },
      });
    });

    it("starts a long break after the configured number of work sessions", () => {
      useTimerStore.setState({
        mode: "work",
        timeLeft: 1,
        sessionsCompleted: 3,
      });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "longBreak",
        timeLeft: 900,
        sessionsCompleted: 4,
        lastCompletion: {
          completedMode: "work",
          nextMode: "longBreak",
          duration: 25,
        },
      });
    });

    it("returns to work after completing a break without incrementing sessions", () => {
      useTimerStore.setState({
        mode: "shortBreak",
        timeLeft: 1,
        sessionsCompleted: 2,
      });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "work",
        timeLeft: 1500,
        sessionsCompleted: 2,
        lastCompletion: {
          completedMode: "shortBreak",
          nextMode: "work",
          duration: 5,
        },
      });
    });

    it("auto-starts breaks when the setting is enabled", () => {
      useTimerStore.setState({
        mode: "work",
        timeLeft: 1,
        isRunning: true,
        settings: {
          ...DEFAULT_SETTINGS,
          autoStartBreaks: true,
        },
      });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        timeLeft: 300,
        isRunning: true,
        sessionsCompleted: 1,
        lastCompletion: {
          completedMode: "work",
          autoStarted: true,
        },
      });
    });

    it("auto-starts focus sessions when the setting is enabled", () => {
      useTimerStore.setState({
        mode: "longBreak",
        timeLeft: 1,
        isRunning: true,
        settings: {
          ...DEFAULT_SETTINGS,
          autoStartPomodoros: true,
        },
      });

      useTimerStore.getState().tick();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "work",
        timeLeft: 1500,
        isRunning: true,
        sessionsCompleted: 0,
        lastCompletion: {
          completedMode: "longBreak",
          autoStarted: true,
        },
      });
    });
  });

  describe("actions", () => {
    it("resets the current mode duration and pauses", () => {
      useTimerStore.setState({ mode: "longBreak", timeLeft: 60, isRunning: true });

      useTimerStore.getState().reset();

      expect(useTimerStore.getState()).toMatchObject({
        mode: "longBreak",
        timeLeft: 900,
        isRunning: false,
      });
    });

    it("changes mode and updates the timer length", () => {
      useTimerStore.getState().setMode("shortBreak");

      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        timeLeft: 300,
        isRunning: false,
      });
    });

    it("updates the current duration while paused", () => {
      useTimerStore.setState({ mode: "work", isRunning: false, timeLeft: 1500 });

      useTimerStore.getState().updateSettings({ workDuration: 30 });

      expect(useTimerStore.getState()).toMatchObject({
        timeLeft: 1800,
        settings: {
          ...DEFAULT_SETTINGS,
          workDuration: 30,
        },
      });
    });

    it("keeps the remaining time while running", () => {
      useTimerStore.setState({ mode: "work", isRunning: true, timeLeft: 1200 });

      useTimerStore.getState().updateSettings({ workDuration: 30 });

      expect(useTimerStore.getState()).toMatchObject({
        timeLeft: 1200,
        settings: {
          ...DEFAULT_SETTINGS,
          workDuration: 30,
        },
      });
    });

    it("clears the completion event after acknowledgement", () => {
      useTimerStore.setState({
        lastCompletion: {
          id: 1,
          completedMode: "work",
          nextMode: "shortBreak",
          duration: 25,
          autoStarted: false,
        },
      });

      useTimerStore.getState().acknowledgeCompletion();

      expect(useTimerStore.getState().lastCompletion).toBeNull();
    });
  });

  describe("persistence", () => {
    it("persists timer state after initialization", () => {
      useTimerStore.getState().initialize();

      useTimerStore.getState().setMode("shortBreak");

      const saved = JSON.parse(localStorage.getItem("pomodoro-timer") ?? "{}");
      expect(saved).toMatchObject({
        mode: "shortBreak",
        timeLeft: 300,
        isRunning: false,
        settings: DEFAULT_SETTINGS,
      });
    });
  });
});
