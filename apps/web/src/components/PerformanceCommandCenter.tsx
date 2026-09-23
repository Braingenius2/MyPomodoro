"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  ClipboardCheck,
  Clock3,
  Download,
  FileUp,
  Goal as GoalIcon,
  Lightbulb,
  LockKeyhole,
  Play,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { Timer } from "@/components/Timer";
import { useFocusTaskStore } from "@/store/focusTaskStore";
import {
  AutomationCandidate,
  AutomationStage,
  DailyPlan,
  EvidenceRecord,
  Goal,
  KBAC_MODULES,
  KBAC_QUIZ,
  MonthlyPlan,
  PerformanceDimension,
  PlannedTask,
  PlanningSnapshot,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TopicMastery,
  usePlanningStore,
  WeeklyPlan,
  YearlyPlan,
} from "@/store/planningStore";

type TabId = "command" | "horizons" | "kbac" | "evidence" | "automation" | "roadmap";

const tabs: Array<{ id: TabId; label: string; icon: typeof Target }> = [
  { id: "command", label: "Command", icon: Target },
  { id: "horizons", label: "Horizons", icon: CalendarDays },
  { id: "kbac", label: "KBAC sprint", icon: BookOpenCheck },
  { id: "evidence", label: "Rating evidence", icon: Trophy },
  { id: "automation", label: "Automation", icon: Zap },
  { id: "roadmap", label: "Roadmap", icon: GoalIcon },
];

const performanceDimensions: PerformanceDimension[] = [
  "What you do",
  "Stretch contribution",
  "Seek growth",
  "Inspire trust",
  "Deliver impact",
  "Peer contribution",
];

const taskCategories: TaskCategory[] = ["Delivery", "KBAC", "Technical mastery", "Automation", "Career", "Admin"];
const taskPriorities: TaskPriority[] = ["Must", "Should", "Could"];
const masteryOptions: TopicMastery[] = ["Not started", "Learning", "Can explain", "Test-ready"];
const automationStages: AutomationStage[] = [
  "Observed pain",
  "Candidate",
  "Sponsor",
  "Approval",
  "Build",
  "Validate",
  "Pilot",
  "Adopt",
  "Document impact",
];

function toDate(date: string): Date {
  return new Date(`${date}T12:00:00`);
}

function dateLabel(date: string, options: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }): string {
  return new Intl.DateTimeFormat("en-GB", options).format(toDate(date));
}

function addDays(date: string, amount: number): string {
  const source = toDate(date);
  source.setDate(source.getDate() + amount);
  return `${source.getFullYear()}-${String(source.getMonth() + 1).padStart(2, "0")}-${String(source.getDate()).padStart(2, "0")}`;
}

function defaultPlan(date: string): DailyPlan {
  return {
    date,
    energy: "Normal",
    winCondition: "By close of day, I will have moved one delivery result, one capability result, and one leverage result forward.",
    firstFocusBlock: "",
    fixedCommitments: "",
    reflection: "",
    evidenceNote: "",
    tomorrowFirstFocusBlock: "",
  };
}

function categoryClass(category: TaskCategory): string {
  const palette: Record<TaskCategory, string> = {
    Delivery: "bg-blue-500/15 text-blue-200 border-blue-400/30",
    KBAC: "bg-amber-400/15 text-amber-100 border-amber-300/30",
    "Technical mastery": "bg-violet-500/15 text-violet-200 border-violet-300/30",
    Automation: "bg-cyan-400/15 text-cyan-100 border-cyan-300/30",
    Career: "bg-emerald-400/15 text-emerald-100 border-emerald-300/30",
    Admin: "bg-slate-400/15 text-slate-200 border-slate-300/25",
  };
  return palette[category];
}

function statusClass(status: TopicMastery): string {
  const palette: Record<TopicMastery, string> = {
    "Not started": "text-slate-400",
    Learning: "text-amber-200",
    "Can explain": "text-cyan-200",
    "Test-ready": "text-emerald-200",
  };
  return palette[status];
}

