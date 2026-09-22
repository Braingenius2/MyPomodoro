"use client";

import { create } from "zustand";

export type GoalType = "Exam" | "Performance" | "Automation" | "Capability";
export type GoalStatus = "Active" | "Paused" | "Complete";
export type TaskCategory = "Delivery" | "KBAC" | "Technical mastery" | "Automation" | "Career" | "Admin";
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

export interface StudyModule {
  id: string;
  title: string;
  academyScope: string;
  plainRule: string;
  example: string;
  trap: string;
  recall: string[];
  techRiskLink: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
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

export const KBAC_MODULES: StudyModule[] = [
  {
    id: "accounting-equation",
    title: "Accounting equation",
    academyScope: "Confirmed Academy topic: Introduction to Basic Accounting.",
    plainRule: "Assets are what a business controls. Liabilities are what it owes. Equity is the residual interest. Assets = Liabilities + Equity must always balance.",
    example: "A firm receives N1,000,000 from an owner and uses N400,000 to buy equipment. Assets are cash N600,000 plus equipment N400,000. Equity is N1,000,000. The equation balances.",
    trap: "Profit is not cash. A credit sale may increase profit and receivables without increasing cash today.",
    recall: ["What happens to assets and equity when an owner invests cash?", "If a company buys equipment with cash, which two asset accounts change?", "Why must the equation balance after every transaction?"],
    techRiskLink: "Systems must preserve completeness and accuracy of financial postings. A broken interface can make a ledger look balanced while omitting a population elsewhere.",
  },
  {
    id: "debits-credits",
    title: "Debits and credits",
    academyScope: "Confirmed Academy topic: The Double-Entry Principle.",
    plainRule: "Every transaction has at least one debit and one credit, and total debits equal total credits. Debit increases assets and expenses. Credit increases liabilities, equity, and revenue.",
    example: "Pay N80,000 rent: debit Rent Expense N80,000, credit Cash N80,000. Expense rises and cash falls.",
    trap: "Debit does not mean good and credit does not mean bad. They are left and right sides of an account, not moral verdicts.",
    recall: ["Which side increases an asset?", "Record a cash sale of N50,000.", "Why is an unbalanced trial balance a red flag?"],
    techRiskLink: "Application controls often enforce balanced journal entries. Your audit question is whether the system prevents or flags invalid postings.",
  },
  {
    id: "double-entry",
    title: "Double entry in practice",
    academyScope: "Confirmed Academy topic: The Double-Entry Principle.",
    plainRule: "Double entry creates an audit trail from source transaction to ledger. A journal entry should identify accounts, amounts, date, description, and approval where required.",
    example: "Buy inventory on credit for N250,000: debit Inventory N250,000, credit Accounts Payable N250,000.",
    trap: "A balanced entry can still be wrong. It may hit the wrong account, period, entity, or cost centre.",
    recall: ["What is the entry for a credit purchase of inventory?", "Name two ways a balanced journal can still be erroneous.", "Why is a journal approval workflow a control?"],
    techRiskLink: "For a bank or ERP client, look for who can post, who can approve, what is automated, and whether logs support traceability.",
  },
  {
    id: "finance-function",
    title: "Finance function",
    academyScope: "Confirmed Academy topic: Roles and Responsibilities of a Finance Function.",
    plainRule: "Finance plans, records, controls, reports, and explains money. Typical responsibilities include record-to-report, procure-to-pay, order-to-cash, treasury, budgeting, tax, and financial control.",
    example: "In procure-to-pay, an approved purchase request becomes a purchase order, goods receipt, supplier invoice, payment, and reconciliation.",
    trap: "Finance owns many controls, but IT often operates the systems, access, interfaces, and change process those controls rely on.",
    recall: ["Name the core stages of procure-to-pay.", "What does record-to-report produce?", "Where could segregation of duties fail in a payment process?"],
    techRiskLink: "Technology Risk maps business process risk to ITGCs and IT application controls. Know the process first, then test the technology dependency.",
  },
  {
    id: "financial-statements",
    title: "Financial statements and analysis",
    academyScope: "Confirmed Academy topics: Financial Statement Analysis and Components of a Complete Set of Financial Statements.",
    plainRule: "The financial position statement shows assets, liabilities, and equity at a point in time. Profit or loss shows performance over a period. Cash flows explain movements in cash. Notes give necessary detail and accounting policy context.",
    example: "High reported profit with weak operating cash flow can signal slow collections, aggressive revenue recognition, or a working-capital story that needs explanation.",
    trap: "Cash flow is not simply the profit and loss statement in another outfit. Non-cash charges and working-capital movements matter.",
    recall: ["Which statement explains cash movement?", "What is the basic purpose of notes to financial statements?", "Why might profit and cash flow differ?"],
    techRiskLink: "Understand which applications, interfaces, reports, and end-of-day jobs feed the financial statements. That is where IT assurance becomes financial assurance.",
  },
  {
    id: "ifrs",
    title: "IFRS purpose and judgement",
    academyScope: "Confirmed Academy topic: Introduction to International Financial Reporting Standards.",
    plainRule: "IFRS provides a common basis for preparing general-purpose financial statements. It focuses on faithful representation, relevance, comparability, and adequate disclosure.",
    example: "An entity should apply a consistent accounting policy unless a change is required or improves reliability and relevance, with appropriate disclosure.",
    trap: "IFRS is not a single checklist that removes judgement. Estimates, assumptions, controls, and disclosures still matter.",
    recall: ["Why does comparability matter to users of financial statements?", "What is the difference between a policy and an estimate?", "Why should a system change be assessed for financial-reporting impact?"],
    techRiskLink: "A system migration or report logic change can affect IFRS reporting. Change-management evidence matters because financial-reporting logic must remain controlled.",
  },
  {
    id: "business-processes",
    title: "Key business processes",
    academyScope: "Confirmed Academy topic: Key Business Processes.",
    plainRule: "Processes convert inputs into controlled outputs. Learn the trigger, people, systems, approvals, records, exceptions, reconciliations, and reporting for each process.",
    example: "Order-to-cash: customer order, credit check, fulfilment, invoice, collection, cash application, reconciliation, reporting.",
    trap: "A process narrative is incomplete if it lists happy-path steps but ignores exceptions, overrides, interfaces, and reconciliations.",
    recall: ["What is the first question in a walkthrough?", "Where can an override appear in a business process?", "Why do reconciliations matter?"],
    techRiskLink: "This is the bridge to ITACs. A three-way match, credit limit, approval threshold, or duplicate-invoice check can be an application control.",
  },
  {
    id: "nigerian-tax",
    title: "Nigerian tax system",
    academyScope: "Confirmed Academy topic: An Overview of the Nigerian Tax System.",
    plainRule: "For the Academy test, know the conceptual difference between tax policy, tax administration, taxpayers, tax bases, filing, payment, assessment, and enforcement. Use the Academy material for any rates or thresholds.",
    example: "A tax process control might validate taxpayer data, calculate a liability under approved rules, route a return for review, and retain an evidence trail.",
    trap: "Do not memorise stale rates from random notes. Nigeria's tax administration changed in 2026, so use current official material and the Academy handout for exam-specific detail.",
    recall: ["What is the difference between a tax base and a tax rate?", "Why does a tax return need review and approval?", "What evidence would support a tax payment?"],
    techRiskLink: "Tax systems and ERP configurations can create financial-reporting risk when master data, rules, or change access are weak.",
  },
  {
    id: "regulators",
    title: "Nigerian financial-system regulators",
    academyScope: "Confirmed Academy topic: Introduction to the Regulators in the Nigerian Financial System.",
    plainRule: "Know each regulator's lane. CBN is central to monetary policy and supervision of banks and payment-system participants. NDIC protects depositors and helps resolve failed insured institutions. SEC regulates Nigeria's capital market. Other bodies have distinct mandates.",
    example: "A commercial bank, payment-service provider, listed issuer, and insurance firm may face different primary regulators and overlapping obligations.",
    trap: "Do not assign every financial-sector issue to the CBN. Match the institution and activity to the regulator's mandate.",
    recall: ["Who protects insured depositors when a covered institution fails?", "Who regulates the Nigerian capital market?", "Why can a fintech face payment-system requirements as well as data-protection obligations?"],
    techRiskLink: "Client risk requirements are often driven by the regulator's rules. Translate the rule into a control objective, evidence request, test procedure, and conclusion.",
  },
];

export const KBAC_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "A company receives N500,000 cash from its owner as capital. Which effect is correct?",
    choices: ["Assets increase and equity increases", "Assets increase and liabilities increase", "Expenses increase and equity decreases", "Assets decrease and revenue increases"],
    answer: 0,
    explanation: "Cash is an asset. Owner capital increases equity, so the accounting equation remains balanced.",
  },
  {
    id: "q2",
    prompt: "A company pays N75,000 rent in cash. What is the correct entry?",
    choices: ["Debit cash, credit rent expense", "Debit rent expense, credit cash", "Debit accounts payable, credit cash", "Debit cash, credit revenue"],
    answer: 1,
    explanation: "Expenses increase on the debit side. Cash decreases on the credit side.",
  },
  {
    id: "q3",
    prompt: "Which statement best explains why net profit and cash from operations can differ?",
    choices: ["Profit ignores all revenue", "Cash flow never includes expenses", "Non-cash items and working-capital movements affect cash", "They must always be identical"],
    answer: 2,
    explanation: "Depreciation, receivables, inventory, payables, and timing differences can make profit and cash move differently.",
  },
  {
    id: "q4",
    prompt: "Which is the clearest example of a segregation-of-duties risk in procure-to-pay?",
    choices: ["One user creates a supplier and approves its payment", "A manager reviews a budget", "A system records a purchase order", "Finance reconciles a bank account"],
    answer: 0,
    explanation: "The same person should not be able to create a supplier and approve payment without an independent check.",
  },
  {
    id: "q5",
    prompt: "What is the primary purpose of IFRS in this context?",
    choices: ["To prescribe every business decision", "To provide a common basis for general-purpose financial reporting", "To replace internal controls", "To determine tax rates"],
    answer: 1,
    explanation: "IFRS supports comparable, relevant, faithfully represented financial reporting. It does not replace controls or tax legislation.",
  },
  {
    id: "q6",
    prompt: "Which body is the apex regulator of Nigeria's capital market?",
    choices: ["NDIC", "SEC", "FRC", "CAC"],
    answer: 1,
    explanation: "The Securities and Exchange Commission regulates the Nigerian capital market and focuses on investor protection and market integrity.",
  },
  {
    id: "q7",
    prompt: "Which outcome best demonstrates that a double-entry posting is complete?",
    choices: ["The journal is approved", "The trial balance has no debit-credit difference", "The transaction is profitable", "Cash has increased"],
    answer: 1,
    explanation: "A balanced trial balance shows debits equal credits. It does not by itself prove the entry is correctly classified or authorised.",
  },
  {
    id: "q8",
    prompt: "Which IT control most directly supports the integrity of financial-report logic after a system update?",
    choices: ["A controlled change-management process with testing and approval", "A larger office space", "A marketing campaign", "A cash-count sheet"],
    answer: 0,
    explanation: "Controlled changes help ensure that system logic is authorised, tested, approved, and traceable before production use.",
  },
  {
    id: "q9",
    prompt: "A reconciliation is most useful because it: ",
    choices: ["Replaces all approvals", "Compares related records and investigates differences", "Guarantees profit", "Eliminates the need for source documents"],
    answer: 1,
    explanation: "Reconciliations detect differences between related records, then require timely investigation and resolution.",
  },
  {
    id: "q10",
    prompt: "A strong Technology Risk analyst reviewing a process should first understand: ",
    choices: ["Only the screen design", "The end-to-end process, risk, control, system dependency, and evidence", "Only the final financial statement", "Only the client contact's job title"],
    answer: 1,
    explanation: "Technology Risk work is grounded in process, risk, control design, operating evidence, and system dependency.",
  },
];

