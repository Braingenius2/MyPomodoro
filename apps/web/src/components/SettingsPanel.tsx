"use client";

import { useState, useEffect } from "react";
import { useTimerStore, Settings } from "@/store/timerStore";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { RangeInput } from "@/components/ui/RangeInput";
import { CornerDecoration } from "@/components/ui/CornerDecoration";
import { X } from "lucide-react";

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

export function SettingsPanel() {
  const { settings, updateSettings } = useTimerStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setMounted(true);
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setLocalSettings(settings);
    setIsOpen(false);
  };

  if (!mounted) {
    return <Button variant="settings" colorScheme="cyan" className="gap-2" disabled>⚙</Button>;
  }

  if (!isOpen) {
    return (
      <Button variant="settings" colorScheme="cyan" onClick={() => setIsOpen(true)} className="gap-2">
        ⚙
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 md:p-6">
      <Panel variant="secondary" size="md" className="w-full max-w-sm sm:max-w-md md:max-w-lg shadow-2xl shadow-neon-pink/40">
        <CornerDecoration position="top-left" color="pink" size="lg" />
        <CornerDecoration position="bottom-right" color="pink" size="lg" />

        <div className="flex justify-between items-center gap-4 mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neon-pink uppercase tracking-widest">⚙ OPTIONS</h2>
          <button 
            onClick={handleCancel} 
            className="p-2 hover:bg-neon-pink/20 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-neon-pink"
            aria-label="Close settings"
          >
            <X className="w-5 sm:w-6 h-5 sm:h-6 text-neon-pink" />
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div>
            <label className="block text-sm sm:text-base font-bold text-neon-cyan mb-3 sm:mb-4 uppercase tracking-wider">Focus Time (minutes)</label>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-1"><RangeInput min={5} max={60} value={localSettings.workDuration} onChange={(e) => setLocalSettings({...localSettings, workDuration: parseInt(e.target.value)})} color="cyan" /></div>
              <span className="w-16 sm:w-20 text-center font-black text-xl sm:text-2xl text-neon-cyan bg-dark-bg py-2 rounded-lg border-2 border-neon-cyan shadow-md shadow-neon-cyan/30">{localSettings.workDuration}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-neon-green mb-3 sm:mb-4 uppercase tracking-wider">Short Rest (minutes)</label>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-1"><RangeInput min={1} max={15} value={localSettings.shortBreakDuration} onChange={(e) => setLocalSettings({...localSettings, shortBreakDuration: parseInt(e.target.value)})} color="green" /></div>
              <span className="w-16 sm:w-20 text-center font-black text-xl sm:text-2xl text-neon-green bg-dark-bg py-2 rounded-lg border-2 border-neon-green shadow-md shadow-neon-green/30">{localSettings.shortBreakDuration}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-neon-pink mb-3 sm:mb-4 uppercase tracking-wider">Long Break (minutes)</label>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-1"><RangeInput min={10} max={45} value={localSettings.longBreakDuration} onChange={(e) => setLocalSettings({...localSettings, longBreakDuration: parseInt(e.target.value)})} color="pink" /></div>
              <span className="w-16 sm:w-20 text-center font-black text-xl sm:text-2xl text-neon-pink bg-dark-bg py-2 rounded-lg border-2 border-neon-pink shadow-md shadow-neon-pink/30">{localSettings.longBreakDuration}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm sm:text-base font-bold text-neon-yellow mb-3 sm:mb-4 uppercase tracking-wider">Long Break Every (sessions)</label>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex-1"><RangeInput min={2} max={8} value={localSettings.longBreakInterval} onChange={(e) => setLocalSettings({...localSettings, longBreakInterval: parseInt(e.target.value)})} color="yellow" /></div>
              <span className="w-16 sm:w-20 text-center font-black text-xl sm:text-2xl text-neon-yellow bg-dark-bg py-2 rounded-lg border-2 border-neon-yellow shadow-md shadow-neon-yellow/30">{localSettings.longBreakInterval}</span>
            </div>
          </div>

        <div className="flex flex-col gap-3 sm:gap-4 pt-6 sm:pt-8 border-t-2 border-gray-700">
          <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={localSettings.autoStartBreaks} 
              onChange={(e) => setLocalSettings({...localSettings, autoStartBreaks: e.target.checked})} 
              className="w-5 sm:w-6 h-5 sm:h-6 accent-neon-green cursor-pointer" 
            />
            <span className="font-bold text-sm sm:text-base text-neon-green uppercase tracking-wide group-hover:text-neon-green/80 transition-colors">Auto Start Rest</span>
          </label>
          <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
            <input 
              type="checkbox" 
              checked={localSettings.autoStartPomodoros} 
              onChange={(e) => setLocalSettings({...localSettings, autoStartPomodoros: e.target.checked})} 
              className="w-5 sm:w-6 h-5 sm:h-6 accent-neon-cyan cursor-pointer" 
            />
            <span className="font-bold text-sm sm:text-base text-neon-cyan uppercase tracking-wide group-hover:text-neon-cyan/80 transition-colors">Auto Start Focus</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-10 sm:mt-12 md:mt-14">
          <Button 
            variant="control" 
            colorScheme="pink" 
            onClick={handleSave} 
            className="flex-1 py-3 sm:py-4 font-black uppercase tracking-wider"
          >
            SAVE
          </Button>
          <button 
            onClick={handleCancel} 
            className="flex-1 px-6 py-3 sm:py-4 bg-dark-panel text-text-dim font-black uppercase tracking-wider rounded-xl border-2 border-gray-700 hover:border-text-dim hover:bg-dark-panel/80 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-pink"
          >
            CANCEL
          </button>
        </div>
      </Panel>
    </div>
  );
}
