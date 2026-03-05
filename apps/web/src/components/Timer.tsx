"use client";

import { useEffect, useState } from "react";
import { useTimerStore, formatTime } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionHistory } from "@/components/SessionHistory";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Play, Pause, RotateCcw, Zap, Coffee, Moon } from "lucide-react";

export type TimerMode = "work" | "shortBreak" | "longBreak";

export function Timer() {
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  const mode = useTimerStore((s) => s.mode);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const isRunning = useTimerStore((s) => s.isRunning);
  const sessionsCompleted = useTimerStore((s) => s.sessionsCompleted);
  const initialized = useTimerStore((s) => s.initialized);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const setMode = useTimerStore((s) => s.setMode);
  const tick = useTimerStore((s) => s.tick);
  const initTimer = useTimerStore((s) => s.initialize);
  const settings = useTimerStore((s) => s.settings);

  const sessionsInitialized = useSessionStore((s) => s.initialized);
  const addSession = useSessionStore((s) => s.addSession);
  const initSessions = useSessionStore((s) => s.initialize);

  useEffect(() => {
    initTimer();
    initSessions();
    setMounted(true);
  }, [initTimer, initSessions]);

  useEffect(() => {
    if (mounted && initialized && sessionsInitialized) {
      setReady(true);
    }
  }, [mounted, initialized, sessionsInitialized]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    const interval = setInterval(() => tick(), 1000);
    return () => clearInterval(interval);
  }, [isRunning, tick, timeLeft]);

  useEffect(() => {
    if (!ready) return;
    if (timeLeft === 0 && mode === "work") {
      addSession({ type: mode, duration: settings.workDuration });
    }
  }, [ready, timeLeft, mode, settings, addSession]);

  const modeConfig: Record<TimerMode, { label: string; icon: React.ReactNode; color: "cyan" | "green" | "pink" }> = {
    work: { label: "Focus", icon: <Zap className="w-5 h-5" />, color: "cyan" },
    shortBreak: { label: "Rest", icon: <Coffee className="w-5 h-5" />, color: "green" },
    longBreak: { label: "Break", icon: <Moon className="w-5 h-5" />, color: "pink" },
  };

  const totalDuration = mode === "work" ? settings.workDuration * 60 : mode === "shortBreak" ? settings.shortBreakDuration * 60 : settings.longBreakDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;
  
  const colorValues = {
    work: "#00f5ff",
    shortBreak: "#00ff88",
    longBreak: "#ff00aa",
  };
  const progressColor = colorValues[mode];

  if (!ready) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-dark-bg">
        <Panel className="w-full max-w-md p-12 text-center">
          <div className="text-2xl text-neon-cyan font-black tracking-widest mb-8">INITIALIZING</div>
          <div className="flex justify-center gap-3">
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" />
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.2s'}} />
            <div className="w-3 h-3 bg-neon-cyan rounded-full animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.2em] text-text-primary">
          My Pomodoro
        </h1>
        <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      </div>

      {/* Main Timer */}
      <Panel glow={modeConfig[mode].color} className="p-8 sm:p-12">
        {/* Mode Tabs */}
        <div className="flex justify-center gap-2 mb-10">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider
                transition-all duration-300
                ${mode === m 
                  ? `bg-${modeConfig[m].color === 'cyan' ? 'neon-cyan' : modeConfig[m].color === 'green' ? 'neon-green' : 'neon-pink'} text-dark-bg shadow-[0_0_20px_rgba(0,245,255,0.4)]` 
                  : 'bg-dark-surface text-text-dim hover:text-text-primary border border-white/5'}
              `}
            >
              {modeConfig[m].icon}
              <span>{modeConfig[m].label}</span>
            </button>
          ))}
        </div>

        {/* Circular Timer */}
        <div className="relative flex items-center justify-center mb-10">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 100 100">
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={progressColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 8px ${progressColor})`,
              }}
            />
          </svg>
          
          {/* Time Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div 
              className="text-6xl sm:text-7xl font-black tabular-nums tracking-tight"
              style={{ color: progressColor, textShadow: `0 0 30px ${progressColor}` }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs font-black uppercase tracking-[0.3em] text-text-dim mt-2">
              {mode === "work" ? "Focus Time" : mode === "shortBreak" ? "Short Rest" : "Long Break"}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={`flex items-center justify-center gap-3 mb-10 ${isRunning ? 'text-neon-green' : 'text-text-dim'}`}>
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-neon-green animate-pulse' : 'bg-text-dim'}`} />
          <span className="text-xs font-black uppercase tracking-widest">
            {isRunning ? "Running" : "Paused"}
          </span>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            colorScheme={modeConfig[mode].color}
            size="lg"
            onClick={() => isRunning ? pause() : start()}
            className="min-w-[140px]"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? "Pause" : "Start"}</span>
          </Button>
          <Button
            variant="secondary"
            colorScheme="cyan"
            size="lg"
            onClick={reset}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        {/* Sessions Counter */}
        <div className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-white/5">
          <span className="text-xs font-black uppercase tracking-widest text-text-dim">Sessions</span>
          <span className="text-3xl font-black text-neon-yellow">{sessionsCompleted}</span>
          <span className="text-xl">🍅</span>
        </div>

        {/* Settings */}
        <div className="flex justify-center mt-8">
          <SettingsPanel />
        </div>
      </Panel>

      {/* Session History */}
      <SessionHistory />
    </div>
  );
}
