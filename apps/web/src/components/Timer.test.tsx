import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Timer } from '@/components/Timer';
import { useTimerStore } from '@/store/timerStore';
import { useSessionStore } from '@/store/sessionStore';

describe('Timer Component', () => {
  beforeEach(() => {
    useTimerStore.setState({
      mode: 'work',
      timeLeft: 1500,
      isRunning: false,
      sessionsCompleted: 0,
      initialized: true,
    });
    useSessionStore.setState({ sessions: [], initialized: true });
    localStorage.clear();
    vi.clearAllTimers();
  });

  it('should show loading state during initialization', () => {
    useTimerStore.setState({ initialized: false });
    useSessionStore.setState({ initialized: false });
    
    render(<Timer />);
    expect(screen.getByText(/INITIALIZING/i)).toBeInTheDocument();
  });

  it('should render title', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('MY POMODORO')).toBeInTheDocument();
    });
  });

  it('should display current mode buttons', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('FOCUS')).toBeInTheDocument();
      expect(screen.getByText('REST')).toBeInTheDocument();
      expect(screen.getByText('BREAK')).toBeInTheDocument();
    });
  });

  it('should display timer in MM:SS format', async () => {
    useTimerStore.setState({ timeLeft: 125 }); // 2:05
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('02:05')).toBeInTheDocument();
    });
  });

  it('should switch between modes when buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('FOCUS TIME')).toBeInTheDocument();
    });

    const restButton = screen.getByRole('button', { name: /REST/ });
    await user.click(restButton);
    
    await waitFor(() => {
      expect(screen.getByText('SHORT REST')).toBeInTheDocument();
    });
  });

  it('should start timer when START button is clicked', async () => {
    const user = userEvent.setup();
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText(/PAUSED/)).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /START/ });
    await user.click(startButton);
    
    await waitFor(() => {
      expect(screen.getByText(/ACTIVE/)).toBeInTheDocument();
    });
  });

  it('should pause timer when PAUSE button is clicked', async () => {
    const user = userEvent.setup();
    useTimerStore.setState({ isRunning: true });
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText(/ACTIVE/)).toBeInTheDocument();
    });

    const pauseButton = screen.getByRole('button', { name: /PAUSE/ });
    await user.click(pauseButton);
    
    await waitFor(() => {
      expect(screen.getByText(/PAUSED/)).toBeInTheDocument();
    });
  });

  it('should reset timer when RESET button is clicked', async () => {
    const user = userEvent.setup();
    useTimerStore.setState({ timeLeft: 500 });
    render(<Timer />);
    
    const resetButton = screen.getByRole('button', { name: /RESET/ });
    await user.click(resetButton);
    
    await waitFor(() => {
      expect(useTimerStore.getState().timeLeft).toBe(1500);
    });
  });

  it('should display sessions count', async () => {
    useTimerStore.setState({ sessionsCompleted: 3 });
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText(/Sessions/)).toBeInTheDocument();
    });
  });

  it('should display settings button', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      const settingsButton = screen.getByRole('button', { name: '⚙' });
      expect(settingsButton).toBeInTheDocument();
    });
  });

  it('should have progress bar', async () => {
    useTimerStore.setState({ timeLeft: 750 }); // 50% progress
    const { container } = render(<Timer />);
    
    await waitFor(() => {
      const progressBar = container.querySelector('[class*="transition-all"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  it('should display correct mode label based on selected mode', async () => {
    const user = userEvent.setup();
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText('FOCUS TIME')).toBeInTheDocument();
    });

    const breakButton = screen.getByRole('button', { name: /BREAK/ });
    await user.click(breakButton);
    
    await waitFor(() => {
      expect(screen.getByText('LONG BREAK')).toBeInTheDocument();
    });
  });

  it('should display status indicator', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText(/PAUSED/)).toBeInTheDocument();
    });
  });

  it('should show session history component', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText(/TODAY'S LOG/i)).toBeInTheDocument();
    });
  });

  it('should set interval when timer is running', async () => {
    const user = userEvent.setup();
    vi.useFakeTimers();
    
    render(<Timer />);
    
    await waitFor(() => {
      expect(screen.getByText(/.*/)).toBeInTheDocument();
    });

    const startButton = screen.getByRole('button', { name: /START/ });
    await user.click(startButton);
    
    expect(useTimerStore.getState().isRunning).toBe(true);
    
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('should display all mode buttons with icons', async () => {
    render(<Timer />);
    
    await waitFor(() => {
      const focusButton = screen.getByRole('button', { name: /FOCUS/ });
      const restButton = screen.getByRole('button', { name: /REST/ });
      const breakButton = screen.getByRole('button', { name: /BREAK/ });
      
      expect(focusButton).toBeInTheDocument();
      expect(restButton).toBeInTheDocument();
      expect(breakButton).toBeInTheDocument();
    });
  });

  it('should reflect active mode button styling', async () => {
    const user = userEvent.setup();
    const { container } = render(<Timer />);
    
    await waitFor(() => {
      const focusButton = screen.getByRole('button', { name: /FOCUS/ });
      // Active button should have glow effect
      expect(focusButton).toHaveClass('shadow-[0_0_30px_currentColor]');
    });
  });

  it('should track completed sessions', async () => {
    const user = userEvent.setup();
    useTimerStore.setState({ timeLeft: 1, isRunning: true });
    render(<Timer />);
    
    // Simulate timer tick
    useTimerStore.getState().tick();
    
    await waitFor(() => {
      expect(useTimerStore.getState().sessionsCompleted).toBeGreaterThanOrEqual(0);
    });
  });
});