"use client";

import { useState, useEffect } from "react";
import { useTaskStore } from "@/store/taskStore";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { Check, Plus, Trash2 } from "lucide-react";

export function TaskList() {
  const { tasks, initialized, addTask, toggleTask, deleteTask, clearCompleted } = useTaskStore();
  const [mounted, setMounted] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    useTaskStore.getState().initialize();
    setMounted(true);
  }, []);

  if (!mounted || !initialized) {
    return (
      <Panel glow="cyan" className="p-6 sm:p-8 flex flex-col h-full min-h-[400px]">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-6" />
        <div className="space-y-4">
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
          <div className="h-12 w-full bg-white/5 rounded animate-pulse" />
        </div>
      </Panel>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  return (
    <Panel glow="cyan" className="p-6 sm:p-8 flex flex-col h-full min-h-[500px] max-h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
        <h2 className="text-xl font-black uppercase tracking-[0.15em] text-neon-cyan">
          Focus Tasks
        </h2>
        {tasks.some(t => t.completed) && (
          <button
            onClick={clearCompleted}
            className="text-xs font-black uppercase text-text-dim hover:text-neon-pink transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear Done
          </button>
        )}
      </div>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What are you working on?"
          maxLength={100}
          className="flex-1 bg-dark-bg border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neon-cyan/50 text-text-primary placeholder:text-text-dim transition-colors truncate"
        />
        <Button variant="primary" colorScheme="cyan" type="submit" className="px-4 py-2 min-w-[3rem]">
          <Plus className="w-5 h-5 mx-auto" />
        </Button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-sm text-text-dim font-black tracking-wider border border-dashed border-white/10 rounded-xl">
            No active tasks. Add one to focus!
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`
                group flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300
                ${task.completed 
                  ? 'bg-white/5 border-white/5 opacity-50' 
                  : 'bg-dark-surface border-white/10 hover:border-neon-cyan/30 hover:shadow-[0_0_15px_rgba(0,245,255,0.1)]'}
              `}
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={`
                  w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors
                  ${task.completed 
                    ? 'bg-neon-green border-neon-green text-dark-bg' 
                    : 'border-text-dim hover:border-neon-cyan'}
                `}
              >
                {task.completed && <Check className="w-4 h-4" />}
              </button>
              
              <span 
                className={`flex-1 text-sm font-medium transition-all truncate ${task.completed ? 'line-through text-text-dim' : 'text-text-primary'}`}
                title={task.title}
              >
                {task.title}
              </span>

              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-text-dim hover:text-neon-pink hover:bg-white/5 rounded-lg transition-all"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
