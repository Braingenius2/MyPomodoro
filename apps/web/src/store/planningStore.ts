"use client";

import { create } from "zustand";

export type GoalType = "Exam" | "Performance" | "Automation" | "Capability";
export type GoalStatus = "Active" | "Paused" | "Complete";
export type TaskCategory = "Delivery" | "Study" | "Technical mastery" | "Automation" | "Career" | "Admin";
export type TaskPriority = "Must" | "Should" | "Could";
export type TaskStatus = "Open" | "Done" | "Deferred";
export type TopicMastery = "Not started" | "Learning" | "Can explain" | "Test-ready";
export type EnergyLevel = "Low" | "Normal" | "High";
export type AutomationStage = "Observed pain" | "Candidate" | "Sponsor" | "Approval" | "Build" | "Validate" | "Pilot" | "Adopt" | "Document impact";

export type PerformanceDimension =
  | "What you do"
  | "Stretch contribution"
  | "Seek growth"
  | "Inspire trust"
  | "Deliver impact"
  | "Peer contribution";

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetDate: string;
  definitionOfDone: string;
  whyItMatters: string;
  successMetric: string;
  sponsor: string;
  dimensions: PerformanceDimension[];
  status: GoalStatus;
}

export interface PlannedTask {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  plannedDate: string;
  estimatedPomodoros: number;
  nextAction: string;
  definitionOfDone: string;
  evidenceExpected: string;
  status: TaskStatus;
  carryCount: number;
  carryReason: string;
  goalId?: string;
}

export interface DailyPlan {
  date: string;
  energy: EnergyLevel;
  winCondition: string;
  firstFocusBlock: string;
  fixedCommitments: string;
  reflection: string;
  evidenceNote: string;
  tomorrowFirstFocusBlock: string;
}

export interface WeeklyPlan {
  weekOf: string;
  theme: string;
  focusCapacity: number;
  contingencyCapacity: number;
  deliveryWin: string;
  masteryWin: string;
  leverageWin: string;
  behaviourFocus: string;
  feedbackRequest: string;
  risks: string;
  reviewNotes: string;
}

export interface QuarterlyMilestone {
  id: string;
  quarter: string;
  title: string;
  done: boolean;
}

export interface YearlyPlan {
  year: number;
  northStar: string;
  definitionOfWinning: string;
  nonNegotiables: string;
  milestones: QuarterlyMilestone[];
}

export interface MonthlyOutcome {
  id: string;
  title: string;
  done: boolean;
}

export interface MonthlyPlan {
  month: string;
  theme: string;
  habit: string;
  outcomes: MonthlyOutcome[];
  reviewNotes: string;
}

export interface EvidenceRecord {
  id: string;
  date: string;
  engagementAlias: string;
  context: string;
  action: string;
  output: string;
  impact: string;
  stakeholder: string;
  feedback: string;
  dimensions: PerformanceDimension[];
  proofReference: string;
}

export interface AutomationCandidate {
  id: string;
  workflow: string;
  painPoint: string;
  controlRisk: string;
  expectedBenefit: string;
  sponsor: string;
  approvedTools: string;
  stage: AutomationStage;
  validationResult: string;
  measuredImpact: string;
}

export interface StudyTopic {
  id: string;
  title: string;
  status: TopicMastery;
}

export interface StudyTrack {
  id: string;
  name: string;
  description: string;
  status: "Active" | "Planned" | "Archived";
  guideUrl: string;
  topics: StudyTopic[];
}

export type EngagementRequestStatus = "Open" | "Received" | "Blocked";

export interface EngagementRequest {
  id: string;
  title: string;
  status: EngagementRequestStatus;
  due: string;
}

export interface EngagementRecord {
  id: string;
  alias: string;
  workstream: string;
  role: string;
  startDate: string;
  endDate: string;
  reviewNotes: string;
  lessons: string;
  requests: EngagementRequest[];
}

const STORAGE_KEY = "kpmg-performance-command-center-v1";

