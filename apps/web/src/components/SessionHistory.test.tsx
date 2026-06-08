import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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

  it("shows an empty state when there are no sessions", async () => {
    render(<SessionHistory />);

    await screen.findByText("Recent Sessions");
    expect(screen.getByText("No sessions yet. Start focusing!")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear all sessions" })).not.toBeInTheDocument();
  });

  it("shows stats for the last 8 sessions only", async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: Array.from({ length: 10 }, (_, i) => ({
        id: `${i}`,
        type: (i % 3 === 0 ? "work" : i % 3 === 1 ? "shortBreak" : "longBreak") as "work" | "shortBreak" | "longBreak",
        duration: i % 3 === 0 ? 25 : i % 3 === 1 ? 5 : 15,
        completedAt: now,
      })),
      initialized: true,
    });

    render(<SessionHistory />);

    await screen.findByText("Recent Sessions");
    // 10 sessions, last 8 shown: 3 work, 3 shortBreak, 2 longBreak
    const focusStat = screen.getByText("Focus").parentElement;
    const shortStat = screen.getByText("Short").parentElement;
    const longStat = screen.getByText("Long").parentElement;

    expect(focusStat).not.toBeNull();
    expect(shortStat).not.toBeNull();
    expect(longStat).not.toBeNull();
    expect(focusStat!.querySelector(".font-black")).toHaveTextContent("3");
    expect(shortStat!.querySelector(".font-black")).toHaveTextContent("3");
    expect(longStat!.querySelector(".font-black")).toHaveTextContent("2");
  });

  it("renders session tiles for the last 8 sessions", async () => {
    const now = new Date().toISOString();
    useSessionStore.setState({
      sessions: [
        { id: "1", type: "work", duration: 25, completedAt: now },
        { id: "2", type: "longBreak", duration: 15, completedAt: now },
      ],
      initialized: true,
    });

    render(<SessionHistory />);

    await screen.findByText("Recent Sessions");
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
