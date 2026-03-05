"use client";

import { useState, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { Panel } from "@/components/ui/Panel";
import { Trash2 } from "lucide-react";

export function SessionHistory() {
  const sessions = useSessionStore((state) => state.sessions);
  const clearSessions = useSessionStore((state) => state.clearSessions);
  const initialized = useSessionStore((state) => state.initialized);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const todayStats = useMemo(() => {
    const sessionList = Array.isArray(sessions) ? sessions : [];
    const todaySessions = sessionList.filter((s) => new Date(s.completedAt).toDateString() === new Date().toDateString());
    const totalWorkToday = todaySessions.filter((s) => s.type === "work").reduce((acc, s) => acc + s.duration, 0);
    return { todaySessions, totalWorkToday };
  }, [sessions]);

  const isReady = mounted && initialized;

  if (!isReady) {
    return (
      <Panel className="p-8">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
      </Panel>
    );
  }

  const { todaySessions, totalWorkToday } = todayStats;
  const workCount = todaySessions.filter(s => s.type === "work").length;
  const restCount = todaySessions.filter(s => s.type !== "work").length;

  const hours = Math.floor(totalWorkToday / 60);
  const minutes = totalWorkToday % 60;

  return (
    <Panel glow="yellow" className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-dim">
          Today's Log
        </h3>
        <div className="px-4 py-2 bg-dark-bg rounded-full border border-neon-yellow/30">
          <span className="text-lg font-black text-neon-yellow">
            {hours > 0 && `${hours}h `}{minutes}m
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex justify-center items-center gap-8 sm:gap-12 mb-8">
        <div className="text-center">
          <div className="text-5xl sm:text-6xl font-black text-neon-cyan" style={{ textShadow: '0 0 20px rgba(0,245,255,0.5)' }}>
            {workCount}
          </div>
          <div className="text-xs font-black uppercase tracking-wider text-text-dim mt-2">Focus</div>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <div className="text-5xl sm:text-6xl font-black text-neon-green" style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
            {restCount}
          </div>
          <div className="text-xs font-black uppercase tracking-wider text-text-dim mt-2">Rest</div>
        </div>
      </div>

      {/* Session Grid */}
      {todaySessions.length > 0 && (
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2 mb-6">
          {todaySessions.slice(0, 30).map((session, idx) => (
            <div 
              key={session.id || idx} 
              className={`
                aspect-square rounded-lg sm:rounded-xl flex items-center justify-center 
                text-xs font-black transition-all duration-300 hover:scale-110 hover:z-10
                ${session.type === "work" 
                  ? "bg-neon-cyan text-dark-bg shadow-[0_0_10px_rgba(0,245,255,0.4)]" 
                  : "bg-neon-green text-dark-bg shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                }
              `}
              title={`${session.duration} min - ${session.type}`}
            >
              {session.duration}
            </div>
          ))}
        </div>
      )}

      {todaySessions.length === 0 && (
        <div className="text-center py-8 text-sm text-text-dim font-black tracking-wider">
          No sessions yet. Start focusing!
        </div>
      )}

      {/* Clear Button */}
      {todaySessions.length > 0 && (
        <button 
          onClick={clearSessions} 
          className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-text-dim hover:text-neon-pink border-t border-white/5 hover:border-neon-pink/30 transition-all mt-4"
          aria-label="Clear all sessions"
        >
          <Trash2 className="w-4 h-4" /> 
          <span>Clear Data</span>
        </button>
      )}
    </Panel>
  );
}
