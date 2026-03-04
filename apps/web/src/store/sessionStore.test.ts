import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from '@/store/sessionStore';

describe('sessionStore', () => {
  beforeEach(() => {
    useSessionStore.setState({ sessions: [], initialized: false });
    localStorage.clear();
  });

  describe('addSession', () => {
    it('should add a new session', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions).toHaveLength(1);
      expect(sessions[0]?.type).toBe('work');
      expect(sessions[0]?.duration).toBe(25);
    });

    it('should generate unique IDs for sessions', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      state.addSession({ type: 'shortBreak', duration: 5 });
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions[0]?.id).not.toBe(sessions[1]?.id);
    });

    it('should add completedAt timestamp', () => {
      const beforeTime = new Date();
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      
      const sessions = useSessionStore.getState().sessions;
      const completedTime = new Date(sessions[0]?.completedAt || 0);
      
      expect(completedTime.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
    });

    it('should prepend new sessions to the list', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      state.addSession({ type: 'shortBreak', duration: 5 });
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions[0]?.type).toBe('shortBreak');
      expect(sessions[1]?.type).toBe('work');
    });

    it('should limit sessions to 100 most recent', () => {
      const state = useSessionStore.getState();
      
      // Add 105 sessions
      for (let i = 0; i < 105; i++) {
        state.addSession({ type: 'work', duration: 25 });
      }
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions).toHaveLength(100);
    });

    it('should handle different session types', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      state.addSession({ type: 'shortBreak', duration: 5 });
      state.addSession({ type: 'longBreak', duration: 15 });
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions).toHaveLength(3);
      const types = sessions.map(s => s?.type);
      expect(types).toContain('work');
      expect(types).toContain('shortBreak');
      expect(types).toContain('longBreak');
    });
  });

  describe('clearSessions', () => {
    it('should clear all sessions', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      state.addSession({ type: 'shortBreak', duration: 5 });
      
      state.clearSessions();
      
      expect(useSessionStore.getState().sessions).toHaveLength(0);
    });

    it('should allow adding sessions after clearing', () => {
      const state = useSessionStore.getState();
      state.addSession({ type: 'work', duration: 25 });
      state.clearSessions();
      state.addSession({ type: 'shortBreak', duration: 5 });
      
      const sessions = useSessionStore.getState().sessions;
      expect(sessions).toHaveLength(1);
      expect(sessions[0]?.type).toBe('shortBreak');
    });
  });

  describe('initialization', () => {
    it('should initialize with empty sessions and initialized false', () => {
      const state = useSessionStore.getState();
      expect(state.sessions).toHaveLength(0);
      expect(state.initialized).toBe(false);
    });

    it('should load sessions from localStorage', () => {
      const mockSessions = [
        {
          id: '123',
          type: 'work' as const,
          duration: 25,
          completedAt: new Date().toISOString(),
        },
        {
          id: '456',
          type: 'shortBreak' as const,
          duration: 5,
          completedAt: new Date().toISOString(),
        },
      ];
      
      localStorage.setItem('pomodoro-sessions', JSON.stringify(mockSessions));
      
      useSessionStore.getState().initialize();
      
      const state = useSessionStore.getState();
      expect(state.sessions).toHaveLength(2);
      expect(state.initialized).toBe(true);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('pomodoro-sessions', 'invalid json');
      
      expect(() => {
        useSessionStore.getState().initialize();
      }).not.toThrow();
      
      expect(useSessionStore.getState().initialized).toBe(true);
    });

    it('should handle missing localStorage gracefully', () => {
      localStorage.removeItem('pomodoro-sessions');
      
      useSessionStore.getState().initialize();
      
      expect(useSessionStore.getState().sessions).toHaveLength(0);
      expect(useSessionStore.getState().initialized).toBe(true);
    });

    it('should ignore non-array data in localStorage', () => {
      localStorage.setItem('pomodoro-sessions', JSON.stringify({ not: 'array' }));
      
      useSessionStore.getState().initialize();
      
      expect(useSessionStore.getState().sessions).toHaveLength(0);
    });
  });

  describe('localStorage persistence', () => {
    it('should save sessions to localStorage when adding', () => {
      const state = useSessionStore.getState();
      state.initialize();
      state.addSession({ type: 'work', duration: 25 });
      
      const saved = localStorage.getItem('pomodoro-sessions');
      expect(saved).toBeTruthy();
      
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0]?.type).toBe('work');
    });

    it('should save empty array when clearing', () => {
      const state = useSessionStore.getState();
      state.initialize();
      state.addSession({ type: 'work', duration: 25 });
      state.clearSessions();
      
      const saved = localStorage.getItem('pomodoro-sessions');
      const parsed = JSON.parse(saved!);
      expect(parsed).toHaveLength(0);
    });
  });

  describe('filtering by date', () => {
    it('should be able to filter sessions by date', () => {
      const state = useSessionStore.getState();
      
      // Add sessions with different times
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      // Note: The store doesn't directly support this, but consumers can filter
      state.addSession({ type: 'work', duration: 25 });
      
      const sessions = useSessionStore.getState().sessions;
      const todaySessions = sessions.filter(
        s => new Date(s?.completedAt || 0).toDateString() === now.toDateString()
      );
      
      expect(todaySessions).toHaveLength(1);
    });
  });
});