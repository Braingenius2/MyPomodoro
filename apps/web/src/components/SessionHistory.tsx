"use client";

import { useState, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { Panel } from "@/components/ui/Panel";
import { CornerDecoration } from "@/components/ui/CornerDecoration";
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
      <Panel variant="primary" size="md" className="w-full">
        <div className="h-8 w-48 bg-gray-700 rounded animate-pulse" />
      </Panel>
    );
  }

  const { todaySessions, totalWorkToday } = todayStats;
  const workCount = todaySessions.filter(s => s.type === "work").length;

  return (
    <Panel variant="primary" size="md" className="shadow-xl shadow-neon-yellow/20">
      <CornerDecoration position="top-left" color="yellow" size="md" />
      <CornerDecoration position="bottom-right" color="yellow" size="md" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <h3 className="text-2xl sm:text-3xl font-black uppercase text-text-dim tracking-widest">📊 TODAY'S LOG</h3>
        <div className="px-6 py-3 bg-dark-bg border-2 border-neon-yellow text-neon-yellow font-black text-xl sm:text-2xl rounded-lg shadow-md shadow-neon-yellow/30 whitespace-nowrap">
          {Math.round(totalWorkToday / 60)}h {totalWorkToday % 60}m
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 mb-10 pb-8 sm:pb-10 border-b-2 border-gray-700">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-black text-neon-yellow drop-shadow-lg">{workCount}</div>
          <div className="text-sm font-black text-text-dim mt-3 uppercase tracking-wider">Focus Sessions</div>
        </div>
        <div className="hidden sm:block w-0.5 h-16 bg-gradient-to-b from-transparent via-gray-700 to-transparent" />
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-black text-neon-green drop-shadow-lg">{todaySessions.filter(s => s.type !== "work").length}</div>
          <div className="text-sm font-black text-text-dim mt-3 uppercase tracking-wider">Rest Sessions</div>
        </div>
      </div>

      {/* Session Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2.5 mb-8">
        {todaySessions.length > 0 ? (
          todaySessions.slice(0, 40).map((session, idx) => (
            <div 
              key={session.id || idx} 
              className={`aspect-square rounded-lg sm:rounded-xl flex items-center justify-center text-sm sm:text-base font-bold transition-all duration-200 hover:scale-110 ${
                session.type === "work" 
                  ? "bg-neon-cyan text-dark-bg shadow-md shadow-neon-cyan/50" 
                  : "bg-neon-green text-dark-bg shadow-md shadow-neon-green/50"
              }`}
            >
              {session.duration}
            </div>
          ))
        ) : (
          <div className="col-span-4 sm:col-span-6 md:col-span-8 lg:col-span-10 text-center py-12 text-lg text-text-dim font-black tracking-wider">▮▮ NO DATA - START FOCUSING! ▮▮</div>
        )}
      </div>

      {/* Clear Button */}
      {todaySessions.length > 0 && (
        <button 
          onClick={clearSessions} 
          className="w-full flex items-center justify-center gap-3 py-5 text-sm text-text-dim hover:text-neon-pink font-black uppercase tracking-widest border-t-2 border-gray-700 hover:border-neon-pink hover:bg-neon-pink/5 transition-all rounded-b-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-yellow"
          aria-label="Clear all sessions"
        >
          <Trash2 className="w-5 h-5" /> 
          <span>CLEAR DATA</span>
        </button>
      )}
    </Panel>
  );
}
