"use client";

import { ChangeEvent, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Brain,
  Briefcase,
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
  EngagementRecord,
  EngagementRequest,
  EvidenceRecord,
  Goal,
  MonthlyPlan,
  PerformanceDimension,
  PlannedTask,
  PlanningSnapshot,
  StudyTrack,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TopicMastery,
  usePlanningStore,
  WeeklyPlan,
  YearlyPlan,
} from "@/store/planningStore";

type TabId = "command" | "horizons" | "study" | "engagements" | "evidence" | "automation" | "roadmap";

const tabs: Array<{ id: TabId; label: string; icon: typeof Target }> = [
  { id: "command", label: "Command", icon: Target },
  { id: "horizons", label: "Horizons", icon: CalendarDays },
  { id: "study", label: "Study", icon: BookOpenCheck },
  { id: "engagements", label: "Engagements", icon: Briefcase },
  { id: "evidence", label: "Rating evidence", icon: Trophy },
  { id: "automation", label: "Solutions", icon: Lightbulb },
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

const taskCategories: TaskCategory[] = ["Delivery", "Study", "Technical mastery", "Automation", "Career", "Admin"];
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
    Study: "bg-amber-400/15 text-amber-100 border-amber-300/30",
    "Technical mastery": "bg-violet-500/15 text-violet-200 border-violet-300/30",
    Automation: "bg-cyan-400/15 text-cyan-100 border-cyan-300/30",
    Career: "bg-emerald-400/15 text-emerald-100 border-emerald-300/30",
    Admin: "bg-slate-400/15 text-slate-200 border-slate-300/25",
  };
  return palette[category];
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
  const studyTracks = usePlanningStore((state) => state.studyTracks);
  const engagements = usePlanningStore((state) => state.engagements);
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
  const setTrackTopicStatus = usePlanningStore((state) => state.setTrackTopicStatus);
  const addEngagement = usePlanningStore((state) => state.addEngagement);
  const updateEngagement = usePlanningStore((state) => state.updateEngagement);
  const removeEngagement = usePlanningStore((state) => state.removeEngagement);
  const addEngagementRequest = usePlanningStore((state) => state.addEngagementRequest);
  const updateEngagementRequest = usePlanningStore((state) => state.updateEngagementRequest);
  const removeEngagementRequest = usePlanningStore((state) => state.removeEngagementRequest);
  const addTask = usePlanningStore((state) => state.addTask);
  const setTaskStatus = usePlanningStore((state) => state.setTaskStatus);
  const deferTask = usePlanningStore((state) => state.deferTask);
  const rehashTomorrow = usePlanningStore((state) => state.rehashTomorrow);
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
  const activeTrackTopics = studyTracks
    .filter((track) => track.status === "Active")
    .flatMap((track) => track.topics);
  const studyReadyCount = activeTrackTopics.filter(
    (topic) => topic.status === "Can explain" || topic.status === "Test-ready"
  ).length;
  const openEngagementRequests = engagements.reduce(
    (total, engagement) => total + engagement.requests.filter((request) => request.status !== "Received").length,
    0
  );
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
        <div className="command-header-actions">
          <div className="command-north-star">
            <Target className="h-4 w-4" />
            <span>{yearPlan.northStar || "Rating 1 evidence readiness by Sep 2027"}</span>
          </div>
          <button type="button" className="command-quiet-button" onClick={() => setActiveTab("study")}>
            <BookOpenCheck className="h-4 w-4" /> Guides
          </button>
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
          studyTopicCount={activeTrackTopics.length}
          openRequestCount={openEngagementRequests}
          evidenceCount={evidenceRecords.length}
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
      {activeTab === "study" && <StudyView studyTracks={studyTracks} setTrackTopicStatus={setTrackTopicStatus} />}
      {activeTab === "engagements" && (
        <EngagementView
          engagements={engagements}
          addEngagement={addEngagement}
          updateEngagement={updateEngagement}
          removeEngagement={removeEngagement}
          addEngagementRequest={addEngagementRequest}
          updateEngagementRequest={updateEngagementRequest}
          removeEngagementRequest={removeEngagementRequest}
        />
      )}
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
  studyTopicCount,
  openRequestCount,
  evidenceCount,
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
  studyTopicCount: number;
  openRequestCount: number;
  evidenceCount: number;
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
        <IconMetric label="Study readiness" value={`${studyReadyCount}/${studyTopicCount}`} icon={Brain} note="Active tracks: can explain or test-ready" />
        <IconMetric label="Evidence ledger" value={evidenceCount} icon={Trophy} note="Dated proof entries" />
        <IconMetric label="Open requests" value={openRequestCount} icon={Briefcase} note="Engagement items to chase" />
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

