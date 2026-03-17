import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionHistory } from "@/components/SessionHistory";
import { useSessionStore } from "@/store/sessionStore";

function resetSessionStore() {
  useSessionStore.setState({
    sessions: [],
    initialized: true,
  });
}

describe("SessionHistory", () => {
  beforeEach(() => {
    resetSessionStore();
    localStorage.clear();
  });

  it("shows a loading skeleton before the store is ready", () => {
    useSessionStore.setState({ initialized: false });
    const { container } = render(<SessionHistory />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows an empty state when there are no sessions today", async () => {
    render(<SessionHistory />);

    await screen.findByText("Today's Log");
    expect(screen.getByText("No sessions yet. Start focusing!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear all sessions" })).not.toBeInTheDocument();
  });

  it("summarizes only today's sessions", async () => {
    const now = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    useSessionStore.setState({
      sessions: [
        { id: "1", type: "work", duration: 25, completedAt: now },
        { id: "2", type: "shortBreak", duration: 5, completedAt: now },
        { id: "3", type: "work", duration: 25, completedAt: yesterday },
      ],
      initialized: true,
    });

    render(<SessionHistory />);

    await screen.findByText("Today's Log");
    expect(screen.getByText("25m")).toBeInTheDocument();

    const focusStat = screen.getByText("Focus").parentElement;
    const shortStat = screen.getByText("Short").parentElement;
    const longStat = screen.getByText("Long").parentElement;

    expect(focusStat).not.toBeNull();
    expect(shortStat).not.toBeNull();
    expect(longStat).not.toBeNull();
    expect(within(focusStat as HTMLElement).getByText("1")).toBeInTheDocument();
    expect(within(shortStat as HTMLElement).getByText("1")).toBeInTheDocument();
    expect(within(longStat as HTMLElement).getByText("0")).toBeInTheDocument();
  });

  it("renders recent session tiles for today", async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: "1", type: "work", duration: 25, completedAt: now },
        { id: "2", type: "longBreak", duration: 15, completedAt: now },
      ],
      initialized: true,
    });

    render(<SessionHistory />);

    await screen.findByText("Today's Log");
    expect(screen.getByTitle("25 min - Focus")).toBeInTheDocument();
    expect(screen.getByTitle("15 min - Long Break")).toBeInTheDocument();
  });

  it("clears stored sessions from the UI", async () => {
    const user = userEvent.setup();
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [{ id: "1", type: "work", duration: 25, completedAt: now }],
      initialized: true,
    });

    render(<SessionHistory />);

    const clearButton = await screen.findByRole("button", { name: "Clear all sessions" });
    await user.click(clearButton);

    await waitFor(() => {
      expect(useSessionStore.getState().sessions).toHaveLength(0);
    });
    expect(screen.getByText("No sessions yet. Start focusing!")).toBeInTheDocument();
  });
});
