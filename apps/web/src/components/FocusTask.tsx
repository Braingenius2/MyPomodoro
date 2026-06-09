"use client";

import { useEffect, useState, useRef } from "react";
import { useFocusTaskStore } from "@/store/focusTaskStore";
import { useTaskStore } from "@/store/taskStore";
import { Target, Check, ChevronDown } from "lucide-react";

interface FocusTaskBarProps {
  isFocusSession?: boolean;
}

export function FocusTaskBar({ isFocusSession }: FocusTaskBarProps) {
  const task = useFocusTaskStore((s) => s.task);
  const initialized = useFocusTaskStore((s) => s.initialized);
  const setFocusTask = useFocusTaskStore((s) => s.setFocusTask);
  const clearFocusTask = useFocusTaskStore((s) => s.clearFocusTask);
  const initialize = useFocusTaskStore((s) => s.initialize);
  const taskList = useTaskStore((s) => s.tasks);

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!initialized) return null;

  const handleSet = () => {
    setFocusTask(value);
    setEditing(false);
    setShowPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSet();
    if (e.key === "Escape") { setEditing(false); setValue(task?.title || ""); }
  };

  const handlePickTask = (title: string) => {
    setFocusTask(title);
    setEditing(false);
    setShowPicker(false);
  };

  if (isFocusSession && task) {
    return (
      <div className="text-center mb-6 animate-[slide-up_0.3s_ease-out]">
        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-neon-cyan mb-2">
          Current Focus
        </div>
        <div
          className="text-xl sm:text-2xl font-black text-neon-cyan truncate max-w-full px-4"
          style={{ textShadow: "0 0 30px rgba(0,245,255,0.4)" }}
          title={task.title}
        >
          {task.title}
        </div>
      </div>
    );
  }

  if (!editing && task) {
    return (
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-dark-surface/50 border border-neon-cyan/20">
        <Target className="w-4 h-4 text-neon-cyan shrink-0" />
        <span className="flex-1 text-sm font-medium text-text-primary truncate" title={task.title}>
          {task.title}
        </span>
        <button
          type="button"
          onClick={() => { setEditing(true); setValue(task.title); }}
          className="text-[10px] font-black uppercase tracking-wider text-neon-cyan hover:text-neon-cyan/80 transition-colors shrink-0"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={clearFocusTask}
          className="text-[10px] font-black uppercase tracking-wider text-text-dim hover:text-neon-pink transition-colors shrink-0"
        >
          Clear
        </button>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="mb-4 p-3 rounded-xl bg-dark-surface/50 border border-neon-cyan/30">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What is your one focus task?"
            maxLength={100}
            className="flex-1 bg-dark-bg border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-cyan/50 text-text-primary placeholder:text-text-dim transition-colors"
          />
          <button
            type="button"
            onClick={handleSet}
            className="px-3 py-2 bg-neon-cyan text-dark-bg rounded-lg font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
        <div className="relative mt-2" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-text-dim hover:text-neon-cyan transition-colors"
          >
            <ChevronDown className="w-3 h-3" />
            From Tasks
          </button>
          {showPicker && (
            <div className="absolute left-0 top-full mt-1 w-full max-h-40 overflow-y-auto bg-dark-surface border border-white/10 rounded-xl z-50 shadow-xl">
              {taskList.filter((t) => !t.completed).length === 0 ? (
                <div className="px-3 py-2 text-xs text-text-dim">No active tasks</div>
              ) : (
                taskList
                  .filter((t) => !t.completed)
                  .map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handlePickTask(t.title)}
                      className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-white/5 transition-colors truncate"
                    >
                      {t.title}
                    </button>
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-dark-surface/30 border border-white/5">
      <Target className="w-4 h-4 text-text-dim shrink-0" />
      <span className="flex-1 text-sm text-text-dim">What are you focusing on?</span>
      <button
        type="button"
        onClick={() => { setEditing(true); setValue(""); }}
        className="text-[10px] font-black uppercase tracking-wider text-neon-cyan hover:text-neon-cyan/80 transition-colors shrink-0"
      >
        Set
      </button>
    </div>
  );
}
