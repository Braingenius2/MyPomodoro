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

const SETTING_FIELDS = [
  { label: "Focus Time (minutes)", color: "cyan" as const, min: 5, max: 60, key: "workDuration" as const },
  { label: "Short Rest (minutes)", color: "green" as const, min: 1, max: 15, key: "shortBreakDuration" as const },
  { label: "Long Break (minutes)", color: "pink" as const, min: 10, max: 45, key: "longBreakDuration" as const },
  { label: "Long Break Every (sessions)", color: "yellow" as const, min: 2, max: 8, key: "longBreakInterval" as const },
];

const TOGGLE_FIELDS = [
  { key: "autoStartBreaks" as const, label: "Auto Start Rest", color: "green" as const },
  { key: "autoStartPomodoros" as const, label: "Auto Start Focus", color: "cyan" as const },
];

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Panel variant="secondary" size="md" className="w-full max-w-md shadow-2xl shadow-neon-pink/40">
        <CornerDecoration position="top-left" color="pink" size="lg" />
        <CornerDecoration position="bottom-right" color="pink" size="lg" />

        {/* Header */}
        <div className="flex justify-between items-center gap-4 mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-neon-pink uppercase tracking-widest">⚙ OPTIONS</h2>
          <button 
            onClick={handleCancel} 
            className="p-2 hover:bg-neon-pink/20 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-neon-pink"
            aria-label="Close settings"
          >
            <X className="w-6 h-6 text-neon-pink" />
          </button>
        </div>

        {/* Settings Fields */}
        <div className="space-y-8">
          {SETTING_FIELDS.map(({ label, color, min, max, key }) => (
            <div key={key}>
              <label className={`block text-base font-bold mb-4 uppercase tracking-wider text-neon-${color}`}>
                {label}
              </label>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <RangeInput 
                    min={min} 
                    max={max} 
                    value={localSettings[key]} 
                    onChange={(e) => setLocalSettings({...localSettings, [key]: parseInt(e.target.value)})} 
                    color={color}
                  />
                </div>
                <span className={`w-20 text-center font-black text-2xl text-neon-${color} bg-dark-bg py-2 rounded-lg border-2 border-neon-${color} shadow-md`}>
                  {localSettings[key]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Toggle Options */}
        <div className="flex flex-col gap-4 pt-8 border-t-2 border-gray-700">
          {TOGGLE_FIELDS.map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-4 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={localSettings[key]}
                onChange={(e) => setLocalSettings({...localSettings, [key]: e.target.checked})} 
                className={`w-6 h-6 accent-neon-${color} cursor-pointer`}
              />
              <span className={`font-bold text-base text-neon-${color} uppercase tracking-wide group-hover:opacity-80 transition-opacity`}>
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12">
          <Button 
            variant="control" 
            colorScheme="pink" 
            onClick={handleSave} 
            className="flex-1 py-4 font-black uppercase tracking-wider"
          >
            SAVE
          </Button>
          <button 
            onClick={handleCancel} 
            className="flex-1 px-6 py-4 bg-dark-panel text-text-dim font-black uppercase tracking-wider rounded-xl border-2 border-gray-700 hover:border-text-dim hover:bg-dark-panel/80 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-pink"
          >
            CANCEL
          </button>
        </div>
      </Panel>
    </div>
  );
}