function todayISO(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

const DEFAULT_DATE = todayISO();

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function addDays(date: string, amount: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(year, month - 1, day + amount);
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
}

const defaultGoals: Goal[] = [
  {
    id: "goal-engagement",
    title: "Deliver clean first-engagement workpapers",
    type: "Capability",
    targetDate: "2027-01-31",
    definitionOfDone: "Workpaper sections that pass review with minimal notes on the first pass, on at least one live workstream.",
    whyItMatters: "Delivery quality is what earns trust and the freedom to do stretch work later.",
    successMetric: "Review notes declining across cycles and direct senior feedback on progress.",
    sponsor: "Senior / Manager",
    dimensions: ["What you do", "Inspire trust", "Seek growth"],
    status: "Active",
  },
  {
    id: "goal-rating",
    title: "Build a credible Rating 1 evidence case",
    type: "Performance",
    targetDate: "2027-09-30",
    definitionOfDone: "A dated body of evidence showing exceptional role delivery, stretch contribution, trusted behaviours, and meaningful peer impact.",
    whyItMatters: "A Rating 1 is a firm judgement, not a spreadsheet forecast. This system makes the supporting case visible and current.",
    successMetric: "Strong evidence in each relevant dimension, candid manager feedback, and no year-end surprises.",
    sponsor: "Counsellor / Manager",
    dimensions: ["What you do", "Stretch contribution", "Seek growth", "Inspire trust", "Deliver impact", "Peer contribution"],
    status: "Active",
  },
  {
    id: "goal-automation",
    title: "Ship one approved automation contribution",
    type: "Automation",
    targetDate: "2027-03-14",
    definitionOfDone: "An approved, tested, documented and repeatable workflow or analytic with a clear owner and evidence of value.",
    whyItMatters: "It aligns directly with Technology Risk leadership's focus on automation and population-level testing.",
    successMetric: "One sponsor-approved pilot or adopted improvement, never built with confidential client data in personal tools.",
    sponsor: "Engagement Manager / Sponsor",
    dimensions: ["Stretch contribution", "Deliver impact", "Inspire trust"],
    status: "Active",
  },
  {
    id: "goal-reviewer-safe",
    title: "Become reviewer-safe in Technology Risk",
    type: "Capability",
    targetDate: "2026-12-14",
    definitionOfDone: "Reliable working papers, evidence discipline, core ITGC fluency, early escalation, and feedback that improves between cycles.",
    whyItMatters: "Core quality earns the trust that creates room for stretch work.",
    successMetric: "Cleaner first drafts, fewer repeated review notes, and direct feedback captured after meaningful tasks.",
    sponsor: "Senior / Manager",
    dimensions: ["What you do", "Inspire trust", "Seek growth"],
    status: "Active",
  },
];

const defaultTasks: PlannedTask[] = [
  {
    id: "task-engagement-walkthrough",
    title: "Complete one ITGC walkthrough on my first workstream",
    category: "Delivery",
    priority: "Must",
    plannedDate: DEFAULT_DATE,
    estimatedPomodoros: 2,
    nextAction: "Ask the senior for the process narrative and the evidence request list.",
    definitionOfDone: "Walkthrough notes captured and validated with the process owner.",
    evidenceExpected: "Dated walkthrough notes and the open questions list.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-engagement",
  },
  {
    id: "task-engagement-review-note",
    title: "Turn one review note into a fixed habit",
    category: "Delivery",
    priority: "Must",
    plannedDate: addDays(DEFAULT_DATE, 1),
    estimatedPomodoros: 2,
    nextAction: "List the review notes received this week and pick the one that repeats.",
    definitionOfDone: "The fix is applied and the next draft passes that check.",
    evidenceExpected: "Before and after workpaper section.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-reviewer-safe",
  },
  {
    id: "task-cisa-diagnostic",
    title: "Run the CISA diagnostic and set the study rhythm",
    category: "Technical mastery",
    priority: "Should",
    plannedDate: addDays(DEFAULT_DATE, 3),
    estimatedPomodoros: 2,
    nextAction: "Take a 20-question CISA domain 1 diagnostic and log the weak areas.",
    definitionOfDone: "Baseline score recorded and a weekly study slot booked.",
    evidenceExpected: "Diagnostic score and the study slot in the calendar.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-engagement",
  },
  {
    id: "task-automation-candidates",
    title: "Capture three safe automation candidates from real workflows",
    category: "Automation",
    priority: "Should",
    plannedDate: addDays(DEFAULT_DATE, 5),
    estimatedPomodoros: 1,
    nextAction: "Log each candidate with the pain point, control risk, and approved tools only.",
    definitionOfDone: "Three candidates in the pipeline with a named process owner.",
    evidenceExpected: "Automation pipeline entries, generic and non-confidential.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-automation",
  },
];

const defaultDailyPlans: DailyPlan[] = [
  {
    date: DEFAULT_DATE,
    energy: "Normal",
    winCondition: "By close of day, I will have moved one delivery result, one capability result, and one leverage result forward.",
    firstFocusBlock: "Review yesterday's review notes, then start the highest-value workpaper section.",
    fixedCommitments: "Engagement calls, deadlines, and firm training.",
    reflection: "",
    evidenceNote: "",
    tomorrowFirstFocusBlock: "Choose the next physical action before you close the laptop.",
  },
];

const defaultWeeklyPlan: WeeklyPlan = {
  weekOf: DEFAULT_DATE,
  theme: "Engagement mode: learn the method",
  focusCapacity: 10,
  contingencyCapacity: 4,
  deliveryWin: "Produce one review-ready workpaper section.",
  masteryWin: "Explain the ITGC walkthrough end to end without notes.",
  leverageWin: "Capture one safe automation candidate from a real workflow.",
  behaviourFocus: "Ask early, document clearly, and make the reviewer's life easy.",
  feedbackRequest: "Ask the senior what one thing would make the next draft cleaner.",
  risks: "No client data, names, or working papers in this tool. Escalate blockers early instead of absorbing them.",
  reviewNotes: "",
};

const defaultYearPlan: YearlyPlan = {
  year: 2026,
  northStar: "Rating 1 evidence readiness by September 2027",
  definitionOfWinning:
    "A dated body of evidence: strong delivery, one approved automation contribution, reviewer-safe working papers, and feedback that improves every cycle.",
  nonNegotiables:
    "Protect client data. Escalate early. Sleep is a control activity. Ask for feedback instead of waiting for it.",
  milestones: [
    { id: "ms-q4-2026", quarter: "Q4 2026", title: "Reviewer-safe: clean workpapers, ITGC fluency, early escalation", done: false },
    { id: "ms-q1-2027", quarter: "Q1 2027", title: "CISA study rhythm running and one automation candidate approved", done: false },
    { id: "ms-q2-2027", quarter: "Q2 2027", title: "Own a bounded area and produce adoption evidence for the automation", done: false },
    { id: "ms-q3-2027", quarter: "Q3 2027", title: "Package the Rating 1 case with no year-end surprises", done: false },
  ],
};

const defaultMonthlyPlans: MonthlyPlan[] = [
  {
    month: DEFAULT_DATE.slice(0, 7),
    theme: "Engagement delivery foundations",
    habit: "Log one evidence record every working day.",
    outcomes: [
      { id: "mo-workpaper", title: "Own one workstream area with review-ready workpapers", done: false },
      { id: "mo-cisa", title: "Run the CISA diagnostic and set the December study rhythm", done: false },
      { id: "mo-evidence", title: "Keep the evidence ledger current every week", done: false },
    ],
    reviewNotes: "",
  },
];

const defaultStudyTracks: StudyTrack[] = [
  {
    id: "track-itgc",
    name: "ITGC and engagement readiness",
    description: "The working knowledge for live engagements: ITGC categories, application controls, evidence, and client walkthroughs.",
    status: "Active",
    guideUrl: "",
    topics: [
      { id: "itgc-access", title: "Access to programs and data", status: "Not started" },
      { id: "itgc-change", title: "Change management", status: "Not started" },
      { id: "itgc-ops", title: "Computer operations", status: "Not started" },
      { id: "itgc-dev", title: "Program development", status: "Not started" },
      { id: "itac-basics", title: "IT application controls and automated testing", status: "Not started" },
      { id: "evidence-workpapers", title: "Evidence, working papers, and review notes", status: "Not started" },
      { id: "walkthrough-craft", title: "Client walkthroughs and process narratives", status: "Not started" },
      { id: "cbn-context", title: "CBN IT standards and the Nigerian banking context", status: "Not started" },
    ],
  },
  {
    id: "track-cisa",
    name: "CISA domains",
    description: "Planned for the December to March window. Five domains, one exam, no wasted motion.",
    status: "Planned",
    guideUrl: "",
    topics: [
      { id: "cisa-1", title: "Domain 1: Information systems auditing process", status: "Not started" },
      { id: "cisa-2", title: "Domain 2: Governance and management of IT", status: "Not started" },
      { id: "cisa-3", title: "Domain 3: Information systems acquisition, development and implementation", status: "Not started" },
      { id: "cisa-4", title: "Domain 4: Information systems operations and business resilience", status: "Not started" },
      { id: "cisa-5", title: "Domain 5: Protection of information assets", status: "Not started" },
    ],
  },
  {
    id: "track-kbac",
    name: "KBAC Academy (archived)",
    description: "Passed on 24 September 2026. Kept for reference, with the full interactive guide still available.",
    status: "Archived",
    guideUrl: "kbac_study_guide.html",
    topics: [
      { id: "accounting-equation", title: "Accounting equation", status: "Not started" },
      { id: "debits-credits", title: "Debits and credits", status: "Not started" },
      { id: "double-entry", title: "Double entry in practice", status: "Not started" },
      { id: "finance-function", title: "Finance function", status: "Not started" },
      { id: "financial-statements", title: "Financial statements and analysis", status: "Not started" },
      { id: "ifrs", title: "IFRS purpose and judgement", status: "Not started" },
      { id: "business-processes", title: "Key business processes", status: "Not started" },
      { id: "nigerian-tax", title: "Nigerian tax system", status: "Not started" },
      { id: "regulators", title: "Nigerian financial-system regulators", status: "Not started" },
    ],
  },
];

export interface PlanningSnapshot {
  version: number;
  selectedDate: string;
  goals: Goal[];
  tasks: PlannedTask[];
  dailyPlans: DailyPlan[];
  weeklyPlan: WeeklyPlan;
  yearPlan: YearlyPlan;
  monthlyPlans: MonthlyPlan[];
  evidenceRecords: EvidenceRecord[];
  automationCandidates: AutomationCandidate[];
  studyTracks: StudyTrack[];
  engagements: EngagementRecord[];
}

interface PlanningState extends PlanningSnapshot {
  initialized: boolean;
  initialize: () => void;
  setSelectedDate: (date: string) => void;
  updateDailyPlan: (date: string, patch: Partial<Omit<DailyPlan, "date">>) => void;
  updateWeeklyPlan: (patch: Partial<WeeklyPlan>) => void;
  updateYearPlan: (patch: Partial<Omit<YearlyPlan, "milestones">>) => void;
  addMilestone: (quarter: string, title: string) => void;
  toggleMilestone: (id: string) => void;
  updateMonthlyPlan: (month: string, patch: Partial<Omit<MonthlyPlan, "month" | "outcomes">>) => void;
  addMonthlyOutcome: (month: string, title: string) => void;
  toggleMonthlyOutcome: (month: string, outcomeId: string) => void;
  removeMonthlyOutcome: (month: string, outcomeId: string) => void;
  addTask: (task: Omit<PlannedTask, "id" | "status" | "carryCount" | "carryReason">) => void;
  updateTask: (id: string, patch: Partial<PlannedTask>) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  deferTask: (id: string, reason: string) => void;
  rehashTomorrow: () => number;
  setTrackTopicStatus: (trackId: string, topicId: string, status: TopicMastery) => void;
  addEngagement: (record: Omit<EngagementRecord, "id" | "requests">) => void;
  updateEngagement: (engagementId: string, patch: Partial<Omit<EngagementRecord, "id" | "requests">>) => void;
  removeEngagement: (engagementId: string) => void;
  addEngagementRequest: (engagementId: string, title: string, due: string) => void;
  updateEngagementRequest: (engagementId: string, requestId: string, patch: Partial<Omit<EngagementRequest, "id">>) => void;
  removeEngagementRequest: (engagementId: string, requestId: string) => void;
  addEvidence: (record: Omit<EvidenceRecord, "id">) => void;
  addAutomationCandidate: (candidate: Omit<AutomationCandidate, "id" | "stage" | "validationResult" | "measuredImpact">) => void;
  updateAutomationCandidate: (id: string, patch: Partial<AutomationCandidate>) => void;
  exportSnapshot: () => PlanningSnapshot;
  importSnapshot: (snapshot: unknown) => boolean;
}

function defaultSnapshot(): PlanningSnapshot {
  return {
    version: 2,
    selectedDate: DEFAULT_DATE,
    goals: defaultGoals,
    tasks: defaultTasks,
    dailyPlans: defaultDailyPlans,
    weeklyPlan: defaultWeeklyPlan,
    yearPlan: defaultYearPlan,
    monthlyPlans: defaultMonthlyPlans,
    evidenceRecords: [],
    automationCandidates: [],
    studyTracks: defaultStudyTracks,
    engagements: [],
  };
}

function safeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

interface V1Snapshot {
  version: 1;
  selectedDate: string;
  goals?: Goal[];
  tasks?: PlannedTask[];
  dailyPlans?: DailyPlan[];
  weeklyPlan?: WeeklyPlan;
  yearPlan?: YearlyPlan;
  monthlyPlans?: MonthlyPlan[];
  evidenceRecords?: EvidenceRecord[];
  automationCandidates?: AutomationCandidate[];
  studyTopics?: StudyTopic[];
}

const ACADEMY_TASK_IDS = ["task-kbac-diagnostic", "task-double-entry", "task-fs-regulators", "task-test-day"];
const ACADEMY_WEEKLY_THEME = "KBAC sprint and Academy capture";
const ACADEMY_MONTHLY_THEME = "Academy sprint and firm foundations";
const ACADEMY_DAILY_PREFIX = "By close of day, I will understand the KBAC format";

function migrateV1(old: V1Snapshot): PlanningSnapshot {
  const goals = safeArray(old.goals, defaultGoals).map((goal) =>
    goal.id === "goal-kbac" ? { ...goal, status: "Complete" as GoalStatus } : goal
  );
  const hasEngagementGoal = goals.some((goal) => goal.id === "goal-engagement");
  const nextGoals = hasEngagementGoal ? goals : [defaultGoals[0], ...goals];

  const tasks = safeArray(old.tasks, defaultTasks).filter(
    (task) => !(ACADEMY_TASK_IDS.includes(task.id) && task.status === "Open" && task.carryCount === 0)
  );
  const nextTasks = tasks.length > 0 ? tasks : defaultTasks;

  const kbacTopics = safeArray<StudyTopic>(old.studyTopics, []);
  const studyTracks = defaultStudyTracks.map((track) =>
    track.id === "track-kbac" && kbacTopics.length > 0 ? { ...track, topics: kbacTopics } : track
  );

  const storedWeekly = old.weeklyPlan && typeof old.weeklyPlan === "object" ? old.weeklyPlan : defaultWeeklyPlan;
  const weeklyPlan =
    storedWeekly.theme === ACADEMY_WEEKLY_THEME
      ? { ...defaultWeeklyPlan, weekOf: storedWeekly.weekOf || DEFAULT_DATE }
      : storedWeekly;

  const dailyPlans = safeArray(old.dailyPlans, defaultDailyPlans).map((plan) =>
    plan.winCondition.startsWith(ACADEMY_DAILY_PREFIX) ? { ...defaultDailyPlans[0], date: plan.date } : plan
  );

  const monthlyPlans = safeArray(old.monthlyPlans, defaultMonthlyPlans).map((plan) =>
    plan.theme === ACADEMY_MONTHLY_THEME ? { ...defaultMonthlyPlans[0], month: plan.month } : plan
  );

  return {
    version: 2,
    selectedDate: old.selectedDate,
    goals: nextGoals,
    tasks: nextTasks,
    dailyPlans: dailyPlans.length > 0 ? dailyPlans : defaultDailyPlans,
    weeklyPlan,
    yearPlan: old.yearPlan && typeof old.yearPlan === "object" ? old.yearPlan : defaultYearPlan,
    monthlyPlans: monthlyPlans.length > 0 ? monthlyPlans : defaultMonthlyPlans,
    evidenceRecords: safeArray(old.evidenceRecords, []),
    automationCandidates: safeArray(old.automationCandidates, []),
    studyTracks,
    engagements: [],
  };
}

function readSnapshot(input: unknown): PlanningSnapshot | null {
  if (!input || typeof input !== "object") return null;
  const candidate = input as { version?: unknown; selectedDate?: unknown };
  if (typeof candidate.selectedDate !== "string") return null;

  if (candidate.version === 2) {
    const stored = candidate as unknown as Partial<PlanningSnapshot>;
    return {
      version: 2,
      selectedDate: candidate.selectedDate,
      goals: safeArray(stored.goals, defaultGoals),
      tasks: safeArray(stored.tasks, defaultTasks),
      dailyPlans: safeArray(stored.dailyPlans, defaultDailyPlans),
      weeklyPlan: stored.weeklyPlan && typeof stored.weeklyPlan === "object" ? stored.weeklyPlan : defaultWeeklyPlan,
      yearPlan: stored.yearPlan && typeof stored.yearPlan === "object" ? stored.yearPlan : defaultYearPlan,
      monthlyPlans: safeArray(stored.monthlyPlans, defaultMonthlyPlans),
      evidenceRecords: safeArray(stored.evidenceRecords, []),
      automationCandidates: safeArray(stored.automationCandidates, []),
      studyTracks: safeArray(stored.studyTracks, defaultStudyTracks),
      engagements: safeArray(stored.engagements, []),
    };
  }

  if (candidate.version === 1) {
    return migrateV1(input as V1Snapshot);
  }

  return null;
}

function createMonthPlan(month: string): MonthlyPlan {
  return { month, theme: "", habit: "", outcomes: [], reviewNotes: "" };
}

function createPlan(date: string): DailyPlan {
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

export const usePlanningStore = create<PlanningState>((set, get) => ({
  ...defaultSnapshot(),
  initialized: false,

  initialize: () => {
    if (typeof window === "undefined" || get().initialized) return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? readSnapshot(JSON.parse(stored)) : null;
      set({ ...(parsed ?? defaultSnapshot()), initialized: true });
    } catch {
      set({ ...defaultSnapshot(), initialized: true });
    }
  },

  setSelectedDate: (selectedDate) => set({ selectedDate }),

  updateDailyPlan: (date, patch) =>
    set((state) => {
      const existing = state.dailyPlans.find((plan) => plan.date === date) ?? createPlan(date);
      const nextPlan = { ...existing, ...patch };
      const found = state.dailyPlans.some((plan) => plan.date === date);
      return {
        dailyPlans: found
          ? state.dailyPlans.map((plan) => (plan.date === date ? nextPlan : plan))
          : [...state.dailyPlans, nextPlan],
      };
    }),

  updateWeeklyPlan: (patch) => set((state) => ({ weeklyPlan: { ...state.weeklyPlan, ...patch } })),

  updateYearPlan: (patch) => set((state) => ({ yearPlan: { ...state.yearPlan, ...patch } })),

  addMilestone: (quarter, title) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return {};
      return {
        yearPlan: {
          ...state.yearPlan,
          milestones: [...state.yearPlan.milestones, { id: id("milestone"), quarter, title: trimmed, done: false }],
        },
      };
    }),

  toggleMilestone: (milestoneId) =>
    set((state) => ({
      yearPlan: {
        ...state.yearPlan,
        milestones: state.yearPlan.milestones.map((milestone) =>
          milestone.id === milestoneId ? { ...milestone, done: !milestone.done } : milestone
        ),
      },
    })),

  updateMonthlyPlan: (month, patch) =>
    set((state) => {
      const existing = state.monthlyPlans.find((plan) => plan.month === month) ?? createMonthPlan(month);
      const nextPlan = { ...existing, ...patch };
      return {
        monthlyPlans: state.monthlyPlans.some((plan) => plan.month === month)
          ? state.monthlyPlans.map((plan) => (plan.month === month ? nextPlan : plan))
          : [...state.monthlyPlans, nextPlan],
      };
    }),

  addMonthlyOutcome: (month, title) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return {};
      const existing = state.monthlyPlans.find((plan) => plan.month === month) ?? createMonthPlan(month);
      const nextPlan = { ...existing, outcomes: [...existing.outcomes, { id: id("outcome"), title: trimmed, done: false }] };
      return {
        monthlyPlans: state.monthlyPlans.some((plan) => plan.month === month)
          ? state.monthlyPlans.map((plan) => (plan.month === month ? nextPlan : plan))
          : [...state.monthlyPlans, nextPlan],
      };
    }),

  toggleMonthlyOutcome: (month, outcomeId) =>
    set((state) => ({
      monthlyPlans: state.monthlyPlans.map((plan) =>
        plan.month === month
          ? {
              ...plan,
              outcomes: plan.outcomes.map((outcome) =>
                outcome.id === outcomeId ? { ...outcome, done: !outcome.done } : outcome
              ),
            }
          : plan
      ),
    })),

  removeMonthlyOutcome: (month, outcomeId) =>
    set((state) => ({
      monthlyPlans: state.monthlyPlans.map((plan) =>
        plan.month === month ? { ...plan, outcomes: plan.outcomes.filter((outcome) => outcome.id !== outcomeId) } : plan
      ),
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: id("task"), status: "Open", carryCount: 0, carryReason: "" }],
    })),

  updateTask: (taskId, patch) =>
    set((state) => ({ tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, ...patch } : task)) })),

  setTaskStatus: (taskId, status) =>
    set((state) => ({ tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)) })),

  deferTask: (taskId, reason) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              plannedDate: addDays(task.plannedDate, 1),
              status: "Deferred",
              carryCount: task.carryCount + 1,
              carryReason: reason || "Replanned during daily closeout",
            }
          : task
      ),
    })),

  rehashTomorrow: () => {
    const { selectedDate, tasks, dailyPlans } = get();
    const tomorrow = addDays(selectedDate, 1);
    const unfinished = tasks.filter((task) => task.plannedDate === selectedDate && task.status !== "Done");
    const currentPlan = dailyPlans.find((plan) => plan.date === selectedDate) ?? createPlan(selectedDate);
    const existingTomorrow = dailyPlans.find((plan) => plan.date === tomorrow) ?? createPlan(tomorrow);
    const tomorrowPlan: DailyPlan = {
      ...existingTomorrow,
      firstFocusBlock: existingTomorrow.firstFocusBlock || currentPlan.tomorrowFirstFocusBlock || unfinished[0]?.nextAction || "",
    };

    set({
      tasks: tasks.map((task) =>
        task.plannedDate === selectedDate && task.status !== "Done"
          ? {
              ...task,
              plannedDate: tomorrow,
              status: "Deferred",
              carryCount: task.carryCount + 1,
              carryReason: "Rehashed during daily closeout",
            }
          : task
      ),
      dailyPlans: dailyPlans.some((plan) => plan.date === tomorrow)
        ? dailyPlans.map((plan) => (plan.date === tomorrow ? tomorrowPlan : plan))
        : [...dailyPlans, tomorrowPlan],
    });
    return unfinished.length;
  },

  setTrackTopicStatus: (trackId, topicId, status) =>
    set((state) => ({
      studyTracks: state.studyTracks.map((track) =>
        track.id === trackId
          ? { ...track, topics: track.topics.map((topic) => (topic.id === topicId ? { ...topic, status } : topic)) }
          : track
      ),
    })),

  addEngagement: (record) =>
    set((state) => ({
      engagements: [{ ...record, id: id("engagement"), requests: [] }, ...state.engagements],
    })),

  updateEngagement: (engagementId, patch) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === engagementId ? { ...engagement, ...patch } : engagement
      ),
    })),

  removeEngagement: (engagementId) =>
    set((state) => ({ engagements: state.engagements.filter((engagement) => engagement.id !== engagementId) })),

  addEngagementRequest: (engagementId, title, due) =>
    set((state) => {
      const trimmed = title.trim();
      if (!trimmed) return {};
      return {
        engagements: state.engagements.map((engagement) =>
          engagement.id === engagementId
            ? {
                ...engagement,
                requests: [
                  ...engagement.requests,
                  { id: id("request"), title: trimmed, status: "Open" as EngagementRequestStatus, due },
                ],
              }
            : engagement
        ),
      };
    }),

  updateEngagementRequest: (engagementId, requestId, patch) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === engagementId
          ? {
              ...engagement,
              requests: engagement.requests.map((request) =>
                request.id === requestId ? { ...request, ...patch } : request
              ),
            }
          : engagement
      ),
    })),

  removeEngagementRequest: (engagementId, requestId) =>
    set((state) => ({
      engagements: state.engagements.map((engagement) =>
        engagement.id === engagementId
          ? { ...engagement, requests: engagement.requests.filter((request) => request.id !== requestId) }
          : engagement
      ),
    })),

  addEvidence: (record) => set((state) => ({ evidenceRecords: [{ ...record, id: id("evidence") }, ...state.evidenceRecords] })),

  addAutomationCandidate: (candidate) =>
    set((state) => ({
      automationCandidates: [
        {
          ...candidate,
          id: id("automation"),
          stage: "Observed pain",
          validationResult: "",
          measuredImpact: "",
        },
        ...state.automationCandidates,
      ],
    })),

  updateAutomationCandidate: (candidateId, patch) =>
    set((state) => ({
      automationCandidates: state.automationCandidates.map((candidate) =>
        candidate.id === candidateId ? { ...candidate, ...patch } : candidate
      ),
    })),

  exportSnapshot: () => {
    const state = get();
    return {
      version: 2,
      selectedDate: state.selectedDate,
      goals: state.goals,
      tasks: state.tasks,
      dailyPlans: state.dailyPlans,
      weeklyPlan: state.weeklyPlan,
      yearPlan: state.yearPlan,
      monthlyPlans: state.monthlyPlans,
      evidenceRecords: state.evidenceRecords,
      automationCandidates: state.automationCandidates,
      studyTracks: state.studyTracks,
      engagements: state.engagements,
    };
  },

  importSnapshot: (input) => {
    const snapshot = readSnapshot(input);
    if (!snapshot) return false;
    set(snapshot);
    return true;
  },
}));

if (typeof window !== "undefined") {
  usePlanningStore.subscribe((state) => {
    if (!state.initialized) return;
    try {
      const snapshot: PlanningSnapshot = {
        version: 2,
        selectedDate: state.selectedDate,
        goals: state.goals,
        tasks: state.tasks,
        dailyPlans: state.dailyPlans,
        weeklyPlan: state.weeklyPlan,
        yearPlan: state.yearPlan,
        monthlyPlans: state.monthlyPlans,
        evidenceRecords: state.evidenceRecords,
        automationCandidates: state.automationCandidates,
        studyTracks: state.studyTracks,
        engagements: state.engagements,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn("Could not save the performance command center", error);
    }
  });
}
