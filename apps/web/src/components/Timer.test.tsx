import { beforeEach, describe, expect, it } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Timer } from "@/components/Timer";
import { DEFAULT_SETTINGS, useTimerStore } from "@/store/timerStore";
import { useSessionStore } from "@/store/sessionStore";

const defaultTimerInitialize = useTimerStore.getState().initialize;
const defaultSessionInitialize = useSessionStore.getState().initialize;

function resetStores() {
  useTimerStore.setState({
    mode: "work",
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    alarmActive: false,
    sessionsCompleted: 0,
    settings: DEFAULT_SETTINGS,
    initialized: true,
    lastCompletion: null,
    initialize: defaultTimerInitialize,
  });

  useSessionStore.setState({
    sessions: [],
    initialized: true,
    initialize: defaultSessionInitialize,
  });
}

describe("Timer", () => {
  beforeEach(() => {
    resetStores();
    localStorage.clear();
  });

  it("shows the loading state while stores are initializing", () => {
    useTimerStore.setState({ initialized: false });
    useSessionStore.setState({ initialized: false });
    useTimerStore.setState({ initialize: () => undefined });
    useSessionStore.setState({ initialize: () => undefined });

    render(<Timer />);

    expect(screen.getByText("INITIALIZING")).toBeInTheDocument();
  });

  it("renders the current mode, time, and paused status", async () => {
    render(<Timer />);

    await screen.findByText("25:00");
    expect(screen.getByText("Focus Time")).toBeInTheDocument();
    expect(screen.getByText("Paused")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Focus mode" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("starts and pauses through the main control", async () => {
    const user = userEvent.setup();
    render(<Timer />);

    const startButton = await screen.findByRole("button", { name: /start/i });
    await user.click(startButton);

    expect(useTimerStore.getState().isRunning).toBe(true);
    expect(screen.getByText("Running")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /pause/i }));

    expect(useTimerStore.getState().isRunning).toBe(false);
    expect(screen.getByText("Paused")).toBeInTheDocument();
  });

  it("switches modes from the mode tabs", async () => {
    const user = userEvent.setup();
    render(<Timer />);

    await screen.findByText("25:00");
    await user.click(screen.getByRole("button", { name: "Rest mode" }));

    await waitFor(() => {
      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        timeLeft: 300,
        isRunning: false,
      });
    });
    expect(screen.getByText("Short Rest")).toBeInTheDocument();
  });

  it("resets the current timer back to its full duration", async () => {
    const user = userEvent.setup();
    useTimerStore.setState({ timeLeft: 60 });
    render(<Timer />);

    await screen.findByText("01:00");
    await user.click(screen.getByRole("button", { name: "Reset timer" }));

    await waitFor(() => {
      expect(useTimerStore.getState().timeLeft).toBe(1500);
    });
    expect(screen.getByText("25:00")).toBeInTheDocument();
  });

  it("completes work sessions immediately, shows the alarm state, and logs one session", async () => {
    useTimerStore.setState({ timeLeft: 1, isRunning: true });
    render(<Timer />);

    await screen.findByText("00:01");

    act(() => {
      useTimerStore.getState().tick();
    });

    await waitFor(() => {
      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        sessionsCompleted: 1,
      });
      expect(useSessionStore.getState().sessions).toHaveLength(1);
    });

    expect(screen.getByText("Alarm - Click Start")).toBeInTheDocument();
    expect(screen.getByText("Short Rest")).toBeInTheDocument();
    expect(useSessionStore.getState().sessions[0]).toMatchObject({
      type: "work",
      duration: 25,
    });
  });

  it("auto-starts the next break without showing the alarm prompt", async () => {
    useTimerStore.setState({
      timeLeft: 1,
      isRunning: true,
      settings: {
        ...DEFAULT_SETTINGS,
        autoStartBreaks: true,
      },
    });
    render(<Timer />);

    await screen.findByText("00:01");

    act(() => {
      useTimerStore.getState().tick();
    });

    await waitFor(() => {
      expect(useTimerStore.getState()).toMatchObject({
        mode: "shortBreak",
        isRunning: true,
        sessionsCompleted: 1,
      });
      expect(useSessionStore.getState().sessions).toHaveLength(1);
    });

    expect(screen.getByText("Running")).toBeInTheDocument();
    expect(screen.queryByText("Alarm - Click Start")).not.toBeInTheDocument();
  });
});
