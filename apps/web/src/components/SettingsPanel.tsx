"use client";

import { useState, useEffect } from "react";
import { useTimerStore, Settings } from "@/store/timerStore";
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
    return (
      <button className="mt-4 px-6 py-3 bg-white/40 text-white font-semibold rounded-full backdrop-blur-sm">
        ⚙️ Customize
      </button>
    );
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="mt-4 px-6 py-3 bg-white/40 hover:bg-white/60 text-white font-semibold rounded-full backdrop-blur-sm transition-all hover:scale-105"
      >
        ⚙️ Customize
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl transform animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Customize Timer
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-5">
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🍅 Focus Duration
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={5}
                max={60}
                value={localSettings.workDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, workDuration: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gradient-to-r from-red-400 to-rose-500 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-bold text-lg text-gray-700 bg-gray-100 rounded-lg py-1">
                {localSettings.workDuration}m
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ☕ Short Break
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1}
                max={15}
                value={localSettings.shortBreakDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, shortBreakDuration: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-bold text-lg text-gray-700 bg-gray-100 rounded-lg py-1">
                {localSettings.shortBreakDuration}m
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🌴 Long Break
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={10}
                max={45}
                value={localSettings.longBreakDuration}
                onChange={(e) => setLocalSettings({ ...localSettings, longBreakDuration: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-bold text-lg text-gray-700 bg-gray-100 rounded-lg py-1">
                {localSettings.longBreakDuration}m
              </span>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎯 Long Break After
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={2}
                max={8}
                value={localSettings.longBreakInterval}
                onChange={(e) => setLocalSettings({ ...localSettings, longBreakInterval: parseInt(e.target.value) })}
                className="flex-1 h-3 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full appearance-none cursor-pointer"
              />
              <span className="w-16 text-center font-bold text-lg text-gray-700 bg-gray-100 rounded-lg py-1">
                {localSettings.longBreakInterval}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localSettings.autoStartBreaks}
                  onChange={(e) => setLocalSettings({ ...localSettings, autoStartBreaks: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-emerald-400 peer-checked:to-teal-500 rounded-full transition-all"></div>
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Auto-start breaks</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={localSettings.autoStartPomodoros}
                  onChange={(e) => setLocalSettings({ ...localSettings, autoStartPomodoros: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-12 h-7 bg-gray-200 peer-checked:bg-gradient-to-r peer-checked:from-red-400 peer-checked:to-rose-500 rounded-full transition-all"></div>
                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5"></div>
              </div>
              <span className="text-sm font-medium text-gray-700">Auto-start pomodoros</span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleSave}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
