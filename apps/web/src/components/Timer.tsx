"use client";

import { useEffect, useRef } from "react";
import { useTimerStore, formatTime } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionHistory } from "@/components/SessionHistory";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { Play, Pause, RotateCcw, Zap, Coffee, Moon } from "lucide-react";

export type TimerMode = "work" | "shortBreak" | "longBreak";

const ACTIVE_MODE_TAB_CLASSES: Record<TimerMode, string> = {
  work: "bg-neon-cyan text-dark-bg shadow-[0_0_20px_rgba(0,245,255,0.4)]",
  shortBreak: "bg-neon-green text-dark-bg shadow-[0_0_20px_rgba(0,255,136,0.4)]",
  longBreak: "bg-neon-pink text-dark-bg shadow-[0_0_20px_rgba(255,0,170,0.4)]",
};

export function Timer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mode = useTimerStore((s) => s.mode);
  const timeLeft = useTimerStore((s) => s.timeLeft);
  const isRunning = useTimerStore((s) => s.isRunning);
  const alarmActive = useTimerStore((s) => s.alarmActive);
  const sessionsCompleted = useTimerStore((s) => s.sessionsCompleted);
  const initialized = useTimerStore((s) => s.initialized);
  const start = useTimerStore((s) => s.start);
  const pause = useTimerStore((s) => s.pause);
  const reset = useTimerStore((s) => s.reset);
  const setMode = useTimerStore((s) => s.setMode);
  const initTimer = useTimerStore((s) => s.initialize);
  const settings = useTimerStore((s) => s.settings);
  const lastCompletion = useTimerStore((s) => s.lastCompletion);
  const acknowledgeCompletion = useTimerStore((s) => s.acknowledgeCompletion);

  const sessionsInitialized = useSessionStore((s) => s.initialized);
  const addSession = useSessionStore((s) => s.addSession);
  const initSessions = useSessionStore((s) => s.initialize);

  useEffect(() => {
    initTimer();
    initSessions();
  }, [initTimer, initSessions]);

  useEffect(() => {
    if (!isRunning) return;
    
    // Interval only depends on isRunning. tick() handles the rest.
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

  const handleStart = () => {
    start();
  };

  const handleReset = () => {
    reset();
  };

  const handleModeChange = (nextMode: TimerMode) => {
    setMode(nextMode);
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
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
    <div className="w-full max-w-xl mx-auto px-6 space-y-10">
      <audio
        ref={audioRef}
        src={alarmUrl}
        loop
        preload="auto"
      />
      
      <Panel glow={modeConfig[mode].color} className="p-8 sm:p-12">
        <div className="flex justify-center gap-2 mb-10">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleModeChange(m)}
              aria-pressed={mode === m}
              aria-label={`${modeConfig[m].label} mode`}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-wider
                transition-all duration-300
                ${mode === m
                  ? ACTIVE_MODE_TAB_CLASSES[m]
                  : 'bg-dark-surface text-text-dim hover:text-text-primary border border-white/5'}
              `}
            >
              {modeConfig[m].icon}
              <span>{modeConfig[m].label}</span>
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center mb-10">
          <svg className="w-64 h-64 sm:w-72 sm:h-72 -rotate-90" viewBox="0 0 120 120">
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

        <div className={`flex items-center justify-center gap-3 mb-10 ${alarmActive ? 'text-neon-red animate-pulse' : isRunning ? 'text-neon-green' : 'text-text-dim'}`}>
          <span className={`w-2 h-2 rounded-full ${alarmActive ? 'bg-neon-red animate-pulse' : isRunning ? 'bg-neon-green animate-pulse' : 'bg-text-dim'}`} />
          <span className="text-xs font-black uppercase tracking-widest">
            {alarmActive ? "Alarm - Click Start" : isRunning ? "Running" : "Paused"}
          </span>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            variant="primary"
            colorScheme={modeConfig[mode].color}
            size="lg"
            onClick={() => isRunning ? pause() : handleStart()}
            className="min-w-[140px]"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isRunning ? "Pause" : "Start"}</span>
          </Button>
          <Button
            variant="secondary"
            colorScheme="cyan"
            size="lg"
            onClick={handleReset}
            aria-label="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-10 pt-8 border-t border-white/5">
          <span className="text-xs font-black uppercase tracking-widest text-text-dim">Sessions</span>
          <span className="text-3xl font-black text-neon-yellow">{sessionsCompleted}</span>
          <span className="text-xl">🍅</span>
        </div>

        <div className="flex justify-center mt-8">
          <SettingsPanel />
        </div>
      </Panel>

      <SessionHistory />
    </div>
  );
}
