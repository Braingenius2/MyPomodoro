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
    studyTracks: pristine.studyTracks.map((track) => ({ ...track, topics: track.topics.map((topic) => ({ ...topic })) })),
    engagements: [],
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
  });

  describe("study tracks", () => {
    it("updates mastery within one track without touching the others", () => {
      const before = usePlanningStore.getState().studyTracks;
      const itgcTrack = before.find((track) => track.id === "track-itgc")!;
      const firstTopic = itgcTrack.topics[0];

      usePlanningStore.getState().setTrackTopicStatus("track-itgc", firstTopic.id, "Test-ready");

      const after = usePlanningStore.getState().studyTracks;
      const updatedItgc = after.find((track) => track.id === "track-itgc")!;
      const cisaTopic = after.find((track) => track.id === "track-cisa")!.topics[0];

      expect(updatedItgc.topics.find((topic) => topic.id === firstTopic.id)?.status).toBe("Test-ready");
      expect(cisaTopic.status).toBe("Not started");
    });
  });

  describe("engagements", () => {
    it("adds, updates and removes an engagement with requests", () => {
      usePlanningStore.getState().addEngagement({
        alias: "Financial-services access review",
        workstream: "ITGC access testing",
        role: "Analyst",
        startDate: "2026-10-01",
        endDate: "",
        reviewNotes: "",
        lessons: "",
      });

      const engagement = usePlanningStore.getState().engagements[0];
      expect(engagement).toMatchObject({ alias: "Financial-services access review", requests: [] });

      usePlanningStore.getState().addEngagementRequest(engagement.id, "Population extract", "2026-10-05");
      const request = usePlanningStore.getState().engagements[0].requests[0];
      expect(request).toMatchObject({ title: "Population extract", status: "Open" });

      usePlanningStore.getState().updateEngagementRequest(engagement.id, request.id, { status: "Received" });
      expect(usePlanningStore.getState().engagements[0].requests[0].status).toBe("Received");

      usePlanningStore.getState().updateEngagement(engagement.id, { lessons: "Ask earlier for the extract" });
      expect(usePlanningStore.getState().engagements[0].lessons).toBe("Ask earlier for the extract");

      usePlanningStore.getState().removeEngagementRequest(engagement.id, request.id);
      expect(usePlanningStore.getState().engagements[0].requests).toHaveLength(0);

      usePlanningStore.getState().removeEngagement(engagement.id);
      expect(usePlanningStore.getState().engagements).toHaveLength(0);
    });
  });

  describe("snapshots", () => {
    it("round trips the full v2 snapshot", () => {
      usePlanningStore.getState().updateYearPlan({ northStar: "Analytics-led assurance" });
      usePlanningStore.getState().addMonthlyOutcome("2026-10", "Run the CISA diagnostic");

      const snapshot = usePlanningStore.getState().exportSnapshot();
      const restored = usePlanningStore.getState().importSnapshot(JSON.parse(JSON.stringify(snapshot)));

      expect(restored).toBe(true);
      expect(usePlanningStore.getState().version).toBe(2);
      expect(usePlanningStore.getState().yearPlan.northStar).toBe("Analytics-led assurance");
      expect(usePlanningStore.getState().monthlyPlans.find((plan) => plan.month === "2026-10")?.outcomes).toHaveLength(1);
    });

    it("migrates a v1 Academy snapshot into the engagement-era schema", () => {
      const academyWeeklyPlan = {
        weekOf: "2026-09-21",
        theme: "KBAC sprint and Academy capture",
        focusCapacity: 10,
        contingencyCapacity: 4,
        deliveryWin: "Pass the Academy General Test with calm, concept-led preparation.",
        masteryWin: "",
        leverageWin: "",
        behaviourFocus: "",
        feedbackRequest: "",
        risks: "",
        reviewNotes: "",
      };
      const v1Snapshot = {
        version: 1,
        selectedDate: "2026-09-23",
        goals: [
          {
            id: "goal-kbac",
            title: "Pass the Academy General Test",
            type: "Exam",
            targetDate: "2026-09-24",
            definitionOfDone: "",
            whyItMatters: "",
            successMetric: "",
            sponsor: "Self",
            dimensions: ["What you do"],
            status: "Active",
          },
        ],
        tasks: [makeTask({ id: "task-kbac-diagnostic", title: "Run the KBAC diagnostic", category: "Study" })],
        dailyPlans: [],
        weeklyPlan: academyWeeklyPlan,
        monthlyPlans: [
          { month: "2026-09", theme: "Academy sprint and firm foundations", habit: "", outcomes: [], reviewNotes: "" },
        ],
        studyTopics: [{ id: "accounting-equation", title: "Accounting equation", status: "Test-ready" }],
      };

      expect(usePlanningStore.getState().importSnapshot(v1Snapshot)).toBe(true);

      const state = usePlanningStore.getState();
      const kbacTrack = state.studyTracks.find((track) => track.id === "track-kbac");
      const kbacGoal = state.goals.find((goal) => goal.id === "goal-kbac");

      expect(state.version).toBe(2);
      expect(kbacTrack?.status).toBe("Archived");
      expect(kbacTrack?.topics).toHaveLength(1);
      expect(kbacTrack?.topics[0]).toMatchObject({ id: "accounting-equation", status: "Test-ready" });
      expect(kbacGoal?.status).toBe("Complete");
      expect(kbacGoal?.title).toBe("KBAC study cycle complete");
      expect(state.goals.some((goal) => goal.id === "goal-engagement")).toBe(true);
      expect(state.tasks.some((task) => task.id === "task-kbac-diagnostic")).toBe(false);
      expect(state.weeklyPlan.theme).toBe("Engagement mode: learn the method");
      expect(state.monthlyPlans[0].theme).toBe("Re-entry, delivery quality, and practice mapping");
    });

    it("fills v2 defaults for a bare v1 snapshot", () => {
      const restored = usePlanningStore.getState().importSnapshot({ version: 1, selectedDate: "2026-09-22" });

      expect(restored).toBe(true);
      expect(usePlanningStore.getState().yearPlan.northStar).toBeTruthy();
      expect(usePlanningStore.getState().studyTracks.some((track) => track.id === "track-itgc")).toBe(true);
      expect(usePlanningStore.getState().monthlyPlans.length).toBeGreaterThan(0);
    });

    it("keeps a user-edited weekly plan on later v2 loads", () => {
      const base = usePlanningStore.getState().exportSnapshot();
      const edited = {
        ...base,
        weeklyPlan: { ...base.weeklyPlan, deliveryWin: "My own delivery win", theme: "Engagement mode: learn the method" },
      };

      expect(usePlanningStore.getState().importSnapshot(JSON.parse(JSON.stringify(edited)))).toBe(true);
      expect(usePlanningStore.getState().weeklyPlan.deliveryWin).toBe("My own delivery win");
    });

    it("adds the newer study tracks when loading an older v2 snapshot", () => {
      const base = usePlanningStore.getState().exportSnapshot();
      const older = {
        ...base,
        studyTracks: base.studyTracks.filter(
          (track) => track.id !== "track-modern-assurance" && track.id !== "track-api-automation"
        ),
      };

      expect(usePlanningStore.getState().importSnapshot(JSON.parse(JSON.stringify(older)))).toBe(true);
      const ids = usePlanningStore.getState().studyTracks.map((track) => track.id);
      expect(ids).toContain("track-modern-assurance");
      expect(ids).toContain("track-api-automation");
    });

    it("keeps study guide links relative so they work under the GitHub Pages base path", () => {
      for (const track of usePlanningStore.getState().studyTracks) {
        if (track.guideUrl) {
          expect(track.guideUrl.startsWith("/")).toBe(false);
        }
      }
    });

    it("rejects invalid snapshots", () => {
      expect(usePlanningStore.getState().importSnapshot(null)).toBe(false);
      expect(usePlanningStore.getState().importSnapshot({ version: 3, selectedDate: "2026-09-22" })).toBe(false);
      expect(usePlanningStore.getState().importSnapshot({ version: 2 })).toBe(false);
    });
  });
});
