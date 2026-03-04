import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SessionHistory } from '@/components/SessionHistory';
import { useSessionStore } from '@/store/sessionStore';

describe('SessionHistory Component', () => {
  beforeEach(() => {
    useSessionStore.setState({ sessions: [], initialized: true });
    localStorage.clear();
  });

  it('should show loading state during initialization', () => {
    useSessionStore.setState({ initialized: false });
    const { container } = render(<SessionHistory />);
    const skeleton = container.querySelector('div[class*="animate-pulse"]');
    expect(skeleton).toBeInTheDocument();
  });

  it('should display no data message when there are no sessions', () => {
    useSessionStore.setState({ sessions: [], initialized: true });
    render(<SessionHistory />);
    
    expect(screen.getByText(/NO DATA - START FOCUSING!/i)).toBeInTheDocument();
  });

  it('should display session stats', async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
        { id: '2', type: 'shortBreak', duration: 5, completedAt: now },
      ],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Focus sessions count
      expect(screen.getByText(/Focus Sessions/i)).toBeInTheDocument();
    });
  });

  it('should display total work duration', async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
        { id: '2', type: 'work', duration: 25, completedAt: now },
        { id: '3', type: 'shortBreak', duration: 5, completedAt: now },
      ],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      // 50 minutes = 0h 50m
      expect(screen.getByText(/0h 50m/)).toBeInTheDocument();
    });
  });

  it('should display session grid', async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
        { id: '2', type: 'shortBreak', duration: 5, completedAt: now },
      ],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  it('should show clear button only when there are sessions', async () => {
    useSessionStore.setState({ sessions: [], initialized: true });
    const { rerender } = render(<SessionHistory />);
    
    expect(screen.queryByText(/CLEAR DATA/i)).not.toBeInTheDocument();
    
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [{ id: '1', type: 'work', duration: 25, completedAt: now }],
    });
    
    rerender(<SessionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/CLEAR DATA/i)).toBeInTheDocument();
    });
  });

  it('should clear sessions when button is clicked', async () => {
    const user = userEvent.setup();
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [{ id: '1', type: 'work', duration: 25, completedAt: now }],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/CLEAR DATA/i)).toBeInTheDocument();
    });

    const clearButton = screen.getByText(/CLEAR DATA/i);
    await user.click(clearButton);
    
    await waitFor(() => {
      expect(useSessionStore.getState().sessions).toHaveLength(0);
    });
  });

  it('should only count today sessions', async () => {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
        { id: '2', type: 'work', duration: 25, completedAt: yesterday },
      ],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      // Should only show 1 today session
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('should display correct session types in grid', async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
        { id: '2', type: 'shortBreak', duration: 5, completedAt: now },
      ],
      initialized: true,
    });
    
    const { container } = render(<SessionHistory />);
    
    await waitFor(() => {
      const gridItems = container.querySelectorAll('div[class*="bg-neon"]');
      expect(gridItems.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should display header with logo and stats', async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: '1', type: 'work', duration: 25, completedAt: now },
      ],
      initialized: true,
    });
    
    render(<SessionHistory />);
    
    await waitFor(() => {
      expect(screen.getByText(/TODAY'S LOG/i)).toBeInTheDocument();
      expect(screen.getByText('📊')).toBeInTheDocument();
    });
  });
});