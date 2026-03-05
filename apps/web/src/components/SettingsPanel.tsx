"use client";

import { useState, useEffect } from "react";
import { useTimerStore, Settings } from "@/store/timerStore";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { RangeInput } from "@/components/ui/RangeInput";
import { X, Settings as SettingsIcon } from "lucide-react";

const DEFAULT_SETTINGS: Settings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
};

const SETTING_FIELDS = [
  { label: "Focus", color: "cyan" as const, min: 5, max: 60, key: "workDuration" as const, unit: "min" },
  { label: "Short Rest", color: "green" as const, min: 1, max: 15, key: "shortBreakDuration" as const, unit: "min" },
  { label: "Long Break", color: "pink" as const, min: 10, max: 45, key: "longBreakDuration" as const, unit: "min" },
  { label: "Long Break After", color: "yellow" as const, min: 2, max: 8, key: "longBreakInterval" as const, unit: "sessions" },
];

const TOGGLE_FIELDS = [
  { key: "autoStartBreaks" as const, label: "Auto-start breaks", color: "green" as const },
  { key: "autoStartPomodoros" as const, label: "Auto-start focus", color: "cyan" as const },
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
    return (
      <Button variant="ghost" colorScheme="cyan" size="sm" disabled>
        <SettingsIcon className="w-4 h-4" />
      </Button>
    );
  }

  if (!isOpen) {
    return (
      <Button variant="ghost" colorScheme="cyan" size="sm" onClick={() => setIsOpen(true)}>
        <SettingsIcon className="w-4 h-4" />
        <span>Settings</span>
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <Panel glow="pink" className="w-full max-w-md p-6 sm:p-8">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <h2 className="text-xl font-black uppercase tracking-[0.15em] text-neon-pink">
            Settings
          </h2>
          <button 
            onClick={handleCancel} 
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5 text-text-dim" />
          </button>
        </div>

        {/* Settings Fields */}
        <div className="space-y-6">
          {SETTING_FIELDS.map(({ label, color, min, max, key, unit }) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-3">
                <label className={`text-xs font-black uppercase tracking-wider text-neon-${color}`}>
                  {label}
                </label>
                <span className={`text-sm font-black text-neon-${color}`}>
                  {localSettings[key]} {unit}
                </span>
              </div>
              <RangeInput 
                min={min} 
                max={max} 
                value={localSettings[key]} 
                onChange={(e) => setLocalSettings({...localSettings, [key]: parseInt(e.target.value)})} 
                color={color}
              />
            </div>
          ))}
        </div>

        {/* Toggle Options */}
        <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-white/5">
          {TOGGLE_FIELDS.map(({ key, label, color }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer group">
              <div className={`
                w-10 h-6 rounded-full relative transition-colors duration-300
                ${localSettings[key] ? `bg-neon-${color}` : 'bg-white/10'}
              `}>
                <input 
                  type="checkbox" 
                  checked={localSettings[key]}
                  onChange={(e) => setLocalSettings({...localSettings, [key]: e.target.checked})} 
                  className="sr-only"
                />
                <div className={`
                  absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300
                  ${localSettings[key] ? 'left-5' : 'left-1'}
                `} />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-text-dim group-hover:text-text-primary transition-colors">
                {label}
              </span>
            </label>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button 
            variant="primary" 
            colorScheme="pink" 
            size="lg"
            onClick={handleSave} 
            className="flex-1"
          >
            Save
          </Button>
          <Button 
            variant="ghost" 
            colorScheme="cyan" 
            size="lg"
            onClick={handleCancel} 
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </Panel>
    </div>
  );
}
