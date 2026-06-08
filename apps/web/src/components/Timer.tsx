"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTimerStore, formatTime } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionHistory } from "@/components/SessionHistory";
import { FocusTaskBar } from "@/components/FocusTask";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Play, Pause, RotateCcw, Zap, Coffee, Moon, Maximize2, Minimize2 } from "lucide-react";

export type TimerMode = "work" | "shortBreak" | "longBreak";

const ACTIVE_MODE_TAB_CLASSES: Record<TimerMode, string> = {
  work: "bg-neon-cyan text-dark-bg shadow-[0_0_20px_rgba(0,245,255,0.4)]",
  shortBreak: "bg-neon-green text-dark-bg shadow-[0_0_20px_rgba(0,255,136,0.4)]",
  longBreak: "bg-neon-pink text-dark-bg shadow-[0_0_20px_rgba(255,0,170,0.4)]",
};

export function Timer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mode = useTimerStore((s) => s.mode);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const isRunning = useTimerStore((s) => s.isRunning);
  const alarmActive = useTimerStore((s) => s.alarmActive);
  const sessionsCompleted = useTimerStore((s) => s.sessionsCompleted);
  const initialized = useTimerStore((s) => s.initialized);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const quickStart = useTimerStore((s) => s.quickStart);
  const setMode = useTimerStore((s) => s.setMode);
  const initTimer = useTimerStore((s) => s.initialize);
  const settings = useTimerStore((s) => s.settings);
  const lastCompletion = useTimerStore((s) => s.lastCompletion);
  const acknowledgeCompletion = useTimerStore((s) => s.acknowledgeCompletion);

  const sessionsInitialized = useSessionStore((s) => s.initialized);
  const addSession = useSessionStore((s) => s.addSession);
  const initSessions = useSessionStore((s) => s.initialize);

  const isFocusSession = mode === "work" && isRunning;

  useEffect(() => {
    initTimer();
    initSessions();
  }, [initTimer, initSessions]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      useTimerStore.getState().tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (!initialized || !sessionsInitialized || !lastCompletion) {
      return;
    }

    try {
      if (typeof window !== "undefined") {
        if (!lastCompletion.autoStarted && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("My Pomodoro", {
            body:
              lastCompletion.completedMode === "work"
                ? "Session completed! Take a break."
                : "Break is over! Time to focus.",
          });
        }
      }
    } catch {}

    addSession({
      type: lastCompletion.completedMode,
      duration: lastCompletion.duration,
    });
    acknowledgeCompletion();
  }, [
    initialized,
    sessionsInitialized,
    lastCompletion,
    addSession,
    acknowledgeCompletion,
  ]);

  useEffect(() => {
    if (!alarmActive && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [alarmActive]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const modeConfig: Record<TimerMode, { label: string; icon: React.ReactNode; color: "cyan" | "green" | "pink" }> = {
    work: { label: "Focus", icon: <Zap className="w-5 h-5" />, color: "cyan" },
    shortBreak: { label: "Rest", icon: <Coffee className="w-5 h-5" />, color: "green" },
    longBreak: { label: "Break", icon: <Moon className="w-5 h-5" />, color: "pink" },
  };

  const totalDuration =
    mode === "work"
      ? settings.workDuration * 60
      : mode === "shortBreak"
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60;
  const progress = totalDuration > 0 ? Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100)) : 0;

  const colorValues = {
    work: "#00f5ff",
    shortBreak: "#00ff88",
    longBreak: "#ff00aa",
  };
  const progressColor = colorValues[mode];

  const alarmUrl = "https://actions.google.com/sounds/v1/alarms/beep_short.ogg";
  const ready = initialized && sessionsInitialized;

  if (!ready) {
    return (
      <div className="w-full max-w-xl mx-auto px-6">
        <Panel className="w-full p-12 text-center">
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
    <div className="w-full max-w-xl mx-auto px-6 space-y-6">
      <audio
        ref={audioRef}
        src={alarmUrl}
        loop
        preload="auto"
      />

      <FocusTaskBar isFocusSession={isFocusSession} />

      <Panel glow={modeConfig[mode].color} className={`p-8 sm:p-12 ${isFocusSession ? 'pt-6' : ''}`}>
        {/* Quick Start / Mode Tabs */}
        {!isFocusSession && (
          <div className="mb-6">
            <button
              type="button"
              onClick={quickStart}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border border-neon-green/40 text-neon-green font-black text-sm uppercase tracking-wider hover:brightness-110 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] transition-all duration-300 active:scale-[0.98] mb-4"
            >
              <Zap className="w-5 h-5" />
              <span>Quick Start 5 min</span>
            </button>

            <div className="flex justify-center gap-2">
              {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  aria-label={`${modeConfig[m].label} mode`}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider
                    transition-all duration-300
                    ${mode === m
                      ? ACTIVE_MODE_TAB_CLASSES[m]
                      : 'bg-dark-surface text-text-dim hover:text-text-primary border border-white/5'}
                  `}
                >
                  {modeConfig[m].icon}
                  <span className="hidden sm:inline">{modeConfig[m].label}</span>
                  <span className="sm:hidden">
                    {m === "work" ? `${settings.workDuration}m` : m === "shortBreak" ? `${settings.shortBreakDuration}m` : `${settings.longBreakDuration}m`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative flex items-center justify-center mb-8">
          <svg className={`${isFullscreen ? 'w-80 h-80' : isFocusSession ? 'w-72 h-72 sm:w-80 sm:h-80' : 'w-64 h-64 sm:w-72 sm:h-72'} -rotate-90 transition-all duration-500`} viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="3"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={progressColor}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * progress) / 100}
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 8px ${progressColor})`,
              }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className={`${isFullscreen ? 'text-7xl' : isFocusSession ? 'text-6xl sm:text-7xl' : 'text-5xl sm:text-6xl'} font-black tabular-nums tracking-tight transition-all duration-500`}
              style={{ color: progressColor, textShadow: `0 0 30px ${progressColor}` }}
            >
              {formatTime(timeLeft)}
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim mt-2">
              {mode === "work" ? "Focus Time" : mode === "shortBreak" ? "Short Rest" : "Long Break"}
            </div>
          </div>
        </div>

        <div className={`flex items-center justify-center gap-3 mb-8 ${alarmActive ? 'text-neon-red animate-pulse' : isRunning ? 'text-neon-green' : 'text-text-dim'}`}>
          <span className={`w-2 h-2 rounded-full ${alarmActive ? 'bg-neon-red animate-pulse' : isRunning ? 'bg-neon-green animate-pulse' : 'bg-text-dim'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {alarmActive ? "Alarm - Click Start" : isRunning ? "Running" : "Paused"}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            colorScheme={modeConfig[mode].color}
            size={isFocusSession ? "lg" : "lg"}
            onClick={() => isRunning ? pause() : start()}
            className={`min-w-[140px] ${isFocusSession ? 'scale-110' : ''}`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? "Pause" : "Start"}</span>
          </Button>
          {!isFocusSession && (
            <Button
              variant="secondary"
              colorScheme="cyan"
              size="lg"
              onClick={reset}
              aria-label="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>

        {!isFocusSession && (
          <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-white/5">
            <span className="text-xs font-black uppercase tracking-widest text-text-dim">Sessions</span>
            <span className="text-3xl font-black text-neon-yellow">{sessionsCompleted}</span>
            <span className="text-xl">🍅</span>
          </div>
        )}

        {!isFocusSession && (
          <div className="flex justify-center mt-8">
            <SettingsPanel />
          </div>
        )}
      </Panel>

      {!isFocusSession && <SessionHistory />}

      {/* Fullscreen toggle */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleFullscreenToggle}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-surface/50 border border-white/5 text-text-dim hover:text-neon-cyan transition-colors text-[10px] font-black uppercase tracking-wider"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>
    </div>
  );
}