const defaultGoals: Goal[] = [
  {
    id: "goal-kbac",
    title: "Pass the Academy General Test",
    type: "Exam",
    targetDate: "2026-09-24",
    definitionOfDone: "Complete the Academy General Test with a deliberate, time-managed attempt and record lessons immediately after.",
    whyItMatters: "It is the first professional checkpoint. Pass the gate, capture the learning, move forward.",
    successMetric: "Study every confirmed topic, complete the self-test, and attend rested.",
    sponsor: "Self",
    dimensions: ["What you do", "Seek growth"],
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
    id: "task-kbac-diagnostic",
    title: "Run the KBAC diagnostic and repair the two weakest concepts",
    category: "KBAC",
    priority: "Must",
    plannedDate: "2026-09-21",
    estimatedPomodoros: 2,
    nextAction: "Answer the 10-question diagnostic without notes, then review explanations.",
    definitionOfDone: "Score recorded and two weak topics marked for repair.",
    evidenceExpected: "Diagnostic result and corrected notes.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-kbac",
  },
  {
    id: "task-double-entry",
    title: "Practise double entry and finance-function flows",
    category: "KBAC",
    priority: "Must",
    plannedDate: "2026-09-22",
    estimatedPomodoros: 2,
    nextAction: "Complete five journal entries and narrate procure-to-pay aloud.",
    definitionOfDone: "Five entries balance and the process can be explained without notes.",
    evidenceExpected: "Worked entries and one-page process sketch.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-kbac",
  },
  {
    id: "task-fs-regulators",
    title: "Review financial statements, IFRS, business processes, tax concepts and regulators",
    category: "KBAC",
    priority: "Must",
    plannedDate: "2026-09-23",
    estimatedPomodoros: 3,
    nextAction: "Use active recall to explain each topic, then retake the quiz.",
    definitionOfDone: "All modules reach Can explain or Test-ready and weak answers are repaired.",
    evidenceExpected: "Final recall list and quiz score.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-kbac",
  },
  {
    id: "task-test-day",
    title: "KBAC test-day recall only",
    category: "KBAC",
    priority: "Must",
    plannedDate: "2026-09-24",
    estimatedPomodoros: 1,
    nextAction: "Review the recall prompts only. Do not cram new material.",
    definitionOfDone: "Arrive rested, early, and ready to make a calm first attempt.",
    evidenceExpected: "Post-test reflection, not a memory dump during the test.",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    goalId: "goal-kbac",
  },
];

