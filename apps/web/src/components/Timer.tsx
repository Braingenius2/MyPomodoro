"use client";

import { useEffect, useState } from "react";
import { useTimerStore, formatTime } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionHistory } from "@/components/SessionHistory";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { CornerDecoration } from "@/components/ui/CornerDecoration";
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
    work: { label: "FOCUS", icon: <Zap className="w-6 h-6" />, color: "cyan" },
    shortBreak: { label: "REST", icon: <Coffee className="w-6 h-6" />, color: "green" },
    longBreak: { label: "BREAK", icon: <Moon className="w-6 h-6" />, color: "pink" },
  };

  const totalDuration = mode === "work" ? settings.workDuration * 60 : mode === "shortBreak" ? settings.shortBreakDuration * 60 : settings.longBreakDuration * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;
  const progressColor = { work: "#00f5ff", shortBreak: "#00ff88", longBreak: "#ff00aa" }[mode];

  if (!ready) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-dark-bg">
        <Panel variant="primary" size="lg" className="w-[90vw] max-w-2xl text-center">
          <div className="text-4xl text-neon-cyan font-black tracking-widest mb-12">INITIALIZING...</div>
          <div className="flex justify-center gap-4">
            <div className="w-4 h-4 bg-neon-cyan rounded animate-pulse" />
            <div className="w-4 h-4 bg-neon-cyan rounded animate-pulse" style={{animationDelay: '0.2s'}} />
            <div className="w-4 h-4 bg-neon-cyan rounded animate-pulse" style={{animationDelay: '0.4s'}} />
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 md:py-16 flex flex-col items-center">
      
      {/* ═════════════════════════════════════════
          HEADER SECTION
          ═════════════════════════════════════════ */}
      <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase text-text-primary mb-4">MY POMODORO</h1>
          <div className="h-1.5 sm:h-2 w-48 sm:w-64 mx-auto bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-yellow rounded-full" />
        </div>

        {/* ═════════════════════════════════════════
            MAIN TIMER PANEL
            ═════════════════════════════════════════ */}
        <Panel variant="primary" size="xl" className="w-full mb-12 sm:mb-16">
          <CornerDecoration position="top-left" color="cyan" size="lg" />
          <CornerDecoration position="bottom-right" color="cyan" size="lg" />

          {/* Mode Selection Row */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-12">
            {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
              <Button 
                key={m} 
                variant="mode" 
                colorScheme={modeConfig[m].color} 
                isActive={mode === m} 
                onClick={() => setMode(m)} 
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base"
              >
                {modeConfig[m].icon}
                <span className="ml-2 font-black">{modeConfig[m].label}</span>
              </Button>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-3 sm:h-4 rounded-full bg-dark-panel border-2 border-gray-700 overflow-hidden mb-12 shadow-inner">
            <div 
              className="h-full rounded-full transition-all duration-1000" 
              style={{ 
                width: `${progress}%`, 
                background: progressColor, 
                boxShadow: `0 0 20px ${progressColor}` 
              }} 
            />
          </div>

          {/* Time Display Section */}
          <div className="text-center mb-12 space-y-4">
            <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-neon-cyan leading-none tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <div className="text-base sm:text-lg md:text-xl font-black tracking-widest text-text-dim uppercase">
              {mode === "work" ? "FOCUS TIME" : mode === "shortBreak" ? "SHORT REST" : "LONG BREAK"}
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`flex justify-center items-center gap-3 sm:gap-4 px-6 sm:px-8 py-3 sm:py-4 rounded-xl mb-12 transition-all ${isRunning ? "bg-neon-green/10 border-2 border-neon-green text-neon-green" : "border-2 border-text-dim text-text-dim"}`}>
            <span className={`w-3 h-3 rounded-full ${isRunning ? "bg-neon-green animate-pulse" : "bg-text-dim"}`} />
            <span className="font-black tracking-widest uppercase text-sm sm:text-base">{isRunning ? "▶ ACTIVE" : "⏸ PAUSED"}</span>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-12">
            <Button 
              variant="control" 
              colorScheme={modeConfig[mode].color} 
              onClick={() => isRunning ? pause() : start()} 
              className="px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg flex items-center justify-center gap-2"
            >
              {isRunning ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
              <span>{isRunning ? "PAUSE" : "START"}</span>
            </Button>
            <Button 
              variant="control" 
              colorScheme="cyan" 
              onClick={reset} 
              className="px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>RESET</span>
            </Button>
          </div>

          {/* Completed Sessions Score */}
          <div className="flex justify-center items-center gap-4 sm:gap-6 py-6 sm:py-8 px-4 border-t-2 border-b-2 border-gray-700 mb-8">
            <span className="font-black tracking-widest text-text-dim uppercase text-xs sm:text-sm">Sessions</span>
            <span className="text-5xl sm:text-6xl">🍅</span>
            <span className="text-4xl sm:text-5xl font-black text-neon-yellow">{sessionsCompleted}</span>
          </div>

          {/* Settings Button */}
          <div className="flex justify-center">
            <SettingsPanel />
          </div>
        </Panel>

        {/* ═════════════════════════════════════════
            SESSION HISTORY PANEL
            ═════════════════════════════════════════ */}
        <SessionHistory />
    </div>
  );
}