function StudyView({
  studyTracks,
  setTrackTopicStatus,
}: {
  studyTracks: StudyTrack[];
  setTrackTopicStatus: (trackId: string, topicId: string, status: TopicMastery) => void;
}) {
  const [activeTrackId, setActiveTrackId] = useState(studyTracks[0]?.id ?? "");
  const activeTrack = studyTracks.find((track) => track.id === activeTrackId) ?? studyTracks[0];

  if (!activeTrack) {
    return (
      <div className="command-page command-enter">
        <section className="command-page-intro">
          <p className="command-eyebrow">Learning tracks</p>
          <h2>No study tracks yet.</h2>
          <p>Reload the app to restore the default tracks.</p>
        </section>
      </div>
    );
  }

  const readyCount = activeTrack.topics.filter(
    (topic) => topic.status === "Can explain" || topic.status === "Test-ready"
  ).length;
  const progress = activeTrack.topics.length ? (readyCount / activeTrack.topics.length) * 100 : 0;

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Learning tracks</p>
        <h2>Study what the next engagement needs.</h2>
        <p>KBAC is off the active queue. Keep core controls sharp, then deepen the modern assurance thread your team actually needs. Your backend, Python, and SQL experience gives you a natural bridge into API assurance and controlled analytics.</p>
      </section>

      <section className="command-panel" style={{ marginBottom: 16 }}>
        <SectionHeading eyebrow="Guides and materials" title="The full references, always one click away" />
        <div className="btnrow">
          <a className="command-primary-button" href="kbac_study_guide.html" target="_blank" rel="noreferrer">
            <BookOpenCheck className="h-4 w-4" /> KBAC Elite Study System
          </a>
          <a className="command-primary-button" href="technology_assurance_field_guide.html" target="_blank" rel="noreferrer">
            <ShieldCheck className="h-4 w-4" /> Technology Assurance Field Guide
          </a>
          <a className="command-primary-button" href="banking_icfr_primer.html" target="_blank" rel="noreferrer">
            <ClipboardCheck className="h-4 w-4" /> Banking ICFR Primer
          </a>
          <a className="command-primary-button" href="python_sql_assurance_lab.html" target="_blank" rel="noreferrer">
            <Zap className="h-4 w-4" /> Python and SQL Assurance Lab
          </a>
        </div>
        <p className="command-muted" style={{ marginTop: 12 }}>Each opens as a standalone page in a new tab. Bookmark the ones you use often.</p>
      </section>

      <div className="btnrow" style={{ marginBottom: 16 }}>
        {studyTracks.map((track) => (
          <button
            key={track.id}
            type="button"
            className={track.id === activeTrack.id ? "command-primary-button" : "command-quiet-button"}
            onClick={() => setActiveTrackId(track.id)}
          >
            {track.name} <small style={{ opacity: 0.72 }}>| {track.status}</small>
          </button>
        ))}
      </div>

      <section className="command-panel" style={{ marginBottom: 16 }}>
        <div className="command-progress-heading">
          <span>{activeTrack.description}</span>
          <strong>
            {readyCount} of {activeTrack.topics.length} can be explained or are test-ready
          </strong>
        </div>
        <div className="command-progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        {activeTrack.guideUrl && (
          <p className="command-muted" style={{ marginTop: 12 }}>
            Full interactive guide:{" "}
            <a className="command-inline-link" href={activeTrack.guideUrl} target="_blank" rel="noreferrer">
              {activeTrack.name} guide
            </a>
          </p>
        )}
      </section>

      <section className="command-panel">
        <SectionHeading eyebrow="Topics" title={activeTrack.name} />
        <div className="command-milestones">
          {activeTrack.topics.map((topic) => (
            <div key={topic.id} className="command-milestone" style={{ gridTemplateColumns: "minmax(0, 1fr) 170px" }}>
              <div>
                <span>Topic</span>
                <p>{topic.title}</p>
              </div>
              <select
                value={topic.status}
                onChange={(event) => setTrackTopicStatus(activeTrack.id, topic.id, event.target.value as TopicMastery)}
                aria-label={`${topic.title} mastery`}
              >
                {masteryOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      <SafetyNote />
    </div>
  );
}

function EngagementView({
  engagements,
  addEngagement,
  updateEngagement,
  removeEngagement,
  addEngagementRequest,
  updateEngagementRequest,
  removeEngagementRequest,
}: {
  engagements: EngagementRecord[];
  addEngagement: (record: Omit<EngagementRecord, "id" | "requests">) => void;
  updateEngagement: (engagementId: string, patch: Partial<Omit<EngagementRecord, "id" | "requests">>) => void;
  removeEngagement: (engagementId: string) => void;
  addEngagementRequest: (engagementId: string, title: string, due: string) => void;
  updateEngagementRequest: (
    engagementId: string,
    requestId: string,
    patch: Partial<{ title: string; status: EngagementRequest["status"]; due: string }>
  ) => void;
  removeEngagementRequest: (engagementId: string, requestId: string) => void;
}) {
  const [form, setForm] = useState({ alias: "", workstream: "", role: "", startDate: "", endDate: "" });
  const [requestTitle, setRequestTitle] = useState("");
  const [requestDue, setRequestDue] = useState("");

  const submitEngagement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.alias.trim()) return;
    addEngagement({
      alias: form.alias.trim(),
      workstream: form.workstream.trim(),
      role: form.role.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      reviewNotes: "",
      lessons: "",
    });
    setForm({ alias: "", workstream: "", role: "", startDate: "", endDate: "" });
  };

  const submitRequest = (event: FormEvent<HTMLFormElement>, engagementId: string) => {
    event.preventDefault();
    if (!requestTitle.trim()) return;
    addEngagementRequest(engagementId, requestTitle, requestDue);
    setRequestTitle("");
    setRequestDue("");
  };

  return (
    <div className="command-page command-enter">
      <section className="command-page-intro">
        <p className="command-eyebrow">Engagement log</p>
        <h2>Track the work without leaking the work.</h2>
        <p>Alias-only by design: no client names, no document contents, no confidential detail. Capture your role, the workstream, review notes received, lessons learned, and the requests you are chasing.</p>
      </section>
      <SafetyNote />
      <section className="command-evidence-layout" style={{ marginTop: 16 }}>
        <form className="command-panel command-evidence-form" onSubmit={submitEngagement}>
          <SectionHeading eyebrow="Add an engagement" title="One clean record per workstream." />
          <div className="command-form-grid">
            <label><span>Generic alias</span><input value={form.alias} onChange={(event) => setForm({ ...form, alias: event.target.value })} placeholder="e.g., Financial-services access review" /></label>
            <label><span>Workstream</span><input value={form.workstream} onChange={(event) => setForm({ ...form, workstream: event.target.value })} placeholder="e.g., ITGC access testing" /></label>
            <label><span>Your role</span><input value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })} placeholder="e.g., Analyst, execution support" /></label>
            <label><span>Start date</span><input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label>
            <label><span>End date</span><input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label>
          </div>
          <button type="submit" className="command-primary-button" style={{ marginTop: 14 }}>
            <Briefcase className="h-4 w-4" /> Add engagement
          </button>
        </form>

        <div className="command-evidence-list">
          {engagements.length === 0 ? (
            <div className="command-empty-state command-panel">
              <Briefcase className="h-5 w-5" /> No engagements logged yet. Start with your current workstream, generically described.
            </div>
          ) : (
            engagements.map((engagement) => (
              <article className="command-panel command-automation-card" key={engagement.id}>
                <div className="command-automation-card-top">
                  <div>
                    <p className="command-eyebrow">{engagement.workstream || "Workstream not set"}</p>
                    <h3>{engagement.alias}</h3>
                  </div>
                  <button type="button" className="command-quiet-button" onClick={() => removeEngagement(engagement.id)}>Remove</button>
                </div>
                <p>
                  <strong>Role:</strong> {engagement.role || "Not set"} | <strong>Dates:</strong>{" "}
                  {engagement.startDate || "?"} to {engagement.endDate || "ongoing"}
                </p>
                <label>
                  <span>Review notes received</span>
                  <textarea rows={2} value={engagement.reviewNotes} onChange={(event) => updateEngagement(engagement.id, { reviewNotes: event.target.value })} placeholder="What the reviewer flagged, in generic terms" />
                </label>
                <label>
                  <span>Lessons learned</span>
                  <textarea rows={2} value={engagement.lessons} onChange={(event) => updateEngagement(engagement.id, { lessons: event.target.value })} placeholder="What you would do differently next time" />
                </label>

                <div className="command-milestones">
                  {engagement.requests.map((request) => (
                    <div key={request.id} className="command-milestone" style={{ gridTemplateColumns: "minmax(0, 1fr) 140px 130px auto" }}>
                      <div>
                        <span>Request</span>
                        <p>{request.title}</p>
                      </div>
                      <select
                        value={request.status}
                        onChange={(event) =>
                          updateEngagementRequest(engagement.id, request.id, {
                            status: event.target.value as EngagementRequest["status"],
                          })
                        }
                        aria-label={`${request.title} status`}
                      >
                        <option>Open</option>
                        <option>Received</option>
                        <option>Blocked</option>
                      </select>
                      <input type="date" value={request.due} onChange={(event) => updateEngagementRequest(engagement.id, request.id, { due: event.target.value })} aria-label={`${request.title} due date`} />
                      <button type="button" className="command-quiet-button" onClick={() => removeEngagementRequest(engagement.id, request.id)}>Remove</button>
                    </div>
                  ))}
                </div>

                <form className="command-inline-form" onSubmit={(event) => submitRequest(event, engagement.id)}>
                  <input value={requestTitle} onChange={(event) => setRequestTitle(event.target.value)} placeholder="Add a request you are chasing" maxLength={140} />
                  <input type="date" value={requestDue} onChange={(event) => setRequestDue(event.target.value)} aria-label="Request due date" />
                  <button type="submit" className="command-primary-button"><Plus className="h-4 w-4" /> Add</button>
                </form>
              </article>
            ))
          )}
        </div>
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
        <p className="command-eyebrow">Responsible client solutions pipeline</p>
        <h2>Solve a real assurance problem before reaching for a tool.</h2>
        <p>Your six-month differentiator is a sponsor-approved improvement tied to real risk. It may use AI, APIs, data, workflow, or automation, but it must be safe, validated, useful, documented, and repeatable.</p>
      </section>
      <section className="command-pipeline"><span>Observed pain</span><ArrowRight /><span>Candidate</span><ArrowRight /><span>Sponsor</span><ArrowRight /><span>Approval</span><ArrowRight /><span>Build</span><ArrowRight /><span>Validate</span><ArrowRight /><span>Pilot</span><ArrowRight /><span>Adopt</span></section>
      <section className="command-panel command-automation-warning"><LockKeyhole className="h-5 w-5" /><div><h3>Non-negotiable data rule</h3><p>Never put client data, screenshots, working papers, credentials, client names, or sensitive KPMG information into this app, personal GitHub, a public AI tool, or an unapproved bot. Capture generic workflow observations only.</p></div></section>
      <section className="command-automation-layout">
        <form className="command-panel command-automation-form" onSubmit={submit}>
          <SectionHeading eyebrow="Opportunity capture" title="One pain point at a time" />
          <p className="command-muted">Start with the business or assurance problem. A good candidate has an owner, a control rationale, an approved method, and a way to validate value before it has code.</p>
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
        <SectionHeading eyebrow="Oct 2026 to Sep 2027" title="The high-performance route" />
        <div className="command-roadmap-rows">
          <div><span>Oct 5-16, 2026</span><strong>Re-enter and confirm the real brief</strong><p>Get clear on your first assignment, quality bar, Advisory and Audit boundaries, current work, and approved tools. Treat ICFR scope and team intelligence as questions until confirmed.</p></div>
          <div><span>Oct-Nov 2026</span><strong>Deliver cleanly and map the practice</strong><p>Build trust on assigned work. Keep ITGC and ITAC judgement strong, while learning how revenue assurance, ICFR, and implementation assurance show up in actual engagements.</p></div>
          <div><span>Dec 2026-Feb 2027</span><strong>Choose one modern assurance depth</strong><p>Based on team demand, go deeper in APIs, AI governance, cloud, DevSecOps, data and automation governance, or another live priority. CISA can run alongside this if workload allows.</p></div>
          <div><span>By Apr 5, 2027</span><strong>Deliver one approved value contribution</strong><p>With a sponsor and approved environment, improve a real assurance workflow through a test, analysis, diagnostic, reusable assessment, or automation. Show validation and value.</p></div>
          <div><span>Apr-Sep 2027</span><strong>Operate above analyst baseline and prove it</strong><p>Take more ownership, help peers, show reuse or impact, and review Rating 1 evidence with your counsellor before year-end.</p></div>
        </div>
      </section>
      <section className="command-panel command-roadmap-table">
        <SectionHeading eyebrow="Practice map" title="Foundations stay. The offer gets broader." />
        <div className="command-roadmap-rows">
          <div><span>Assurance foundation</span><strong>ITGC, ITAC, governance, attestation</strong><p>Keep control design, implementation, evidence, and operating effectiveness clear. These skills transfer into modern technology work.</p></div>
          <div><span>Modernisation</span><strong>AI, APIs, cloud, DevSecOps, transformation</strong><p>Ask what is being governed, which risks matter, who owns each control, and what evidence proves it works.</p></div>
          <div><span>Client solutions</span><strong>Revenue assurance, ICFR, data, workflow automation</strong><p>ICFR usually means Internal Control over Financial Reporting. Confirm the team&apos;s exact scope, client context, and your role before treating it as an assigned specialty.</p></div>
          <div><span>Monday questions</span><strong>Find the work before choosing the course</strong><p>Which engagements and deliverables need help now? What sits with Advisory versus Audit? Which tools and reusable assets are approved? What does API testing mean on this team?</p></div>
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
