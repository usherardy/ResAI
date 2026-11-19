// @vitest-environment jsdom
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssistantTabs } from "@/components/sections/assistant-tabs";
import { FeatureVideo } from "@/components/sections/feature-video";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WaitlistSheetProvider } from "@/components/waitlist/waitlist-sheet";

// next/font is compiled by Next.js; outside it, stand in a plain class.
vi.mock("@/lib/fonts", () => ({ accentSerif: { className: "font-accent" } }));

const flags = globalThis as { __reducedMotion?: boolean };

afterEach(() => {
  flags.__reducedMotion = false;
  vi.useRealTimers();
});

/** Runs the next `count` timers, letting React re-render after each one. */
function tick(count: number) {
  for (let i = 0; i < count; i++) {
    act(() => {
      vi.advanceTimersToNextTimer();
    });
  }
}

describe("Home hero", () => {
  it("leads with the statement, decorative tiles, and the one-line description", () => {
    render(
      <WaitlistSheetProvider>
        <Hero />
      </WaitlistSheetProvider>,
    );
    const heading = screen.getByRole("heading", { level: 1 });

    expect(heading.textContent?.replace(/\s+/g, " ").trim()).toBe("ResAI is your restaurant’s AI agent");
    // Three icon tiles, all hidden from screen readers.
    const tiles = heading.querySelectorAll(':scope > span > span[aria-hidden="true"]');
    expect(tiles).toHaveLength(3);
    tiles.forEach((tile) => expect(tile.querySelector("svg")).not.toBeNull());
    // The setup's IntersectionObserver stub reports it in view right away.
    expect(heading).toHaveAttribute("data-revealed", "true");

    expect(screen.getByText("Manage your menu, prices, and POS by asking your agent.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /join the .*waitlist/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try the demo" })).toHaveAttribute("href", "#demo");
  });
});

describe("One sentence boxes", () => {
  it("shows the headline and four example boxes that reveal on view", () => {
    render(<Features />);

    expect(
      screen.getByRole("heading", { level: 2, name: "One sentence instead of a dozen clicks." }),
    ).toBeInTheDocument();
    const boxes = screen.getAllByRole("article");
    expect(boxes.map((box) => box.querySelector("h3")?.textContent)).toEqual([
      "Menus and prices",
      "Sales, in a sentence",
      "Fixes, step by step",
      "Set up your way",
    ]);
    boxes.forEach((box) => expect(box).toHaveAttribute("data-revealed", "true"));
    // Each example request is available to screen readers.
    expect(
      screen.getByText("Example request: Let the bar keep tabs open until close. ResAI replies: Ready for your OK. This only affects the bar."),
    ).toBeInTheDocument();
  });
});

describe("How it works", () => {
  it("lists three numbered steps that each reveal on view", () => {
    render(<HowItWorks />);

    expect(screen.getByRole("heading", { level: 2, name: "Ask. Review. Approve." })).toBeInTheDocument();
    const steps = within(screen.getByRole("list")).getAllByRole("listitem");
    expect(steps.map((step) => step.querySelector("h3")?.textContent)).toEqual(["Ask", "Review", "Approve"]);
    steps.forEach((step, i) => {
      expect(step).toHaveTextContent(`Step ${i + 1}`);
      expect(step).toHaveAttribute("data-revealed", "true");
    });
  });
});

describe("Feature box playback", () => {
  const props = {
    title: "Menus and prices",
    example: "Add oat milk",
    work: ["Reading your menu", "Found 3 lattes"] as [string, string],
    reply: "Here’s the draft.",
    visual: <p>Draft table</p>,
  };

  it("types the request, shows what ResAI is checking, then the result and Replay", () => {
    vi.useFakeTimers();
    const { container } = render(<FeatureVideo {...props} />);
    const result = () => container.querySelector("[data-result]");
    const replay = screen.getByRole("button", { name: "Replay example: Menus and prices" });

    // Starts on an empty message box. One timer starts playback, then one
    // timer per step: 12 characters, send, thinking, two work lines, result.
    expect(screen.getByText("Ask ResAI…")).toBeInTheDocument();
    expect(result()).toHaveAttribute("data-result", "false");
    expect(replay).toHaveClass("invisible");

    tick(1 + 5);
    expect(container).toHaveTextContent("Add o");

    tick(9);
    expect(screen.getByText("Reading your menu")).toBeInTheDocument();
    expect(screen.queryByText("Found 3 lattes")).not.toBeInTheDocument();

    tick(2);
    expect(result()).toHaveAttribute("data-result", "true");
    expect(screen.getByText("Ready")).toBeInTheDocument();

    tick(1);
    expect(replay).not.toHaveClass("invisible");
  });

  it("shows the finished result straight away under reduced motion", () => {
    flags.__reducedMotion = true;
    const { container } = render(<FeatureVideo {...props} />);
    expect(container.querySelector("[data-result]")).toHaveAttribute("data-result", "true");
    expect(screen.getByText("Ready")).toBeInTheDocument();
  });
});

describe("Assistant tabs", () => {
  it("plays the request, the working steps, then the result card", () => {
    vi.useFakeTimers();
    render(<AssistantTabs />);

    expect(screen.getByRole("tab", { name: "Menus" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Waiting for your request")).toBeInTheDocument();

    // One timer per step: 56 characters, the pause, then three working lines.
    tick(57);
    expect(screen.getByText("ResAI is working…")).toBeInTheDocument();

    tick(3);
    expect(screen.getByText("Draft ready for your OK")).toBeInTheDocument();
    expect(screen.getByText("Pizza · new category")).toBeInTheDocument();
  });

  it("switches tabs with clicks and arrow keys", async () => {
    flags.__reducedMotion = true;
    const user = userEvent.setup();
    render(<AssistantTabs />);

    await user.click(screen.getByRole("tab", { name: "Fixes" }));
    expect(screen.getByRole("tab", { name: "Fixes" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Found the problem")).toBeInTheDocument();
    expect(screen.getByText("Kitchen printing · diagnosis")).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Sales" })).toHaveFocus();
    expect(screen.getByText("Here’s your answer")).toBeInTheDocument();
  });
});