function IconMetric({ label, value, icon: Icon, note }: { label: string; value: string | number; icon: typeof Target; note: string }) {
  return (
    <div className="command-metric">
      <div className="command-metric-icon"><Icon className="h-4 w-4" /></div>
      <div>
        <div className="command-metric-value">{value}</div>
        <div className="command-metric-label">{label}</div>
        <div className="command-metric-note">{note}</div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="command-section-heading">
      <div>
        <p className="command-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function SafetyNote() {
  return (
    <div className="command-safety-note">
      <LockKeyhole className="h-4 w-4 shrink-0" />
      <p><strong>Private planning only.</strong> Use generic engagement aliases and proof references. Never add client names, client data, screenshots, credentials, working papers, or sensitive KPMG information here.</p>
    </div>
  );
}

export function PerformanceCommandCenter() {
  const initialized = usePlanningStore((state) => state.initialized);
  const initialize = usePlanningStore((state) => state.initialize);
  const selectedDate = usePlanningStore((state) => state.selectedDate);
  const setSelectedDate = usePlanningStore((state) => state.setSelectedDate);
  const goals = usePlanningStore((state) => state.goals);
  const tasks = usePlanningStore((state) => state.tasks);
  const dailyPlans = usePlanningStore((state) => state.dailyPlans);
  const weeklyPlan = usePlanningStore((state) => state.weeklyPlan);
  const yearPlan = usePlanningStore((state) => state.yearPlan);
  const monthlyPlans = usePlanningStore((state) => state.monthlyPlans);
  const studyTopics = usePlanningStore((state) => state.studyTopics);
  const evidenceRecords = usePlanningStore((state) => state.evidenceRecords);
  const automationCandidates = usePlanningStore((state) => state.automationCandidates);
  const updateDailyPlan = usePlanningStore((state) => state.updateDailyPlan);
  const updateWeeklyPlan = usePlanningStore((state) => state.updateWeeklyPlan);
  const updateYearPlan = usePlanningStore((state) => state.updateYearPlan);
  const addMilestone = usePlanningStore((state) => state.addMilestone);
  const toggleMilestone = usePlanningStore((state) => state.toggleMilestone);
  const updateMonthlyPlan = usePlanningStore((state) => state.updateMonthlyPlan);
  const addMonthlyOutcome = usePlanningStore((state) => state.addMonthlyOutcome);
  const toggleMonthlyOutcome = usePlanningStore((state) => state.toggleMonthlyOutcome);
  const removeMonthlyOutcome = usePlanningStore((state) => state.removeMonthlyOutcome);
  const addTask = usePlanningStore((state) => state.addTask);
  const setTaskStatus = usePlanningStore((state) => state.setTaskStatus);
  const deferTask = usePlanningStore((state) => state.deferTask);
  const rehashTomorrow = usePlanningStore((state) => state.rehashTomorrow);
  const setTopicStatus = usePlanningStore((state) => state.setTopicStatus);
  const addEvidence = usePlanningStore((state) => state.addEvidence);
  const addAutomationCandidate = usePlanningStore((state) => state.addAutomationCandidate);
  const updateAutomationCandidate = usePlanningStore((state) => state.updateAutomationCandidate);
  const exportSnapshot = usePlanningStore((state) => state.exportSnapshot);
  const importSnapshot = usePlanningStore((state) => state.importSnapshot);
  const setFocusTask = useFocusTaskStore((state) => state.setFocusTask);

  const [activeTab, setActiveTab] = useState<TabId>("command");

  useEffect(() => {
    initialize();
  }, [initialize]);

  const selectedPlan = dailyPlans.find((plan) => plan.date === selectedDate) ?? defaultPlan(selectedDate);
  const selectedTasks = tasks.filter((task) => task.plannedDate === selectedDate).sort((a, b) => {
    const priorityOrder: Record<TaskPriority, number> = { Must: 0, Should: 1, Could: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  const completedTaskCount = selectedTasks.filter((task) => task.status === "Done").length;
  const studyReadyCount = studyTopics.filter((topic) => topic.status === "Can explain" || topic.status === "Test-ready").length;
  const plannedPomodoros = selectedTasks.filter((task) => task.status !== "Done").reduce((total, task) => total + task.estimatedPomodoros, 0);

  if (!initialized) {
    return (
      <main className="command-shell command-loading">
        <div className="command-loading-mark"><Sparkles className="h-5 w-5" /></div>
        <p className="command-eyebrow">Preparing your command center</p>
        <h1>Outcome first. Time second.</h1>
      </main>
    );
  }

  return (
    <main className="command-shell">
      <header className="command-header">
        <div className="command-brand">
          <div className="command-brand-mark">F</div>
          <div>
            <p className="command-eyebrow">Technology Risk Analyst OS</p>
            <h1>Performance Command Center</h1>
          </div>
        </div>
        <div className="command-north-star">
          <Target className="h-4 w-4" />
          <span>{yearPlan.northStar || "Rating 1 evidence readiness by Sep 2027"}</span>
        </div>
      </header>

      <nav className="command-tabs" aria-label="Command center sections">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setActiveTab(id)} className={activeTab === id ? "is-active" : ""}>
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {activeTab === "command" && (
        <CommandView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedPlan={selectedPlan}
          selectedTasks={selectedTasks}
          completedTaskCount={completedTaskCount}
          plannedPomodoros={plannedPomodoros}
          studyReadyCount={studyReadyCount}
          evidenceCount={evidenceRecords.length}
          automationCount={automationCandidates.length}
          weeklyCapacity={weeklyPlan.focusCapacity}
          updateDailyPlan={updateDailyPlan}
          updateWeeklyPlan={updateWeeklyPlan}
          weeklyPlan={weeklyPlan}
          addTask={addTask}
          setTaskStatus={setTaskStatus}
          deferTask={deferTask}
          rehashTomorrow={rehashTomorrow}
          focusTask={setFocusTask}
        />
      )}
      {activeTab === "horizons" && (
        <HorizonsView
          yearPlan={yearPlan}
          monthlyPlans={monthlyPlans}
          selectedDate={selectedDate}
          weeklyPlan={weeklyPlan}
          selectedPlan={selectedPlan}
          updateYearPlan={updateYearPlan}
          addMilestone={addMilestone}
          toggleMilestone={toggleMilestone}
          updateMonthlyPlan={updateMonthlyPlan}
          addMonthlyOutcome={addMonthlyOutcome}
          toggleMonthlyOutcome={toggleMonthlyOutcome}
          removeMonthlyOutcome={removeMonthlyOutcome}
          onOpenCommand={() => setActiveTab("command")}
        />
      )}
      {activeTab === "kbac" && <KbacView studyTopics={studyTopics} setTopicStatus={setTopicStatus} />}
      {activeTab === "evidence" && <EvidenceView evidenceRecords={evidenceRecords} addEvidence={addEvidence} />}
      {activeTab === "automation" && (
        <AutomationView
          candidates={automationCandidates}
          addCandidate={addAutomationCandidate}
          updateCandidate={updateAutomationCandidate}
        />
      )}
      {activeTab === "roadmap" && (
        <RoadmapView
          goals={goals}
          tasks={tasks}
          evidenceRecords={evidenceRecords}
          exportSnapshot={exportSnapshot}
          importSnapshot={importSnapshot}
        />
      )}
    </main>
  );
}

function CommandView({
  selectedDate,
  setSelectedDate,
  selectedPlan,
  selectedTasks,
  completedTaskCount,
  plannedPomodoros,
  studyReadyCount,
  evidenceCount,
  automationCount,
  weeklyCapacity,
  updateDailyPlan,
  updateWeeklyPlan,
  weeklyPlan,
  addTask,
  setTaskStatus,
  deferTask,
  rehashTomorrow,
  focusTask,
}: {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedPlan: DailyPlan;
  selectedTasks: PlannedTask[];
  completedTaskCount: number;
  plannedPomodoros: number;
  studyReadyCount: number;
  evidenceCount: number;
  automationCount: number;
  weeklyCapacity: number;
  updateDailyPlan: (date: string, patch: Partial<Omit<DailyPlan, "date">>) => void;
  updateWeeklyPlan: (patch: Partial<import("@/store/planningStore").WeeklyPlan>) => void;
  weeklyPlan: ReturnType<typeof usePlanningStore.getState>["weeklyPlan"];
  addTask: (task: Omit<PlannedTask, "id" | "status" | "carryCount" | "carryReason">) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  deferTask: (id: string, reason: string) => void;
  rehashTomorrow: () => number;
  focusTask: (title: string) => void;
}) {
  const [rehashNotice, setRehashNotice] = useState("");

  const changeDate = (offset: number) => setSelectedDate(addDays(selectedDate, offset));
  const handleRehash = () => {
    const count = rehashTomorrow();
    setRehashNotice(count === 0 ? "Nothing is waiting to be moved." : `${count} unfinished item${count === 1 ? "" : "s"} moved to ${dateLabel(addDays(selectedDate, 1))}. Review the new plan before calling it done.`);
  };

  return (
    <div className="command-page command-enter">
      <section className="command-date-row">
        <button type="button" aria-label="Previous day" onClick={() => changeDate(-1)}><ChevronLeft className="h-5 w-5" /></button>
        <div>
          <p className="command-eyebrow">Today is a decision, not a to-do list</p>
          <h2>{dateLabel(selectedDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h2>
        </div>
        <div className="command-date-actions">
          <input aria-label="Choose plan date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          <button type="button" aria-label="Next day" onClick={() => changeDate(1)}><ChevronRight className="h-5 w-5" /></button>
        </div>
      </section>

      <section className="command-score-line">
        <IconMetric label="Daily completion" value={`${completedTaskCount}/${selectedTasks.length}`} icon={CheckCircle2} note="Outcomes closed" />
        <IconMetric label="Focus load" value={`${plannedPomodoros}/${weeklyCapacity}`} icon={Clock3} note="Pomodoros planned" />
        <IconMetric label="KBAC ready" value={`${studyReadyCount}/9`} icon={Brain} note="Can explain or test-ready" />
        <IconMetric label="Evidence ledger" value={evidenceCount} icon={Trophy} note="Dated proof entries" />
        <IconMetric label="Automation pipeline" value={automationCount} icon={Zap} note="Generic candidates only" />
      </section>

      <section className="command-primary-grid">
        <div className="command-panel command-panel-hero">
          <SectionHeading eyebrow="Daily win condition" title="The 1-1-1 rule" />
          <p className="command-hero-copy">One delivery result. One capability result. One leverage result. On a brutal client day, make the capability and leverage moves smaller, not imaginary.</p>
          <textarea
            value={selectedPlan.winCondition}
            onChange={(event) => updateDailyPlan(selectedDate, { winCondition: event.target.value })}
            placeholder="By close of day, I will have..."
            rows={3}
            className="command-big-input"
          />
          <div className="command-plan-fields">
            <label>
              <span>First focus block</span>
              <input value={selectedPlan.firstFocusBlock} onChange={(event) => updateDailyPlan(selectedDate, { firstFocusBlock: event.target.value })} placeholder="The next physical action, not a vague ambition" />
            </label>
            <label>
              <span>Energy</span>
              <select value={selectedPlan.energy} onChange={(event) => updateDailyPlan(selectedDate, { energy: event.target.value as DailyPlan["energy"] })}>
                <option>Low</option>
                <option>Normal</option>
                <option>High</option>
              </select>
            </label>
            <label className="command-full-field">
              <span>Fixed commitments</span>
              <input value={selectedPlan.fixedCommitments} onChange={(event) => updateDailyPlan(selectedDate, { fixedCommitments: event.target.value })} placeholder="Academy, engagement calls, deadlines, travel" />
            </label>
          </div>
        </div>

        <div className="command-panel command-timer-panel">
          <SectionHeading eyebrow="Focus execution" title="Use time on purpose" />
          <p className="command-muted">Set the current task inside the timer, then use a 25-minute block for recall or 50 minutes for deep work.</p>
          <Timer />
        </div>
      </section>

      <section className="command-task-section command-panel">
        <SectionHeading
          eyebrow="Task runway"
          title="Plan the output, then start the clock"
          action={<span className={`command-capacity ${plannedPomodoros <= Math.ceil(weeklyCapacity * 0.6) ? "is-safe" : "is-tight"}`}>{plannedPomodoros <= Math.ceil(weeklyCapacity * 0.6) ? "Within 60% capacity" : "Over your 60% capacity guardrail"}</span>}
        />
        <TaskComposer selectedDate={selectedDate} addTask={addTask} />
        <div className="command-task-list">
          {selectedTasks.length === 0 ? (
            <div className="command-empty-state"><CalendarDays className="h-5 w-5" /> No tasks planned. Add your next physical action, not a motivational slogan.</div>
          ) : (
            selectedTasks.map((task) => (
              <TaskRow key={task.id} task={task} setTaskStatus={setTaskStatus} deferTask={deferTask} focusTask={focusTask} />
            ))
          )}
        </div>
      </section>

      <section className="command-review-grid">
        <div className="command-panel">
          <SectionHeading eyebrow="Weekly control room" title={weeklyPlan.theme || "This week's operating theme"} />
          <div className="command-weekly-grid">
            <label><span>Delivery win</span><textarea rows={2} value={weeklyPlan.deliveryWin} onChange={(event) => updateWeeklyPlan({ deliveryWin: event.target.value })} /></label>
            <label><span>Mastery win</span><textarea rows={2} value={weeklyPlan.masteryWin} onChange={(event) => updateWeeklyPlan({ masteryWin: event.target.value })} /></label>
            <label><span>Leverage win</span><textarea rows={2} value={weeklyPlan.leverageWin} onChange={(event) => updateWeeklyPlan({ leverageWin: event.target.value })} /></label>
            <label><span>Behaviour focus</span><textarea rows={2} value={weeklyPlan.behaviourFocus} onChange={(event) => updateWeeklyPlan({ behaviourFocus: event.target.value })} /></label>
          </div>
          <div className="command-inline-fields">
            <label><span>Focus capacity</span><input type="number" min="1" max="50" value={weeklyPlan.focusCapacity} onChange={(event) => updateWeeklyPlan({ focusCapacity: Number(event.target.value) || 1 })} /></label>
            <label><span>Contingency</span><input type="number" min="0" max="30" value={weeklyPlan.contingencyCapacity} onChange={(event) => updateWeeklyPlan({ contingencyCapacity: Number(event.target.value) || 0 })} /></label>
            <label className="command-inline-grow"><span>Feedback to request</span><input value={weeklyPlan.feedbackRequest} onChange={(event) => updateWeeklyPlan({ feedbackRequest: event.target.value })} /></label>
          </div>
        </div>

        <div className="command-panel command-closeout">
          <SectionHeading eyebrow="10-minute closeout" title="Rehash tomorrow, then stop carrying work in your head" />
          <p className="command-muted">A task carried twice needs a smaller action, a blocker conversation, or a dignified death. Invisible overload is not performance.</p>
          <label><span>What evidence exists now?</span><textarea rows={2} value={selectedPlan.evidenceNote} onChange={(event) => updateDailyPlan(selectedDate, { evidenceNote: event.target.value })} placeholder="Generic proof only, never client data" /></label>
          <label><span>What moved forward or needs repair?</span><textarea rows={2} value={selectedPlan.reflection} onChange={(event) => updateDailyPlan(selectedDate, { reflection: event.target.value })} /></label>
          <label><span>Tomorrow&apos;s first focus block</span><input value={selectedPlan.tomorrowFirstFocusBlock} onChange={(event) => updateDailyPlan(selectedDate, { tomorrowFirstFocusBlock: event.target.value })} placeholder="Choose a next physical action" /></label>
          <button type="button" onClick={handleRehash} className="command-primary-button"><RotateCcw className="h-4 w-4" /> Rehash unfinished work to tomorrow</button>
          {rehashNotice && <p className="command-inline-note"><Check className="h-4 w-4" /> {rehashNotice}</p>}
        </div>
      </section>
      <SafetyNote />
    </div>
  );
}

function TaskComposer({ selectedDate, addTask }: { selectedDate: string; addTask: (task: Omit<PlannedTask, "id" | "status" | "carryCount" | "carryReason">) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TaskCategory>("Delivery");
  const [priority, setPriority] = useState<TaskPriority>("Must");
  const [estimate, setEstimate] = useState(1);
  const [nextAction, setNextAction] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    addTask({
      title: title.trim(),
      category,
      priority,
      plannedDate: selectedDate,
      estimatedPomodoros: Math.max(1, estimate),
      nextAction: nextAction.trim() || title.trim(),
      definitionOfDone: "",
      evidenceExpected: "",
    });
    setTitle("");
    setNextAction("");
    setEstimate(1);
    setOpen(false);
  };

  if (!open) {
    return <button type="button" onClick={() => setOpen(true)} className="command-add-task"><Plus className="h-4 w-4" /> Add a deliberate task</button>;
  }

  return (
    <form onSubmit={handleSubmit} className="command-task-composer">
      <input autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Outcome or next action" maxLength={160} />
      <input value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder="First physical action" maxLength={180} />
      <select value={category} onChange={(event) => setCategory(event.target.value as TaskCategory)}>{taskCategories.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={priority} onChange={(event) => setPriority(event.target.value as TaskPriority)}>{taskPriorities.map((item) => <option key={item}>{item}</option>)}</select>
      <label className="command-estimate"><span>Pomodoros</span><input type="number" min="1" max="12" value={estimate} onChange={(event) => setEstimate(Number(event.target.value) || 1)} /></label>
      <button type="submit" className="command-primary-button"><Plus className="h-4 w-4" /> Add</button>
      <button type="button" className="command-quiet-button" onClick={() => setOpen(false)}>Cancel</button>
    </form>
  );
}

function TaskRow({ task, setTaskStatus, deferTask, focusTask }: { task: PlannedTask; setTaskStatus: (id: string, status: TaskStatus) => void; deferTask: (id: string, reason: string) => void; focusTask: (title: string) => void }) {
  const isDone = task.status === "Done";
  return (
    <article className={`command-task-row ${isDone ? "is-done" : ""}`}>
      <button type="button" className="command-task-check" onClick={() => setTaskStatus(task.id, isDone ? "Open" : "Done")} aria-label={isDone ? `Reopen ${task.title}` : `Complete ${task.title}`}>
        {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </button>
      <div className="command-task-main">
        <div className="command-task-title-line">
          <h3>{task.title}</h3>
          <span className={`command-tag ${categoryClass(task.category)}`}>{task.category}</span>
          <span className="command-priority">{task.priority}</span>
        </div>
        <p><strong>Next:</strong> {task.nextAction}</p>
        {task.carryCount > 0 && <p className="command-carry-warning"><AlertTriangle className="h-3.5 w-3.5" /> Carried {task.carryCount} time{task.carryCount === 1 ? "" : "s"}. {task.carryReason}</p>}
      </div>
      <div className="command-task-meta"><Clock3 className="h-3.5 w-3.5" /> {task.estimatedPomodoros}</div>
      {!isDone && (
        <div className="command-task-actions">
          <button type="button" onClick={() => focusTask(task.nextAction || task.title)} title="Set as current focus"><Play className="h-4 w-4" /></button>
          <button type="button" onClick={() => deferTask(task.id, "Deliberately replanned")}>Defer</button>
        </div>
      )}
    </article>
  );
}

function HorizonsView({
  yearPlan,
  monthlyPlans,
  selectedDate,
  weeklyPlan,
  selectedPlan,
  updateYearPlan,
  addMilestone,
  toggleMilestone,
  updateMonthlyPlan,
  addMonthlyOutcome,
  toggleMonthlyOutcome,
  removeMonthlyOutcome,
  onOpenCommand,
}: {
  yearPlan: YearlyPlan;
  monthlyPlans: MonthlyPlan[];
  selectedDate: string;
  weeklyPlan: WeeklyPlan;
  selectedPlan: DailyPlan;
  updateYearPlan: (patch: Partial<Omit<YearlyPlan, "milestones">>) => void;
  addMilestone: (quarter: string, title: string) => void;
  toggleMilestone: (id: string) => void;
  updateMonthlyPlan: (month: string, patch: Partial<Omit<MonthlyPlan, "month" | "outcomes">>) => void;
  addMonthlyOutcome: (month: string, title: string) => void;
  toggleMonthlyOutcome: (month: string, outcomeId: string) => void;
  removeMonthlyOutcome: (month: string, outcomeId: string) => void;
  onOpenCommand: () => void;
}) {
  const [month, setMonth] = useState(selectedDate.slice(0, 7));
  const [milestoneQuarter, setMilestoneQuarter] = useState("Q4 2026");
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [outcomeTitle, setOutcomeTitle] = useState("");

  const activeMonth = monthlyPlans.find((plan) => plan.month === month) ?? {
    month,
    theme: "",
    habit: "",
    outcomes: [],
    reviewNotes: "",
  };
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(toDate(`${month}-01`));
  const doneMilestones = yearPlan.milestones.filter((milestone) => milestone.done).length;
  const doneOutcomes = activeMonth.outcomes.filter((outcome) => outcome.done).length;

  const submitMilestone = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!milestoneTitle.trim()) return;
    addMilestone(milestoneQuarter, milestoneTitle);
    setMilestoneTitle("");
  };

  const submitOutcome = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!outcomeTitle.trim()) return;
    addMonthlyOutcome(month, outcomeTitle);
    setOutcomeTitle("");
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Annual and monthly operating system</p>
        <h2>North star to next physical action.</h2>
        <p>This is the cascade: the year sets the destination, the month sets the outcomes, the week sets the wins, and the day sets the first focus block. If a task cannot trace back to this page, question the task.</p>
      </section>

      <section className="command-cascade">
        <button type="button" className="command-cascade-card" onClick={onOpenCommand}>
          <span>Year {yearPlan.year}</span>
          <strong>{yearPlan.northStar || "Set your north star"}</strong>
          <small>{doneMilestones} of {yearPlan.milestones.length} quarterly milestones done</small>
        </button>
        <div className="command-cascade-arrow"><ArrowRight className="h-4 w-4" /></div>
        <button type="button" className="command-cascade-card" onClick={onOpenCommand}>
          <span>{monthLabel}</span>
          <strong>{activeMonth.theme || "Set this month's theme"}</strong>
          <small>{doneOutcomes} of {activeMonth.outcomes.length} monthly outcomes done</small>
        </button>
        <div className="command-cascade-arrow"><ArrowRight className="h-4 w-4" /></div>
        <button type="button" className="command-cascade-card" onClick={onOpenCommand}>
          <span>This week</span>
          <strong>{weeklyPlan.theme || "Set the weekly theme"}</strong>
          <small>{weeklyPlan.deliveryWin || "No delivery win set"}</small>
        </button>
        <div className="command-cascade-arrow"><ArrowRight className="h-4 w-4" /></div>
        <button type="button" className="command-cascade-card is-today" onClick={onOpenCommand}>
          <span>Today</span>
          <strong>{selectedPlan.firstFocusBlock || selectedPlan.winCondition || "Set today's win condition"}</strong>
          <small>Open the command view to run the day</small>
        </button>
      </section>

      <section className="command-review-grid">
        <div className="command-panel">
          <SectionHeading eyebrow="Year plan" title={`${yearPlan.year} on one page`} action={<span className="command-capacity is-safe">{doneMilestones}/{yearPlan.milestones.length} milestones</span>} />
          <div className="command-form-grid">
            <label className="command-form-full"><span>North star</span><input value={yearPlan.northStar} onChange={(event) => updateYearPlan({ northStar: event.target.value })} placeholder="One sentence that decides what matters" /></label>
            <label className="command-form-full"><span>Definition of winning</span><textarea rows={3} value={yearPlan.definitionOfWinning} onChange={(event) => updateYearPlan({ definitionOfWinning: event.target.value })} /></label>
            <label className="command-form-full"><span>Non-negotiables</span><textarea rows={2} value={yearPlan.nonNegotiables} onChange={(event) => updateYearPlan({ nonNegotiables: event.target.value })} /></label>
          </div>
          <div className="command-milestones">
            {yearPlan.milestones.map((milestone) => (
              <div key={milestone.id} className={`command-milestone ${milestone.done ? "is-done" : ""}`}>
                <button type="button" className="command-task-check" onClick={() => toggleMilestone(milestone.id)} aria-label={milestone.done ? `Reopen ${milestone.title}` : `Complete ${milestone.title}`}>
                  {milestone.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </button>
                <div><span>{milestone.quarter}</span><p>{milestone.title}</p></div>
              </div>
            ))}
          </div>
          <form className="command-inline-form" onSubmit={submitMilestone}>
            <select value={milestoneQuarter} onChange={(event) => setMilestoneQuarter(event.target.value)}>
              <option>Q4 2026</option>
              <option>Q1 2027</option>
              <option>Q2 2027</option>
              <option>Q3 2027</option>
            </select>
            <input value={milestoneTitle} onChange={(event) => setMilestoneTitle(event.target.value)} placeholder="Add a quarterly milestone" maxLength={140} />
            <button type="submit" className="command-primary-button"><Plus className="h-4 w-4" /> Add</button>
          </form>
        </div>

        <div className="command-panel">
          <SectionHeading
            eyebrow="Month plan"
            title={monthLabel}
            action={<input aria-label="Choose plan month" type="month" value={month} onChange={(event) => setMonth(event.target.value || selectedDate.slice(0, 7))} />}
          />
          <div className="command-form-grid">
            <label className="command-form-full"><span>Monthly theme</span><input value={activeMonth.theme} onChange={(event) => updateMonthlyPlan(month, { theme: event.target.value })} placeholder="The one sentence that defines this month" /></label>
            <label className="command-form-full"><span>Habit to build</span><input value={activeMonth.habit} onChange={(event) => updateMonthlyPlan(month, { habit: event.target.value })} placeholder="One repeatable behaviour, not a wish" /></label>
          </div>
          <div className="command-milestones">
            {activeMonth.outcomes.length === 0 && <div className="command-empty-state"><Target className="h-4 w-4" /> Three outcomes maximum. Delivery, mastery, leverage.</div>}
            {activeMonth.outcomes.map((outcome) => (
              <div key={outcome.id} className={`command-milestone ${outcome.done ? "is-done" : ""}`}>
                <button type="button" className="command-task-check" onClick={() => toggleMonthlyOutcome(month, outcome.id)} aria-label={outcome.done ? `Reopen ${outcome.title}` : `Complete ${outcome.title}`}>
                  {outcome.done ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </button>
                <div><span>Outcome</span><p>{outcome.title}</p></div>
                <button type="button" className="command-quiet-button" onClick={() => removeMonthlyOutcome(month, outcome.id)} aria-label={`Remove ${outcome.title}`}>Remove</button>
              </div>
            ))}
          </div>
          <form className="command-inline-form" onSubmit={submitOutcome}>
            <input value={outcomeTitle} onChange={(event) => setOutcomeTitle(event.target.value)} placeholder="Add a monthly outcome" maxLength={140} />
            <button type="submit" className="command-primary-button"><Plus className="h-4 w-4" /> Add</button>
          </form>
          <label className="command-month-review"><span>Monthly review notes</span><textarea rows={3} value={activeMonth.reviewNotes} onChange={(event) => updateMonthlyPlan(month, { reviewNotes: event.target.value })} placeholder="What moved? What stalled? What changes next month? Keep it honest and generic." /></label>
        </div>
      </section>
      <SafetyNote />
    </div>
  );
}

function KbacView({ studyTopics, setTopicStatus }: { studyTopics: Array<{ id: string; title: string; status: TopicMastery }>; setTopicStatus: (id: string, status: TopicMastery) => void }) {
  const [openModule, setOpenModule] = useState(KBAC_MODULES[0].id);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);
  const score = KBAC_QUIZ.reduce((total, question) => total + (answers[question.id] === question.answer ? 1 : 0), 0);
  const readyCount = studyTopics.filter((topic) => topic.status === "Can explain" || topic.status === "Test-ready").length;

  const resetQuiz = () => {
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Academy General Test sprint</p>
        <h2>KBAC study material, built for recall under pressure.</h2>
        <p>The Academy agenda confirms the taught topics and a General Test on 24 September. It does not confirm the KBAC question count, pass mark, weighting, or exact question bank. This is a tailored concept guide and self-test, not an official exam blueprint.</p>
        <p className="command-muted">Want the full interactive version? <a className="command-inline-link" href="kbac_study_guide.html" target="_blank" rel="noreferrer">Open the KBAC Elite Study System</a> for 16 slide-aligned modules, two solved class exercises, 52 flashcards, a 98-question bank, and a 30-minute paced mock exam.</p>
      </section>

      <section className="command-kbac-timeline">
        <div><span>21 Sep</span><strong>Diagnostic</strong><p>Accounting equation and debits / credits.</p></div>
        <div><span>22 Sep</span><strong>Double entry</strong><p>Finance function and tax concepts.</p></div>
        <div><span>23 Sep</span><strong>Integration</strong><p>Statements, IFRS, processes, regulators.</p></div>
        <div><span>24 Sep</span><strong>Test day</strong><p>Recall only. Arrive rested.</p></div>
      </section>

      <section className="command-progress-bar-section command-panel">
        <div className="command-progress-heading"><span>Mastery signal</span><strong>{readyCount} of {KBAC_MODULES.length} modules can be explained or are test-ready</strong></div>
        <div className="command-progress-track"><span style={{ width: `${(readyCount / KBAC_MODULES.length) * 100}%` }} /></div>
      </section>

      <section className="command-study-layout">
        <div className="command-module-list">
          {KBAC_MODULES.map((module) => {
            const topic = studyTopics.find((item) => item.id === module.id);
            return (
              <button type="button" key={module.id} onClick={() => setOpenModule(module.id)} className={openModule === module.id ? "is-selected" : ""}>
                <span>{module.title}</span>
                <small className={statusClass(topic?.status ?? "Not started")}>{topic?.status ?? "Not started"}</small>
              </button>
            );
          })}
        </div>
        {KBAC_MODULES.filter((module) => module.id === openModule).map((module) => {
          const topic = studyTopics.find((item) => item.id === module.id);
          return (
            <article className="command-panel command-study-module" key={module.id}>
              <div className="command-study-topline">
                <div><p className="command-eyebrow">{module.academyScope}</p><h2>{module.title}</h2></div>
                <select value={topic?.status ?? "Not started"} onChange={(event) => setTopicStatus(module.id, event.target.value as TopicMastery)}>{masteryOptions.map((item) => <option key={item}>{item}</option>)}</select>
              </div>
              <div className="command-study-block"><span>Plain-English rule</span><p>{module.plainRule}</p></div>
              <div className="command-study-block"><span>Worked example</span><p>{module.example}</p></div>
              <div className="command-study-block is-trap"><span>Common trap</span><p>{module.trap}</p></div>
              <div className="command-recall"><span>Close the notes. Answer these.</span><ol>{module.recall.map((question) => <li key={question}>{question}</li>)}</ol></div>
              <div className="command-tech-link"><ShieldCheck className="h-4 w-4" /><p><strong>Technology Risk link:</strong> {module.techRiskLink}</p></div>
            </article>
          );
        })}
      </section>

      <section className="command-panel command-quiz">
        <SectionHeading eyebrow="Self-test only" title="10 questions. Zero bluffing." action={<button type="button" className="command-quiet-button" onClick={resetQuiz}><RotateCcw className="h-4 w-4" /> Reset</button>} />
        <p className="command-muted">Use this to expose gaps. It is not an official KPMG test or a predictor of your score.</p>
        <div className="command-quiz-list">
          {KBAC_QUIZ.map((question, index) => {
            const answered = Object.prototype.hasOwnProperty.call(answers, question.id);
            return (
              <div className="command-quiz-question" key={question.id}>
                <p><span>{index + 1}</span>{question.prompt}</p>
                <div className="command-answer-options">
                  {question.choices.map((choice, choiceIndex) => {
                    const selected = answers[question.id] === choiceIndex;
                    const correct = showResult && choiceIndex === question.answer;
                    const incorrect = showResult && selected && choiceIndex !== question.answer;
                    return (
                      <button type="button" key={choice} onClick={() => !showResult && setAnswers((current) => ({ ...current, [question.id]: choiceIndex }))} className={`${selected ? "is-selected" : ""} ${correct ? "is-correct" : ""} ${incorrect ? "is-incorrect" : ""}`}>
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {showResult && <p className="command-answer-explanation"><strong>{answers[question.id] === question.answer ? "Correct." : "Repair this."}</strong> {question.explanation}</p>}
                {!answered && showResult && <p className="command-answer-explanation"><strong>Unanswered.</strong> {question.explanation}</p>}
              </div>
            );
          })}
        </div>
        {!showResult ? (
          <button type="button" disabled={Object.keys(answers).length !== KBAC_QUIZ.length} onClick={() => setShowResult(true)} className="command-primary-button">Mark my diagnostic <ArrowRight className="h-4 w-4" /></button>
        ) : (
          <div className="command-quiz-result"><Trophy className="h-5 w-5" /><strong>{score}/{KBAC_QUIZ.length}</strong><span>{score >= 8 ? "Strong foundation. Repair every miss anyway." : "Useful signal. Repair the misses, then repeat the recall prompts."}</span></div>
        )}
      </section>

      <section className="command-source-note">
        <Lightbulb className="h-4 w-4" />
        <p><strong>Tax and regulatory caution:</strong> use the Academy handouts for exam-specific rates, thresholds, and terminology. Official Nigerian sources should be your tie-breaker when a general note conflicts with current rules.</p>
      </section>
    </div>
  );
}

function EvidenceView({ evidenceRecords, addEvidence }: { evidenceRecords: EvidenceRecord[]; addEvidence: (record: Omit<EvidenceRecord, "id">) => void }) {
  const [form, setForm] = useState({
    engagementAlias: "",
    context: "",
    action: "",
    output: "",
    impact: "",
    stakeholder: "",
    feedback: "",
    proofReference: "",
    dimensions: ["What you do"] as PerformanceDimension[],
  });

  const counts = useMemo(() => performanceDimensions.map((dimension) => ({
    dimension,
    count: evidenceRecords.filter((record) => record.dimensions.includes(dimension)).length,
  })), [evidenceRecords]);

  const toggleDimension = (dimension: PerformanceDimension) => {
    setForm((current) => ({
      ...current,
      dimensions: current.dimensions.includes(dimension)
        ? current.dimensions.filter((item) => item !== dimension)
        : [...current.dimensions, dimension],
    }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.context.trim() || !form.action.trim() || !form.output.trim()) return;
    addEvidence({
      date: new Date().toISOString().slice(0, 10),
      engagementAlias: form.engagementAlias.trim() || "Internal / generic",
      context: form.context.trim(),
      action: form.action.trim(),
      output: form.output.trim(),
      impact: form.impact.trim(),
      stakeholder: form.stakeholder.trim(),
      feedback: form.feedback.trim(),
      dimensions: form.dimensions.length > 0 ? form.dimensions : ["What you do"],
      proofReference: form.proofReference.trim(),
    });
    setForm({ engagementAlias: "", context: "", action: "", output: "", impact: "", stakeholder: "", feedback: "", proofReference: "", dimensions: ["What you do"] });
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Performance evidence ledger</p>
        <h2>Build the case while the work is fresh.</h2>
        <p>This is evidence readiness, not a rating calculator. KPMG decides the rating through judgement and peer comparison. Your job is to make the strongest honest case possible.</p>
      </section>
      <SafetyNote />
      <section className="command-evidence-wall">
        {counts.map(({ dimension, count }) => <div key={dimension}><span>{dimension}</span><strong>{count}</strong><small>{count === 1 ? "proof entry" : "proof entries"}</small></div>)}
      </section>
      <section className="command-evidence-layout">
        <form className="command-panel command-evidence-form" onSubmit={submit}>
          <SectionHeading eyebrow="Capture a real contribution" title="One crisp record beats a foggy year-end story." />
          <div className="command-form-grid">
            <label><span>Generic engagement alias</span><input value={form.engagementAlias} onChange={(event) => setForm({ ...form, engagementAlias: event.target.value })} placeholder="e.g., Financial-services access review" /></label>
            <label><span>Stakeholder</span><input value={form.stakeholder} onChange={(event) => setForm({ ...form, stakeholder: event.target.value })} placeholder="Generic role only" /></label>
            <label className="command-form-full"><span>Context or problem</span><textarea rows={2} required value={form.context} onChange={(event) => setForm({ ...form, context: event.target.value })} placeholder="What needed to be solved? Keep it generic." /></label>
            <label className="command-form-full"><span>Action taken</span><textarea rows={2} required value={form.action} onChange={(event) => setForm({ ...form, action: event.target.value })} placeholder="What did you personally do?" /></label>
            <label className="command-form-full"><span>Output delivered</span><textarea rows={2} required value={form.output} onChange={(event) => setForm({ ...form, output: event.target.value })} placeholder="What exists now?" /></label>
            <label><span>Impact</span><input value={form.impact} onChange={(event) => setForm({ ...form, impact: event.target.value })} placeholder="Time, quality, clarity, risk reduction" /></label>
            <label><span>Feedback or review note</span><input value={form.feedback} onChange={(event) => setForm({ ...form, feedback: event.target.value })} placeholder="What was said or written?" /></label>
            <label className="command-form-full"><span>Generic proof reference</span><input value={form.proofReference} onChange={(event) => setForm({ ...form, proofReference: event.target.value })} placeholder="e.g., Manager feedback, meeting date, review comment. No files or client data." /></label>
          </div>
          <fieldset className="command-dimension-picker"><legend>Rating dimensions strengthened</legend>{performanceDimensions.map((dimension) => <label key={dimension}><input type="checkbox" checked={form.dimensions.includes(dimension)} onChange={() => toggleDimension(dimension)} /> <span>{dimension}</span></label>)}</fieldset>
          <button type="submit" className="command-primary-button"><ClipboardCheck className="h-4 w-4" /> Log evidence</button>
        </form>
        <div className="command-panel command-evidence-list">
          <SectionHeading eyebrow="Recent proof" title={`${evidenceRecords.length} evidence records`} />
          {evidenceRecords.length === 0 ? (
            <div className="command-empty-state"><Trophy className="h-5 w-5" /> Your performance is not a memory test. Start with Academy feedback, a strong group contribution, or a meaningful learning action.</div>
          ) : evidenceRecords.slice(0, 12).map((record) => (
            <article className="command-evidence-item" key={record.id}>
              <div><span>{dateLabel(record.date)}</span><span>{record.engagementAlias}</span></div>
              <h3>{record.output}</h3>
              <p>{record.action}</p>
              <div className="command-dimension-tags">{record.dimensions.map((dimension) => <span key={dimension}>{dimension}</span>)}</div>
              {record.feedback && <blockquote>“{record.feedback}”</blockquote>}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function AutomationView({ candidates, addCandidate, updateCandidate }: { candidates: AutomationCandidate[]; addCandidate: (candidate: Omit<AutomationCandidate, "id" | "stage" | "validationResult" | "measuredImpact">) => void; updateCandidate: (id: string, patch: Partial<AutomationCandidate>) => void }) {
  const [form, setForm] = useState({ workflow: "", painPoint: "", controlRisk: "", expectedBenefit: "", sponsor: "", approvedTools: "" });
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.workflow.trim() || !form.painPoint.trim()) return;
    addCandidate({
      workflow: form.workflow.trim(),
      painPoint: form.painPoint.trim(),
      controlRisk: form.controlRisk.trim(),
      expectedBenefit: form.expectedBenefit.trim(),
      sponsor: form.sponsor.trim(),
      approvedTools: form.approvedTools.trim(),
    });
    setForm({ workflow: "", painPoint: "", controlRisk: "", expectedBenefit: "", sponsor: "", approvedTools: "" });
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Responsible automation pipeline</p>
        <h2>Do not build a bot. Remove a real pain without weakening the audit trail.</h2>
        <p>Your six-month differentiator is not noisy AI talk. It is a manager-approved improvement that is safe, validated, useful, documented, and repeatable.</p>
      </section>
      <section className="command-pipeline"><span>Observed pain</span><ArrowRight /><span>Candidate</span><ArrowRight /><span>Sponsor</span><ArrowRight /><span>Approval</span><ArrowRight /><span>Build</span><ArrowRight /><span>Validate</span><ArrowRight /><span>Pilot</span><ArrowRight /><span>Adopt</span></section>
      <section className="command-panel command-automation-warning"><LockKeyhole className="h-5 w-5" /><div><h3>Non-negotiable data rule</h3><p>Never put client data, screenshots, working papers, credentials, client names, or sensitive KPMG information into this app, personal GitHub, a public AI tool, or an unapproved bot. Capture generic workflow observations only.</p></div></section>
      <section className="command-automation-layout">
        <form className="command-panel command-automation-form" onSubmit={submit}>
          <SectionHeading eyebrow="Opportunity capture" title="One pain point at a time" />
          <p className="command-muted">Start with the manual work. A good candidate has a named owner, a control rationale, and approved tools before it has code.</p>
          <div className="command-form-grid">
            <label className="command-form-full"><span>Workflow</span><input required value={form.workflow} onChange={(event) => setForm({ ...form, workflow: event.target.value })} placeholder="e.g., Evidence request tracking or access-review population analysis" /></label>
            <label className="command-form-full"><span>Manual pain point</span><textarea required rows={3} value={form.painPoint} onChange={(event) => setForm({ ...form, painPoint: event.target.value })} placeholder="What repeats, delays review, or creates avoidable error risk?" /></label>
            <label><span>Control risk addressed</span><input value={form.controlRisk} onChange={(event) => setForm({ ...form, controlRisk: event.target.value })} placeholder="Completeness, timeliness, access, traceability" /></label>
            <label><span>Expected benefit</span><input value={form.expectedBenefit} onChange={(event) => setForm({ ...form, expectedBenefit: event.target.value })} placeholder="Time saved, population coverage, fewer misses" /></label>
            <label><span>Sponsor or process owner</span><input value={form.sponsor} onChange={(event) => setForm({ ...form, sponsor: event.target.value })} placeholder="Role, not client identity" /></label>
            <label><span>Approved tools only</span><input value={form.approvedTools} onChange={(event) => setForm({ ...form, approvedTools: event.target.value })} placeholder="Confirm first. Never assume." /></label>
          </div>
          <button type="submit" className="command-primary-button"><Lightbulb className="h-4 w-4" /> Add candidate</button>
        </form>
        <div className="command-automation-list">
          {candidates.length === 0 ? (
            <div className="command-empty-state command-panel"><Zap className="h-5 w-5" /> Watch how the team works first. Strong starting candidates are generic PBC tracking, approved access review analysis, controlled change reconciliation, or log-exception triage.</div>
          ) : candidates.map((candidate) => (
            <article className="command-panel command-automation-card" key={candidate.id}>
              <div className="command-automation-card-top"><div><p className="command-eyebrow">{candidate.stage}</p><h3>{candidate.workflow}</h3></div><select value={candidate.stage} onChange={(event) => updateCandidate(candidate.id, { stage: event.target.value as AutomationStage })}>{automationStages.map((stage) => <option key={stage}>{stage}</option>)}</select></div>
              <p><strong>Pain:</strong> {candidate.painPoint}</p>
              {candidate.controlRisk && <p><strong>Control:</strong> {candidate.controlRisk}</p>}
              {candidate.expectedBenefit && <p><strong>Benefit:</strong> {candidate.expectedBenefit}</p>}
              <label><span>Validation result</span><input value={candidate.validationResult} onChange={(event) => updateCandidate(candidate.id, { validationResult: event.target.value })} placeholder="How will you know the result is defensible?" /></label>
              <label><span>Measured impact</span><input value={candidate.measuredImpact} onChange={(event) => updateCandidate(candidate.id, { measuredImpact: event.target.value })} placeholder="Value demonstrated after pilot" /></label>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RoadmapView({ goals, tasks, evidenceRecords, exportSnapshot, importSnapshot }: { goals: Goal[]; tasks: PlannedTask[]; evidenceRecords: EvidenceRecord[]; exportSnapshot: () => PlanningSnapshot; importSnapshot: (snapshot: unknown) => boolean }) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [backupMessage, setBackupMessage] = useState("");
  const openTaskCount = tasks.filter((task) => task.status !== "Done").length;

  const downloadBackup = () => {
    const snapshot = exportSnapshot();
    const file = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `kpmg-performance-command-center-${snapshot.selectedDate}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setBackupMessage("Backup exported. Keep it in a private personal location, never with client material.");
  };

  const importBackup = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const accepted = importSnapshot(JSON.parse(String(reader.result)));
        setBackupMessage(accepted ? "Backup restored. Review your selected date and current plan." : "That file is not a valid command-center backup.");
      } catch {
        setBackupMessage("That file could not be read as a valid backup.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Annual operating system</p>
        <h2>North star to next physical action.</h2>
        <p>A timer tracks effort. This system tracks useful outcomes, dated proof, feedback, and career leverage. The rating is not predicted here. The evidence is made ready here.</p>
      </section>
      <section className="command-goal-grid">
        {goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
      </section>
      <section className="command-panel command-roadmap-table">
        <SectionHeading eyebrow="Sep 2026 to Sep 2027" title="The high-performance route" />
        <div className="command-roadmap-rows">
          <div><span>21-24 Sep 2026</span><strong>KBAC sprint and Academy capture</strong><p>Pass the General Test, map the firm, start your evidence habit.</p></div>
          <div><span>Late Sep-Nov 2026</span><strong>Learn the method and become reviewer-safe</strong><p>Clean workpapers, core ITGC fluency, early escalation, feedback after meaningful tasks.</p></div>
          <div><span>Dec 2026-Mar 2027</span><strong>Own a bounded area and scope the pilot</strong><p>Identify a safe automation opportunity, obtain sponsor and approval before build.</p></div>
          <div><span>Apr-Jun 2027</span><strong>Operate one level higher</strong><p>Make the improvement useful, increase ownership, help peers, and create adoption evidence.</p></div>
          <div><span>Jul-Sep 2027</span><strong>Close gaps and package credible proof</strong><p>Ask directly what still needs to be true for a Rating 1 case. No surprise self-rating.</p></div>
        </div>
      </section>
      <section className="command-two-up">
        <div className="command-panel">
          <SectionHeading eyebrow="Current state" title="Keep score, not pressure" />
          <div className="command-state-list"><div><span>Open tasks</span><strong>{openTaskCount}</strong></div><div><span>Evidence records</span><strong>{evidenceRecords.length}</strong></div><div><span>Weekly operating rule</span><strong>60% capacity</strong></div></div>
          <p className="command-muted">Maximum three must-win outcomes each week: delivery, mastery, leverage. A new urgent task must displace, defer, or resize something else.</p>
        </div>
        <div className="command-panel command-backup-panel">
          <SectionHeading eyebrow="Private local backup" title="Own your continuity" />
          <p className="command-muted">This app saves in this browser&apos;s local storage. Export weekly. The backup contains your private plans and should never contain confidential KPMG or client data.</p>
          <div className="command-backup-actions"><button type="button" className="command-primary-button" onClick={downloadBackup}><Download className="h-4 w-4" /> Export backup</button><button type="button" className="command-quiet-button" onClick={() => fileInput.current?.click()}><FileUp className="h-4 w-4" /> Import backup</button><input ref={fileInput} className="sr-only" type="file" accept="application/json" onChange={importBackup} /></div>
          {backupMessage && <p className="command-inline-note"><Check className="h-4 w-4" /> {backupMessage}</p>}
        </div>
      </section>
      <SafetyNote />
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const typeIcon: Record<Goal["type"], typeof Target> = { Exam: BookOpenCheck, Performance: Trophy, Automation: Zap, Capability: ShieldCheck };
  const Icon = typeIcon[goal.type];
  return (
    <article className="command-goal-card">
      <div className="command-goal-card-top"><div className="command-goal-icon"><Icon className="h-4 w-4" /></div><span>{goal.type}</span></div>
      <h3>{goal.title}</h3>
      <p>{goal.definitionOfDone}</p>
      <div className="command-goal-footer"><span>Target</span><strong>{dateLabel(goal.targetDate, { month: "short", year: "numeric" })}</strong></div>
    </article>
  );
}
