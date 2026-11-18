// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it } from "vitest";
import { AgentDemo } from "@/components/demo/agent-demo";

// With reduced motion the demo skips typing and timers, so results appear
// immediately. That's also what reduced-motion visitors get.
beforeAll(() => {
  (globalThis as { __reducedMotion?: boolean }).__reducedMotion = true;
});

describe("AgentDemo", () => {
  it("is clearly labelled as a concept preview with example data", () => {
    render(<AgentDemo />);
    expect(screen.getAllByText(/concept preview/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/example data/i)).toBeInTheDocument();
    expect(screen.getByText(/sample restaurant/i)).toBeInTheDocument();
  });

  it("autoplays the menu scenario (final state under reduced motion)", async () => {
    render(<AgentDemo />);
    expect(await screen.findByText("Pizza · new category")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: /draft pizza menu/i })).toBeInTheDocument();
  });

  it("plays a scenario from the prompt list and approves it without claiming real changes", async () => {
    const user = userEvent.setup();
    render(<AgentDemo />);

    await user.click(screen.getByRole("button", { name: /kitchen printer is down/i }));
    expect(await screen.findByText(/kitchen printing · diagnosis/i)).toBeInTheDocument();
    expect(screen.getByText(/likely cause/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reroute tickets/i }));
    expect(screen.getByText(/approved in preview\. no printers were changed/i)).toBeInTheDocument();
  });

  it("lets visitors toggle rounding on the price change card", async () => {
    const user = userEvent.setup();
    render(<AgentDemo />);
    await user.click(screen.getByRole("button", { name: /raise burger prices/i }));

    const table = await screen.findByRole("table", { name: /proposed burger price changes/i });
    expect(within(table).getByText("$14.30")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /round up/i }));
    expect(within(table).getByText("$14.50")).toBeInTheDocument();
  });

  it("routes typed prompts and admits when it doesn't know something", async () => {
    const user = userEvent.setup();
    render(<AgentDemo />);
    const composer = screen.getByLabelText(/ask the resai agent/i);

    await user.type(composer, "How much did we make today?{Enter}");
    expect(await screen.findByText(/today vs\. last friday · through 3:00 pm/i)).toBeInTheDocument();

    await user.type(composer, "What's the weather tomorrow?{Enter}");
    expect(await screen.findByText(/scripted concept preview/i)).toBeInTheDocument();
  });
});
