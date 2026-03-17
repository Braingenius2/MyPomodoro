import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPanel } from "@/components/SettingsPanel";
import { DEFAULT_SETTINGS, useTimerStore } from "@/store/timerStore";

function resetTimerStore() {
  useTimerStore.setState({
    mode: "work",
    timeLeft: DEFAULT_SETTINGS.workDuration * 60,
    isRunning: false,
    alarmActive: false,
    sessionsCompleted: 0,
    settings: DEFAULT_SETTINGS,
    initialized: true,
    lastCompletion: null,
  });
}

describe("SettingsPanel", () => {
  beforeEach(() => {
    resetTimerStore();
    localStorage.clear();
  });

  it("opens and closes the settings dialog", async () => {
    const user = userEvent.setup();
    render(<SettingsPanel />);

    await user.click(await screen.findByRole("button", { name: /settings/i }));
    expect(await screen.findByRole("dialog", { name: "Settings" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Close settings" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Settings" })).not.toBeInTheDocument();
    });
  });

  it("cancels unsaved changes", async () => {
    const user = userEvent.setup();
    render(<SettingsPanel />);

    await user.click(await screen.findByRole("button", { name: /settings/i }));
    fireEvent.change(screen.getByLabelText("Focus"), { target: { value: "30" } });

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(useTimerStore.getState().settings.workDuration).toBe(25);

    await user.click(screen.getByRole("button", { name: /settings/i }));
    expect(screen.getByText("25 min")).toBeInTheDocument();
  });

  it("saves duration and toggle changes back to the store", async () => {
    const user = userEvent.setup();
    render(<SettingsPanel />);

    await user.click(await screen.findByRole("button", { name: /settings/i }));
    fireEvent.change(screen.getByLabelText("Focus"), { target: { value: "30" } });
    await user.click(screen.getByLabelText("Auto-start breaks"));
    await user.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(useTimerStore.getState().settings).toMatchObject({
        ...DEFAULT_SETTINGS,
        workDuration: 30,
        autoStartBreaks: true,
      });
    });
    expect(useTimerStore.getState().timeLeft).toBe(1800);
  });
});
