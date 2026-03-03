"use client";

import { useEffect, useState } from "react";
import { useTimerStore, formatTime } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";
import { SettingsPanel } from "@/components/SettingsPanel";
import { SessionHistory } from "@/components/SessionHistory";
import { Play, Pause, RotateCcw } from "lucide-react";

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

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick, timeLeft]);

  useEffect(() => {
    if (!ready) return;
    if (timeLeft === 0 && mode === "work") {
      addSession({
        type: mode,
        duration: settings.workDuration,
      });
    }
  }, [ready, timeLeft, mode, settings, addSession]);

  const modeConfig: Record<TimerMode, { label: string; gradient: string; shadow: string }> = {
    work: { 
      label: "Focus Time", 
      gradient: "from-red-500 via-rose-500 to-orange-500",
      shadow: "shadow-red-500/30"
    },
    shortBreak: { 
      label: "Short Break", 
      gradient: "from-green-400 via-emerald-500 to-teal-500",
      shadow: "shadow-green-500/30"
    },
    longBreak: { 
      label: "Long Break", 
      gradient: "from-blue-400 via-indigo-500 to-purple-500",
      shadow: "shadow-blue-500/30"
    },
  };

  if (!ready) {
    return (
      <div className="flex flex-col items-center gap-8">
        <div className="flex gap-3">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <div
              key={m}
              className="px-6 py-3 rounded-2xl bg-white/50 backdrop-blur-sm"
            >
              {modeConfig[m].label}
            </div>
          ))}
        </div>
        <div className="text-9xl font-bold text-white drop-shadow-lg">25:00</div>
        <div className="flex gap-4">
          <div className="px-10 py-4 bg-white/50 rounded-2xl text-xl font-bold">Start</div>
          <div className="px-10 py-4 bg-white/50 rounded-2xl text-xl font-bold">Reset</div>
        </div>
        <div className="text-white/70">Sessions: 0</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode Selector */}
      <div className="flex gap-3 p-2 bg-white/30 backdrop-blur-md rounded-2xl">
        {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              mode === m
                ? `bg-gradient-to-r ${modeConfig[m].gradient} text-white shadow-lg ${modeConfig[m].shadow}`
                : "text-white/70 hover:text-white hover:bg-white/20"
            }`}
          >
            {modeConfig[m].label}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <div className={`relative p-12 rounded-3xl bg-gradient-to-br ${modeConfig[mode].gradient} shadow-2xl ${modeConfig[mode].shadow} transform transition-all duration-500 ${isRunning ? 'scale-105' : 'scale-100'}`}>
        <div className="absolute inset-0 bg-white/20 rounded-3xl" />
        <div className="relative text-[7rem] font-black text-white drop-shadow-lg leading-none tracking-tight">
          {formatTime(timeLeft)}
        </div>
        {isRunning && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full animate-pulse shadow-lg" />
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={isRunning ? pause : start}
          className={`flex items-center gap-3 px-10 py-5 bg-gradient-to-r ${modeConfig[mode].gradient} text-white rounded-2xl text-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-xl ${modeConfig[mode].shadow}`}
        >
          {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-8 py-5 bg-white/80 text-gray-700 rounded-2xl text-xl font-bold hover:bg-white hover:scale-105 active:scale-95 transition-all shadow-lg"
        >
          <RotateCcw className="w-6 h-6" />
          Reset
        </button>
      </div>

      {/* Session Counter */}
      <div className="flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full">
        <span className="text-2xl">🍅</span>
        <span className="text-xl font-bold text-white">
          {sessionsCompleted} {sessionsCompleted === 1 ? 'session' : 'sessions'} completed
        </span>
      </div>

      {/* Settings */}
      <SettingsPanel />

      {/* History */}
      <SessionHistory />
    </div>
  );
}
