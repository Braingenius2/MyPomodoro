import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTimerStore, formatTime } from '@/store/timerStore';

describe('timerStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useTimerStore.setState({
      mode: 'work',
      timeLeft: 1500,
      isRunning: false,
      sessionsCompleted: 0,
      initialized: false,
    });
    localStorage.clear();
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS format', () => {
      expect(formatTime(0)).toBe('00:00');
      expect(formatTime(59)).toBe('00:59');
      expect(formatTime(60)).toBe('01:00');
      expect(formatTime(3599)).toBe('59:59');
      expect(formatTime(3660)).toBe('61:00');
    });

    it('should pad minutes and seconds with leading zeros', () => {
      expect(formatTime(65)).toBe('01:05');
      expect(formatTime(125)).toBe('02:05');
    });
  });

  describe('state initialization', () => {
    it('should initialize with default values', () => {
      const state = useTimerStore.getState();
      expect(state.mode).toBe('work');
      expect(state.isRunning).toBe(false);
      expect(state.timeLeft).toBe(1500);
      expect(state.sessionsCompleted).toBe(0);
    });

    it('should initialize from localStorage if available', () => {
      const savedState = {
        mode: 'shortBreak',
        timeLeft: 300,
        sessionsCompleted: 2,
        settings: {
          workDuration: 30,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          autoStartBreaks: true,
          autoStartPomodoros: false,
          longBreakInterval: 4,
        },
      };
      localStorage.setItem('pomodoro-timer', JSON.stringify(savedState));
      
      useTimerStore.getState().initialize();
      const state = useTimerStore.getState();
      
      expect(state.mode).toBe('shortBreak');
      expect(state.timeLeft).toBe(300);
      expect(state.sessionsCompleted).toBe(2);
    });
  });

  describe('start/pause/reset', () => {
    it('should start the timer', () => {
      useTimerStore.getState().start();
      expect(useTimerStore.getState().isRunning).toBe(true);
    });

    it('should pause the timer', () => {
      useTimerStore.getState().start();
      useTimerStore.getState().pause();
      expect(useTimerStore.getState().isRunning).toBe(false);
    });

    it('should reset timeLeft when reset is called', () => {
      const state = useTimerStore.getState();
      state.setMode('work');
      state.reset();
      
      expect(useTimerStore.getState().timeLeft).toBe(1500);
      expect(useTimerStore.getState().isRunning).toBe(false);
    });

    it('should reset to correct duration based on mode', () => {
      const state = useTimerStore.getState();
      state.setMode('shortBreak');
      state.reset();
      
      expect(useTimerStore.getState().timeLeft).toBe(300);
    });
  });

  describe('tick', () => {
    it('should decrement timeLeft by 1', () => {
      useTimerStore.getState().tick();
      expect(useTimerStore.getState().timeLeft).toBe(1499);
    });

    it('should not go below 0', () => {
      const state = useTimerStore.getState();
      state.tick();
      state.tick();
      // Keep ticking until we're at 1
      for (let i = 0; i < 1498; i++) {
        state.tick();
      }
      expect(useTimerStore.getState().timeLeft).toBe(1);
      state.tick();
      expect(useTimerStore.getState().timeLeft).toBe(0);
      state.tick();
      // Should not go negative
      expect(useTimerStore.getState().timeLeft).toBe(0);
    });

    it('should transition from work to shortBreak on timeout', () => {
      const state = useTimerStore.getState();
      state.setMode('work');
      // Fast forward to end
      useTimerStore.setState({ timeLeft: 1 });
      state.tick();
      
      expect(useTimerStore.getState().mode).toBe('shortBreak');
      expect(useTimerStore.getState().sessionsCompleted).toBe(1);
    });

    it('should advance to longBreak after configured sessions', () => {
      const state = useTimerStore.getState();
      
      // Complete 4 work sessions (default longBreakInterval)
      for (let i = 0; i < 4; i++) {
        state.setMode('work');
        useTimerStore.setState({ timeLeft: 1 });
        state.tick();
        // Complete the break
        useTimerStore.setState({ timeLeft: 1 });
        state.tick();
      }
      
      // Next should be long break
      expect(useTimerStore.getState().sessionsCompleted).toBe(4);
    });
  });

  describe('setMode', () => {
    it('should change mode and update timeLeft', () => {
      const state = useTimerStore.getState();
      state.setMode('shortBreak');
      
      expect(useTimerStore.getState().mode).toBe('shortBreak');
      expect(useTimerStore.getState().timeLeft).toBe(300);
    });

    it('should stop timer when changing mode', () => {
      const state = useTimerStore.getState();
      state.start();
      state.setMode('longBreak');
      
      expect(useTimerStore.getState().isRunning).toBe(false);
    });
  });

  describe('settings', () => {
    it('should update settings', () => {
      const state = useTimerStore.getState();
      state.updateSettings({ workDuration: 30 });
      
      expect(useTimerStore.getState().settings.workDuration).toBe(30);
    });

    it('should apply new duration when updating settings', () => {
      const state = useTimerStore.getState();
      state.setMode('work');
      state.updateSettings({ workDuration: 30 });
      
      expect(useTimerStore.getState().timeLeft).toBe(1800);
    });

    it('should auto-start breaks if setting is enabled', () => {
      const state = useTimerStore.getState();
      state.updateSettings({ autoStartBreaks: true });
      
      state.setMode('work');
      useTimerStore.setState({ timeLeft: 1 });
      state.tick();
      
      expect(useTimerStore.getState().isRunning).toBe(true);
      expect(useTimerStore.getState().mode).toBe('shortBreak');
    });

    it('should auto-start pomodoros if setting is enabled', () => {
      const state = useTimerStore.getState();
      state.updateSettings({ autoStartPomodoros: true });
      
      state.setMode('shortBreak');
      useTimerStore.setState({ timeLeft: 1 });
      state.tick();
      
      expect(useTimerStore.getState().isRunning).toBe(true);
      expect(useTimerStore.getState().mode).toBe('work');
    });
  });

  describe('localStorage persistence', () => {
    it('should save state to localStorage', () => {
      const state = useTimerStore.getState();
      state.initialize();
      state.start();
      state.tick();
      
      const saved = localStorage.getItem('pomodoro-timer');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed.isRunning).toBe(false); // Saved as paused
      expect(parsed.timeLeft).toBeGreaterThan(0);
    });
  });
});