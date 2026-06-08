"use client";

import { Timer } from "@/components/Timer";
import { TaskList } from "@/components/TaskList";
import { useTimerStore } from "@/store/timerStore";

export default function Home() {
  const focusMode = useTimerStore((s) => s.focusMode);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Glass Navbar */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-xl bg-dark-bg/80 border-b border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ${focusMode ? 'py-2' : ''}`}>
        <div className="max-w-[1400px] mx-auto px-4 py-5 text-center">
          <h1 className={`font-black uppercase tracking-[0.2em] text-text-primary drop-shadow-[0_0_15px_rgba(0,245,255,0.2)] transition-all duration-300 ${focusMode ? 'text-lg' : 'text-2xl sm:text-3xl'}`}>
            My Pomodoro
          </h1>
          <div className="h-[2px] w-24 mx-auto mt-2 bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
        </div>
      </header>

      {/* Main Content - Timer and TaskList */}
      <main className="flex-1 max-w-[1400px] mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          <div className={`flex justify-center w-full ${focusMode ? 'xl:col-span-12' : 'xl:col-span-8'}`}>
            <Timer />
          </div>
          {!focusMode && (
            <div className="xl:col-span-4 lg:sticky lg:top-28 w-full max-w-xl mx-auto xl:mx-0 mt-4 xl:mt-0">
              <TaskList />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