const defaultDailyPlans: DailyPlan[] = [
  {
    date: DEFAULT_DATE,
    energy: "Normal",
    winCondition: "By close of day, I will understand the KBAC format, complete the diagnostic, and know the next physical action for every weak topic.",
    firstFocusBlock: "KBAC diagnostic: accounting equation and debits / credits.",
    fixedCommitments: "KPMG Academy: Open PD and Digital Transformation.",
    reflection: "",
    evidenceNote: "",
    tomorrowFirstFocusBlock: "Five double-entry entries before the Academy accounting sessions.",
  },
];

const defaultWeeklyPlan: WeeklyPlan = {
  weekOf: DEFAULT_DATE,
  theme: "KBAC sprint and Academy capture",
  focusCapacity: 10,
  contingencyCapacity: 4,
  deliveryWin: "Pass the Academy General Test with calm, concept-led preparation.",
  masteryWin: "Explain all confirmed Academy topics without hiding behind slides.",
  leverageWin: "Capture three safe, generic automation opportunities from real workflows. Do not build or pitch a bot yet.",
  behaviourFocus: "Listen actively, contribute with substance, and make reliable notes people can trust.",
  feedbackRequest: "Ask one senior or manager what separates a first-year Analyst rated 1 from a strong Rating 2 in Technology Risk.",
  risks: "Do not trade sleep for panicked cramming. No confidential KPMG or client material belongs in this tool.",
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
    theme: "Academy sprint and firm foundations",
    habit: "Log one evidence record every working day.",
    outcomes: [
      { id: "mo-kbac", title: "Pass the Academy General Test", done: false },
      { id: "mo-map", title: "Map the firm: people, divisions, tools, and where Technology Risk fits", done: false },
      { id: "mo-ritual", title: "Start the weekly review ritual every Friday", done: false },
    ],
    reviewNotes: "",
  },
];

