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
const REENTRY_DATE = mondayOnOrAfter(DEFAULT_DATE);

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function addDays(date: string, amount: number): string {
  const [year, month, day] = date.split("-").map(Number);
  const result = new Date(year, month - 1, day + amount);
  return `${result.getFullYear()}-${String(result.getMonth() + 1).padStart(2, "0")}-${String(result.getDate()).padStart(2, "0")}`;
}

function mondayOnOrAfter(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const value = new Date(year, month - 1, day);
  const offset = (8 - value.getDay()) % 7;
  value.setDate(value.getDate() + offset);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

const defaultGoals: Goal[] = [
  {
    id: "goal-engagement",
    title: "Deliver clean first-engagement outputs",
    type: "Capability",
    targetDate: "2027-01-31",
    definitionOfDone: "Assigned engagement outputs are clear, evidence-led, and pass review with fewer repeated notes across cycles.",
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
    title: "Deliver one approved client-valued assurance improvement",
    type: "Capability",
    targetDate: "2027-04-05",
    definitionOfDone: "One sponsor-approved, tested, documented improvement tied to a real assurance pain point. It may be a control diagnostic, API test approach, data analysis, workflow, reusable assessment, or automation.",
    whyItMatters: "Modern Technology Risk creates practical, repeatable client value. Automation is one route, not the only route.",
    successMetric: "A bounded contribution with a named sponsor, approved tools, clear control purpose, validation, and evidence of value.",
    sponsor: "Engagement Manager / Sponsor",
    dimensions: ["Stretch contribution", "Deliver impact", "Inspire trust"],
    status: "Active",
  },
  {
    id: "goal-reviewer-safe",
    title: "Become a trusted delivery analyst across Technology Risk work",
    type: "Capability",
    targetDate: "2026-12-14",
    definitionOfDone: "Reliable workpapers and evidence, sound core control judgement, early escalation, and the ability to learn the method across assigned assurance work.",
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
    title: "Confirm my first workstream and definition of done",
    category: "Delivery",
    priority: "Must",
    plannedDate: REENTRY_DATE,
    estimatedPomodoros: 2,
    nextAction: "Ask the senior or manager what I own first, who reviews it, and what a clean first delivery looks like.",
    definitionOfDone: "My first deliverable, reviewer, deadline, and quality bar are clear.",
    evidenceExpected: "A private generic note of the assignment and agreed success criteria.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-engagement",
  },
  {
    id: "task-engagement-review-note",
    title: "Map one assigned process from objective to evidence",
    category: "Delivery",
    priority: "Must",
    plannedDate: addDays(REENTRY_DATE, 1),
    estimatedPomodoros: 2,
    nextAction: "For the assigned work, sketch the objective, process, risk, control, test, and evidence chain using approved work systems.",
    definitionOfDone: "The chain is explained clearly to the senior, with open questions surfaced early.",
    evidenceExpected: "Generic learning note only. Client evidence stays in approved firm systems.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-reviewer-safe",
  },
  {
    id: "task-cisa-diagnostic",
    title: "Clarify the team's current assurance portfolio",
    category: "Career",
    priority: "Must",
    plannedDate: addDays(REENTRY_DATE, 2),
    estimatedPomodoros: 1,
    nextAction: "Ask how Advisory Tech Risk and Audit divide work, and what ICFR and revenue assurance mean on the current engagements.",
    definitionOfDone: "I have a practical view of the team's live priorities, my role, and the terms that need deeper study.",
    evidenceExpected: "A generic practice map with no client names or sensitive details.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-engagement",
  },
  {
    id: "task-automation-candidates",
    title: "Translate API experience into an assurance question",
    category: "Technical mastery",
    priority: "Could",
    plannedDate: addDays(REENTRY_DATE, 3),
    estimatedPomodoros: 2,
    nextAction: "On a local or synthetic API only, map inventory, authentication, authorization, change, logging, and test evidence to control questions.",
    definitionOfDone: "A one-page generic API assurance map, with no live endpoint testing and no client information.",
    evidenceExpected: "A personal learning artifact using a toy API or synthetic data.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-engagement",
  },
  {
    id: "task-improvement-path",
    title: "Agree how to develop a useful solution contribution",
    category: "Career",
    priority: "Should",
    plannedDate: addDays(REENTRY_DATE, 4),
    estimatedPomodoros: 1,
    nextAction: "Ask which approved tools, reusable assets, and sponsor path the team uses before proposing a build.",
    definitionOfDone: "One next learning priority and a safe route to contribute are agreed, or parked pending a real assignment.",
    evidenceExpected: "Generic notes on the next step, never client data or workpapers.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-automation",
  },
];

const defaultDailyPlans: DailyPlan[] = [
  {
    date: REENTRY_DATE,
    energy: "Normal",
    winCondition: "By close of day, I know today's delivery, the quality bar, and the next action. No assumptions about the workstream.",
    firstFocusBlock: "Reconnect with the team, confirm today's priority and how the senior wants the output returned.",
    fixedCommitments: "Engagement calls, deadlines, and firm training.",
    reflection: "",
    evidenceNote: "",
    tomorrowFirstFocusBlock: "Write one concrete next action from today's assignment before closing the laptop.",
  },
];

const defaultWeeklyPlan: WeeklyPlan = {
  weekOf: REENTRY_DATE,
  theme: "Engagement mode: learn the method",
  focusCapacity: 10,
  contingencyCapacity: 4,
  deliveryWin: "Confirm my first deliverable, quality bar, deadline, and reviewer, then move the assigned work forward.",
  masteryWin: "Map one assigned assurance process from objective and risk through control, test, and evidence.",
  leverageWin: "Identify one relevant modern assurance learning thread, then validate it with the team before building anything.",
  behaviourFocus: "Listen first, clarify ownership, surface blockers early, and close the loop.",
  feedbackRequest: "Ask my senior what would make my next deliverable easier to review.",
  risks: "Team portfolio and tool choices are working hypotheses until confirmed. No client data, names, live endpoint tests, or working papers in this tool.",
  reviewNotes: "",
};

const defaultYearPlan: YearlyPlan = {
  year: 2026,
  northStar: "Rating 1 evidence readiness by September 2027",
  definitionOfWinning:
    "A dated body of evidence: strong assigned delivery, quality and trust, a sponsor-approved client-valued improvement, visible learning, and meaningful contribution to peers.",
  nonNegotiables:
    "Protect client data. Escalate early. Sleep is a control activity. Ask for feedback instead of waiting for it.",
  milestones: [
    { id: "ms-q4-2026", quarter: "Q4 2026", title: "Re-enter, confirm the live portfolio, and deliver cleanly on assigned work", done: false },
    { id: "ms-q1-2027", quarter: "Q1 2027", title: "Build depth in a team-prioritised assurance domain and agree a bounded contribution", done: false },
    { id: "ms-q2-2027", quarter: "Q2 2027", title: "Deliver one approved client-valued improvement by 5 April, then show adoption or reuse", done: false },
    { id: "ms-q3-2027", quarter: "Q3 2027", title: "Operate above analyst baseline and review Rating 1 evidence with the counsellor", done: false },
  ],
};

const defaultMonthlyPlans: MonthlyPlan[] = [
  {
    month: DEFAULT_DATE.slice(0, 7),
    theme: "Re-entry, delivery quality, and practice mapping",
    habit: "At close of each workday, capture one generic proof point, one lesson, and tomorrow's first action.",
    outcomes: [
      { id: "mo-workpaper", title: "Deliver assigned work to the agreed quality bar and capture review lessons", done: false },
      { id: "mo-cisa", title: "Confirm the team's live priorities and choose one bounded learning thread", done: false },
      { id: "mo-evidence", title: "Maintain a weekly generic evidence ledger and request specific feedback", done: false },
    ],
    reviewNotes: "",
  },
];

const defaultStudyTracks: StudyTrack[] = [
  {
    id: "track-itgc",
    name: "ITGC and engagement readiness",
    description: "The assurance foundation: ITGCs, IT application controls, evidence quality, walkthroughs, and Nigerian banking context. Important, but not the whole Advisory Tech Risk practice.",
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
    description: "KBAC study cycle closed. Test result is not recorded in this tracker. Kept as an archived reference.",
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
  {
    id: "track-modern-assurance",
    name: "Modern Technology Assurance",
    description: "A practical map of the broader Advisory offer. Validate current service boundaries and priorities with the team before going deep.",
    status: "Active",
    guideUrl: "technology_assurance_field_guide.html",
    topics: [
      { id: "modern-ai", title: "AI governance, implementation risks, and control evidence", status: "Not started" },
      { id: "modern-api", title: "API and microservices governance, lifecycle, and assurance", status: "Not started" },
      { id: "modern-cloud", title: "Cloud governance and control responsibilities", status: "Not started" },
      { id: "modern-devsecops", title: "DevSecOps and controls observability", status: "Not started" },
      { id: "modern-transformation", title: "Digital transformation and implementation assurance", status: "Not started" },
      { id: "modern-attestation", title: "Compliance certification and attestation work", status: "Not started" },
      { id: "modern-revenue-icfr", title: "Revenue assurance and ICFR context, scope to confirm", status: "Not started" },
      { id: "modern-emerging-esg", title: "Emerging technology and technology ESG governance", status: "Not started" },
    ],
  },
  {
    id: "track-api-automation",
    name: "API, Data, and Intelligent Workflows",
    description: "A skill bridge from backend engineering into control design, assurance testing, and approved automation. Use only synthetic or approved data and environments.",
    status: "Planned",
    guideUrl: "technology_assurance_field_guide.html",
    topics: [
      { id: "api-control-map", title: "Map API inventory, authentication, authorization, secrets, change, and logs to controls", status: "Not started" },
      { id: "api-test-design", title: "Design scoped API control tests and distinguish assurance from functional or security testing", status: "Not started" },
      { id: "api-evidence", title: "Capture repeatable test steps, expected results, exceptions, and evidence", status: "Not started" },
      { id: "workflow-governance", title: "Power Automate permissions, connectors, approvals, exceptions, and monitoring", status: "Not started" },
      { id: "fabric-governance", title: "Microsoft Fabric data access, lineage, quality, and controlled analytics", status: "Not started" },
      { id: "population-testing", title: "Use Python, SQL, or approved platforms for repeatable population testing", status: "Not started" },
      { id: "solution-productisation", title: "Turn a repeated client pain point into a governed, reusable solution", status: "Not started" },
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
    selectedDate: REENTRY_DATE,
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
    goal.id === "goal-kbac"
      ? {
          ...goal,
          title: "KBAC study cycle complete",
          type: "Capability" as GoalType,
          status: "Complete" as GoalStatus,
          definitionOfDone: "The KBAC study cycle is closed. This entry records completion of the learning system, not an exam result.",
          whyItMatters: "Keep the completed Academy material available as a reference without leaving it on the active study queue.",
        }
      : goal
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
    selectedDate: old.selectedDate < REENTRY_DATE ? REENTRY_DATE : old.selectedDate,
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

function migrateV2(old: Partial<PlanningSnapshot> & { selectedDate: string }): PlanningSnapshot {
  const previousGoalTitles: Record<string, string> = {
    "goal-engagement": "Deliver clean first-engagement workpapers",
    "goal-automation": "Ship one approved automation contribution",
    "goal-reviewer-safe": "Become reviewer-safe in Technology Risk",
  };
  const goals = safeArray(old.goals, defaultGoals).map((goal) => {
    const fresh = defaultGoals.find((item) => item.id === goal.id);
    return fresh && previousGoalTitles[goal.id] === goal.title ? { ...fresh, status: goal.status } : goal;
  });
  for (const goal of defaultGoals) if (!goals.some((item) => item.id === goal.id)) goals.push(goal);

  const previousTaskTitles: Record<string, string> = {
    "task-engagement-walkthrough": "Complete one ITGC walkthrough on my first workstream",
    "task-engagement-review-note": "Turn one review note into a fixed habit",
    "task-cisa-diagnostic": "Run the CISA diagnostic and set the study rhythm",
    "task-automation-candidates": "Capture three safe automation candidates from real workflows",
  };
  const tasks = safeArray(old.tasks, defaultTasks).map((task) => {
    const fresh = defaultTasks.find((item) => item.id === task.id);
    if (!fresh || task.status === "Done" || previousTaskTitles[task.id] !== task.title) return task;
    return { ...fresh, status: task.status, carryCount: task.carryCount, carryReason: task.carryReason };
  });
  for (const task of defaultTasks) if (!tasks.some((item) => item.id === task.id)) tasks.push(task);

  const savedWeekly = old.weeklyPlan && typeof old.weeklyPlan === "object" ? old.weeklyPlan : defaultWeeklyPlan;
  const previousWeeklyDeliveryWin = "Produce one review-ready workpaper section.";
  const weeklyPlan =
    savedWeekly.deliveryWin === previousWeeklyDeliveryWin
      ? { ...defaultWeeklyPlan, reviewNotes: savedWeekly.reviewNotes }
      : savedWeekly;

  const savedYear = old.yearPlan && typeof old.yearPlan === "object" ? old.yearPlan : defaultYearPlan;
  const previousMilestones: Record<string, string> = {
    "ms-q4-2026": "Reviewer-safe: clean workpapers, ITGC fluency, early escalation",
    "ms-q1-2027": "CISA study rhythm running and one automation candidate approved",
    "ms-q2-2027": "Own a bounded area and produce adoption evidence for the automation",
    "ms-q3-2027": "Package the Rating 1 case with no year-end surprises",
  };
  const milestones = savedYear.milestones.map((milestone) => {
    const fresh = defaultYearPlan.milestones.find((item) => item.id === milestone.id);
    return fresh && previousMilestones[milestone.id] === milestone.title ? { ...fresh, done: milestone.done } : milestone;
  });
  for (const milestone of defaultYearPlan.milestones) if (!milestones.some((item) => item.id === milestone.id)) milestones.push(milestone);
  const yearPlan = {
    ...savedYear,
    northStar: savedYear.northStar === "Rating 1 evidence readiness by September 2027" ? defaultYearPlan.northStar : savedYear.northStar,
    definitionOfWinning: savedYear.definitionOfWinning.startsWith("A dated body of evidence: strong delivery, one approved automation contribution")
      ? defaultYearPlan.definitionOfWinning
      : savedYear.definitionOfWinning,
    milestones,
  };

  const monthlyPlans = safeArray<MonthlyPlan>(old.monthlyPlans, []).map((plan) => {
    if (plan.month !== REENTRY_DATE.slice(0, 7) || plan.theme !== "Engagement delivery foundations") return plan;
    const fresh = defaultMonthlyPlans[0];
    return { ...fresh, month: plan.month, outcomes: fresh.outcomes.map((outcome) => ({ ...outcome, done: plan.outcomes.find((item) => item.id === outcome.id)?.done ?? false })), reviewNotes: plan.reviewNotes };
  });
  if (!monthlyPlans.some((plan) => plan.month === REENTRY_DATE.slice(0, 7))) monthlyPlans.push(defaultMonthlyPlans[0]);

  const oldTracks = safeArray<StudyTrack>(old.studyTracks, []);
  const studyTracks = oldTracks.map((track) => {
    if (track.id === "track-kbac") {
      return {
        ...track,
        status: "Archived" as const,
        description: track.description.startsWith("Passed on 24 September 2026")
          ? defaultStudyTracks.find((item) => item.id === "track-kbac")!.description
          : track.description,
        guideUrl: "kbac_study_guide.html",
      };
    }
    if (track.id === "track-itgc" && track.description === "The working knowledge for live engagements: ITGC categories, application controls, evidence, and client walkthroughs.") {
      return { ...track, description: defaultStudyTracks.find((item) => item.id === "track-itgc")!.description };
    }
    return track;
  });
  for (const track of defaultStudyTracks) if (!studyTracks.some((item) => item.id === track.id)) studyTracks.push(track);

  const dailyPlans = safeArray(old.dailyPlans, defaultDailyPlans).map((plan) => plan);
  if (!dailyPlans.some((plan) => plan.date === REENTRY_DATE)) dailyPlans.push(defaultDailyPlans[0]);

  return {
    version: 2,
    selectedDate: old.selectedDate < REENTRY_DATE ? REENTRY_DATE : old.selectedDate,
    goals,
    tasks,
    dailyPlans,
    weeklyPlan,
    yearPlan,
    monthlyPlans,
    evidenceRecords: safeArray(old.evidenceRecords, []),
    automationCandidates: safeArray(old.automationCandidates, []),
    studyTracks,
    engagements: safeArray(old.engagements, []),
  };
}

function readSnapshot(input: unknown): PlanningSnapshot | null {
  if (!input || typeof input !== "object") return null;
  const candidate = input as { version?: unknown; selectedDate?: unknown };
  if (typeof candidate.selectedDate !== "string") return null;

  if (candidate.version === 2) {
    const stored = candidate as unknown as Partial<PlanningSnapshot>;
    return migrateV2({ ...stored, selectedDate: candidate.selectedDate });
  }

  if (candidate.version === 1) {
    return migrateV2(migrateV1(input as V1Snapshot));
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
