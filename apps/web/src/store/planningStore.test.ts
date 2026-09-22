import { beforeEach, describe, expect, it } from "vitest";
import { PlannedTask, usePlanningStore } from "@/store/planningStore";

const pristine = usePlanningStore.getState();

function resetStore() {
  usePlanningStore.setState({
    selectedDate: "2026-09-22",
    goals: pristine.goals,
    tasks: [],
    dailyPlans: [],
    weeklyPlan: { ...pristine.weeklyPlan },
    yearPlan: { ...pristine.yearPlan, milestones: pristine.yearPlan.milestones.map((milestone) => ({ ...milestone })) },
    monthlyPlans: [],
    evidenceRecords: [],
    automationCandidates: [],
    studyTopics: pristine.studyTopics,
    initialized: true,
  });
}

function makeTask(overrides: Partial<PlannedTask>): PlannedTask {
  return {
    id: "task-1",
    title: "Sample task",
    category: "Delivery",
    priority: "Must",
    plannedDate: "2026-09-22",
    estimatedPomodoros: 1,
    nextAction: "Do the next physical action",
    definitionOfDone: "",
    evidenceExpected: "",
    status: "Open",
    carryCount: 0,
    carryReason: "",
    ...overrides,
  };
}

describe("planningStore", () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
  });

  describe("rehashTomorrow", () => {
    it("moves only unfinished tasks to tomorrow and records the carry", () => {
      usePlanningStore.setState({
        tasks: [
          makeTask({ id: "open", title: "Open task" }),
          makeTask({ id: "done", title: "Finished task", status: "Done" }),
        ],
        dailyPlans: [
          {
            date: "2026-09-22",
            energy: "Normal",
            winCondition: "",
            firstFocusBlock: "",
            fixedCommitments: "",
            reflection: "",
            evidenceNote: "",
            tomorrowFirstFocusBlock: "Prep the evidence pack",
          },
        ],
      });

      const moved = usePlanningStore.getState().rehashTomorrow();
      const state = usePlanningStore.getState();
      const openTask = state.tasks.find((task) => task.id === "open");
      const doneTask = state.tasks.find((task) => task.id === "done");
      const tomorrow = state.dailyPlans.find((plan) => plan.date === "2026-09-23");

      expect(moved).toBe(1);
      expect(openTask).toMatchObject({ plannedDate: "2026-09-23", status: "Deferred", carryCount: 1 });
      expect(openTask?.carryReason).toContain("Rehashed");
      expect(doneTask).toMatchObject({ plannedDate: "2026-09-22", status: "Done", carryCount: 0 });
      expect(tomorrow?.firstFocusBlock).toBe("Prep the evidence pack");
    });
  });

  describe("year plan", () => {
    it("updates the north star without touching milestones", () => {
      const before = usePlanningStore.getState().yearPlan.milestones.length;
      usePlanningStore.getState().updateYearPlan({ northStar: "Own the analytics narrative" });
      const yearPlan = usePlanningStore.getState().yearPlan;

      expect(yearPlan.northStar).toBe("Own the analytics narrative");
      expect(yearPlan.milestones).toHaveLength(before);
    });

    it("adds and toggles quarterly milestones", () => {
      usePlanningStore.getState().addMilestone("Q1 2027", "Learn Clara end to end");
      const added = usePlanningStore.getState().yearPlan.milestones.at(-1);

      expect(added).toMatchObject({ quarter: "Q1 2027", title: "Learn Clara end to end", done: false });

      usePlanningStore.getState().toggleMilestone(added!.id);
      const toggled = usePlanningStore.getState().yearPlan.milestones.find((milestone) => milestone.id === added!.id);
      expect(toggled?.done).toBe(true);
    });
  });

  describe("month plan", () => {
    it("creates a month plan on first outcome and tracks completion", () => {
      usePlanningStore.getState().addMonthlyOutcome("2026-10", "Ship one approved automation pilot");
      const monthPlan = usePlanningStore.getState().monthlyPlans.find((plan) => plan.month === "2026-10");
      const outcome = monthPlan?.outcomes[0];

      expect(monthPlan?.outcomes).toHaveLength(1);
      expect(outcome?.title).toBe("Ship one approved automation pilot");

      usePlanningStore.getState().toggleMonthlyOutcome("2026-10", outcome!.id);
      const toggled = usePlanningStore
        .getState()
        .monthlyPlans.find((plan) => plan.month === "2026-10")
        ?.outcomes.find((item) => item.id === outcome!.id);
      expect(toggled?.done).toBe(true);

      usePlanningStore.getState().removeMonthlyOutcome("2026-10", outcome!.id);
      expect(usePlanningStore.getState().monthlyPlans.find((plan) => plan.month === "2026-10")?.outcomes).toHaveLength(0);
    });

    it("updates theme and review notes for the selected month", () => {
      usePlanningStore.getState().updateMonthlyPlan("2026-09", { theme: "Academy sprint", reviewNotes: "Started strong" });
      const monthPlan = usePlanningStore.getState().monthlyPlans.find((plan) => plan.month === "2026-09");

      expect(monthPlan).toMatchObject({ theme: "Academy sprint", reviewNotes: "Started strong" });
    });
  });

  describe("snapshots", () => {
    it("round trips the full snapshot including year and month plans", () => {
      usePlanningStore.getState().updateYearPlan({ northStar: "Analytics-led assurance" });
      usePlanningStore.getState().addMonthlyOutcome("2026-10", "Run the CISA diagnostic");

      const snapshot = usePlanningStore.getState().exportSnapshot();
      const restored = usePlanningStore.getState().importSnapshot(JSON.parse(JSON.stringify(snapshot)));

      expect(restored).toBe(true);
      expect(usePlanningStore.getState().yearPlan.northStar).toBe("Analytics-led assurance");
      expect(usePlanningStore.getState().monthlyPlans.find((plan) => plan.month === "2026-10")?.outcomes).toHaveLength(1);
    });

    it("fills year and month defaults for older stored snapshots", () => {
      const restored = usePlanningStore.getState().importSnapshot({ version: 1, selectedDate: "2026-09-22" });

      expect(restored).toBe(true);
      expect(usePlanningStore.getState().yearPlan.northStar).toBeTruthy();
      expect(usePlanningStore.getState().monthlyPlans.length).toBeGreaterThan(0);
    });

    it("rejects invalid snapshots", () => {
      expect(usePlanningStore.getState().importSnapshot(null)).toBe(false);
      expect(usePlanningStore.getState().importSnapshot({ version: 2, selectedDate: "2026-09-22" })).toBe(false);
    });
  });
});