const defaultTopics: StudyTopic[] = KBAC_MODULES.map((module) => ({
  id: module.id,
  title: module.title,
  status: "Not started",
}));

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
  studyTopics: StudyTopic[];
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
  setTopicStatus: (id: string, status: TopicMastery) => void;
  addEvidence: (record: Omit<EvidenceRecord, "id">) => void;
  addAutomationCandidate: (candidate: Omit<AutomationCandidate, "id" | "stage" | "validationResult" | "measuredImpact">) => void;
  updateAutomationCandidate: (id: string, patch: Partial<AutomationCandidate>) => void;
  exportSnapshot: () => PlanningSnapshot;
  importSnapshot: (snapshot: unknown) => boolean;
}

function defaultSnapshot(): PlanningSnapshot {
  return {
    version: 1,
    selectedDate: DEFAULT_DATE,
    goals: defaultGoals,
    tasks: defaultTasks,
    dailyPlans: defaultDailyPlans,
    weeklyPlan: defaultWeeklyPlan,
    yearPlan: defaultYearPlan,
    monthlyPlans: defaultMonthlyPlans,
    evidenceRecords: [],
    automationCandidates: [],
    studyTopics: defaultTopics,
  };
}

function safeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function readSnapshot(input: unknown): PlanningSnapshot | null {
  if (!input || typeof input !== "object") return null;
  const candidate = input as Partial<PlanningSnapshot>;
  if (candidate.version !== 1 || typeof candidate.selectedDate !== "string") return null;

  return {
    version: 1,
    selectedDate: candidate.selectedDate,
    goals: safeArray(candidate.goals, defaultGoals),
    tasks: safeArray(candidate.tasks, defaultTasks),
    dailyPlans: safeArray(candidate.dailyPlans, defaultDailyPlans),
    weeklyPlan: candidate.weeklyPlan && typeof candidate.weeklyPlan === "object" ? candidate.weeklyPlan : defaultWeeklyPlan,
    yearPlan: candidate.yearPlan && typeof candidate.yearPlan === "object" ? candidate.yearPlan : defaultYearPlan,
    monthlyPlans: safeArray(candidate.monthlyPlans, defaultMonthlyPlans),
    evidenceRecords: safeArray(candidate.evidenceRecords, []),
    automationCandidates: safeArray(candidate.automationCandidates, []),
    studyTopics: safeArray(candidate.studyTopics, defaultTopics),
  };
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

  setTopicStatus: (topicId, status) =>
    set((state) => ({
      studyTopics: state.studyTopics.map((topic) => (topic.id === topicId ? { ...topic, status } : topic)),
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
      version: 1,
      selectedDate: state.selectedDate,
      goals: state.goals,
      tasks: state.tasks,
      dailyPlans: state.dailyPlans,
      weeklyPlan: state.weeklyPlan,
      yearPlan: state.yearPlan,
      monthlyPlans: state.monthlyPlans,
      evidenceRecords: state.evidenceRecords,
      automationCandidates: state.automationCandidates,
      studyTopics: state.studyTopics,
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
        version: 1,
        selectedDate: state.selectedDate,
        goals: state.goals,
        tasks: state.tasks,
        dailyPlans: state.dailyPlans,
        weeklyPlan: state.weeklyPlan,
        yearPlan: state.yearPlan,
        monthlyPlans: state.monthlyPlans,
        evidenceRecords: state.evidenceRecords,
        automationCandidates: state.automationCandidates,
        studyTopics: state.studyTopics,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn("Could not save the performance command center", error);
    }
  });
}
