import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskList } from "@/components/TaskList";
import { useTaskStore } from "@/store/taskStore";

const defaultTaskInitialize = useTaskStore.getState().initialize;

function resetTaskStore() {
  useTaskStore.setState({
    tasks: [],
    initialized: true,
    initialize: defaultTaskInitialize,
  });
}

describe("TaskList", () => {
  beforeEach(() => {
    resetTaskStore();
    localStorage.clear();
  });

  it("shows a loading skeleton before tasks are initialized", () => {
    useTaskStore.setState({ initialized: false });
    useTaskStore.setState({ initialize: () => undefined });
    const { container } = render(<TaskList />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("hydrates tasks from localStorage", async () => {
    localStorage.setItem(
      "pomodoro-tasks",
      JSON.stringify([{ id: "1", title: "Recovered task", completed: false }])
    );
    useTaskStore.setState({ tasks: [], initialized: false });

    render(<TaskList />);

    expect(await screen.findByText("Recovered task")).toBeInTheDocument();
  });

  it("adds a trimmed task and ignores blank submissions", async () => {
    const user = userEvent.setup();
    render(<TaskList />);

    const input = await screen.findByPlaceholderText("What are you working on?");
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(useTaskStore.getState().tasks).toHaveLength(0);

    await user.clear(input);
    await user.type(input, "  Write tests  ");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    await waitFor(() => {
      expect(useTaskStore.getState().tasks).toHaveLength(1);
    });
    expect(useTaskStore.getState().tasks[0]?.title).toBe("Write tests");
    expect(screen.getByText("Write tests")).toBeInTheDocument();
  });

  it("toggles tasks complete and clears completed tasks", async () => {
    const user = userEvent.setup();
    useTaskStore.setState({
      tasks: [{ id: "1", title: "Focus task", completed: false }],
      initialized: true,
    });

    render(<TaskList />);

    const toggleButton = await screen.findByRole("button", {
      name: "Mark Focus task as complete",
    });
    await user.click(toggleButton);

    expect(useTaskStore.getState().tasks[0]?.completed).toBe(true);
    expect(screen.getByRole("button", { name: /clear done/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /clear done/i }));

    await waitFor(() => {
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
    expect(screen.getByText("No active tasks. Add one to focus!")).toBeInTheDocument();
  });

  it("deletes a task", async () => {
    const user = userEvent.setup();
    useTaskStore.setState({
      tasks: [{ id: "1", title: "Delete me", completed: false }],
      initialized: true,
    });

    render(<TaskList />);

    await user.click(await screen.findByRole("button", { name: "Delete task Delete me" }));

    await waitFor(() => {
      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });
});
