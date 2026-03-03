"use client";

import { useState, useEffect, useMemo } from "react";
import { useSessionStore } from "@/store/sessionStore";
import { Trash2 } from "lucide-react";

export function SessionHistory() {
  const sessions = useSessionStore((state) => state.sessions);
  const clearSessions = useSessionStore((state) => state.clearSessions);
  const initialized = useSessionStore((state) => state.initialized);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStats = useMemo(() => {
    const sessionList = Array.isArray(sessions) ? sessions : [];
    const todaySessions = sessionList.filter((s) => {
      const sessionDate = new Date(s.completedAt);
      const today = new Date();
      return sessionDate.toDateString() === today.toDateString();
    });

    const totalWorkToday = todaySessions
      .filter((s) => s.type === "work")
      .reduce((acc, s) => acc + s.duration, 0);

    return { todaySessions, totalWorkToday };
  }, [sessions]);

  const isReady = mounted && initialized;

  if (!isReady) {
    return (
      <div className="mt-6 w-full max-w-md">
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-5">
          <div className="flex justify-between items-center mb-3">
            <div className="h-5 bg-white/50 rounded w-32"></div>
            <div className="h-5 bg-white/50 rounded w-20"></div>
          </div>
          <div className="h-12 bg-white/50 rounded w-full"></div>
        </div>
      </div>
    );
  }

  const { todaySessions, totalWorkToday } = todayStats;

  return (
    <div className="mt-6 w-full max-w-md">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg text-gray-800">
            ✨ Today&apos;s Progress
          </h3>
          <span className="px-4 py-1 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-bold rounded-full text-sm">
            {Math.round(totalWorkToday / 60)}h {totalWorkToday % 60}m
          </span>
        </div>

        {/* Tomato Visual */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="text-[5rem] leading-none filter drop-shadow-lg animate-bounce-slow">
              🍅
            </div>
            <div className="absolute -top-1 -right-2 w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              {todaySessions.filter(s => s.type === "work").length}
            </div>
          </div>
        </div>

        {/* Session Dots */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {todaySessions.length > 0 ? (
            todaySessions.slice(0, 20).map((session, idx) => (
              <div
                key={session.id || idx}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transform hover:scale-110 transition-transform cursor-default ${
                  session.type === "work"
                    ? "bg-gradient-to-br from-rose-400 to-red-500 text-white"
                    : "bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                }`}
                title={`${session.type === "work" ? "Focus" : "Break"} - ${session.duration}min`}
              >
                {session.duration}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No sessions yet. Start focusing! 🎯</p>
          )}
        </div>

        {todaySessions.length > 0 && (
          <button
            onClick={clearSessions}
            className="w-full mt-2 flex items-center justify-center gap-2 py-2 text-gray-500 hover:text-red-500 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Clear history
          </button>
        )}
      </div>
    </div>
  );
}
