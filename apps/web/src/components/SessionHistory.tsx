"use client";

import { useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { Panel } from "@/components/ui/Panel";
import { Trash2 } from "lucide-react";

export function SessionHistory() {
  const sessions = useSessionStore((state) => state.sessions);
  const clearSessions = useSessionStore((state) => state.clearSessions);
  const initialized = useSessionStore((state) => state.initialized);

  const recentSessions = useMemo(() => {
    const sessionList = Array.isArray(sessions) ? sessions : [];
    return sessionList.slice(0, 8);
  }, [sessions]);

  const stats = useMemo(() => {
    const sessionList = recentSessions;
    const workCount = sessionList.filter((s) => s.type === "work").length;
    const shortBreakCount = sessionList.filter((s) => s.type === "shortBreak").length;
    const longBreakCount = sessionList.filter((s) => s.type === "longBreak").length;
    const totalWorkDuration = sessionList
      .filter((s) => s.type === "work")
      .reduce((acc, s) => acc + s.duration, 0);
    return { workCount, shortBreakCount, longBreakCount, totalWorkDuration };
  }, [recentSessions]);

  if (!initialized) {
    return (
      <Panel className="p-8">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
      </Panel>
    );
  }

  const { workCount, shortBreakCount, longBreakCount, totalWorkDuration } = stats;
  const hours = Math.floor(totalWorkDuration / 60);
  const minutes = totalWorkDuration % 60;

  return (
    <Panel glow="yellow" className="p-6 sm:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-text-dim">
          Recent Sessions
        </h3>
        {recentSessions.length > 0 && (
          <div className="px-4 py-2 bg-dark-bg rounded-full border border-neon-yellow/30">
            <span className="text-lg font-black text-neon-yellow">
              {hours > 0 && `${hours}h `}{minutes}m
            </span>
          </div>
        )}
      </div>

      {recentSessions.length > 0 ? (
        <>
          <div className="flex justify-center items-center gap-6 sm:gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-neon-cyan" style={{ textShadow: '0 0 20px rgba(0,245,255,0.5)' }}>
                {workCount}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-text-dim mt-1">Focus</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-neon-green" style={{ textShadow: '0 0 20px rgba(0,255,136,0.5)' }}>
                {shortBreakCount}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-text-dim mt-1">Short</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-neon-pink" style={{ textShadow: '0 0 20px rgba(255,0,170,0.5)' }}>
                {longBreakCount}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-text-dim mt-1">Long</div>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-2 mb-6">
            {recentSessions.map((session, idx) => (
              <div
                key={session.id || idx}
                className={`
                  aspect-square rounded-lg flex items-center justify-center
                  text-xs font-black transition-all duration-300 hover:scale-110 hover:z-10
                  ${session.type === "work"
                    ? "bg-neon-cyan text-dark-bg shadow-[0_0_10px_rgba(0,245,255,0.4)]"
                    : session.type === "shortBreak"
                      ? "bg-neon-green text-dark-bg shadow-[0_0_10px_rgba(0,255,136,0.4)]"
                      : "bg-neon-pink text-dark-bg shadow-[0_0_10px_rgba(255,0,170,0.4)]"
                  }
                `}
                title={`${session.duration} min - ${session.type === 'work' ? 'Focus' : session.type === 'shortBreak' ? 'Short Rest' : 'Long Break'}`}
              >
                {session.duration}
              </div>
            ))}
          </div>

          <button
            onClick={clearSessions}
            className="w-full flex items-center justify-center gap-2 py-4 text-xs font-black uppercase tracking-widest text-text-dim hover:text-neon-pink border-t border-white/5 hover:border-neon-pink/30 transition-all mt-4"
            aria-label="Clear all sessions"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </>
      ) : (
        <div className="text-center py-8 text-sm text-text-dim font-black tracking-wider">
          No sessions yet. Start focusing!
        </div>
      )}
    </Panel>
  );
}
