// @vitest-environment jsdom
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AssistantTabs } from "@/components/sections/assistant-tabs";
import { FeatureVideo } from "@/components/sections/feature-video";
import { Features } from "@/components/sections/features";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { FIRST_CHANGE_MS, HOLD_MS, RotatingBusiness } from "@/components/sections/rotating-business";
import { SwipeRow } from "@/components/ui/swipe-row";
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
  it("leads with the headline, decorative tiles, and the one-line description", () => {
    render(
      <WaitlistSheetProvider>
        <Hero />
      </WaitlistSheetProvider>,
    );
    // Screen readers get one fixed sentence; the rotating word is hidden.
    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Run, fix, and grow your restaurant, café, bar, bakery, or food truck with agents.",
    });

    // Three icon tiles, all hidden from screen readers.
    const tiles = [...heading.querySelectorAll('span[aria-hidden="true"]')].filter((el) =>
      el.querySelector("svg"),
    );
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

describe("Rotating business word", () => {
  const active = (container: HTMLElement) => container.querySelector('[data-state="active"]')?.textContent;
  const tileIcon = (container: HTMLElement) =>
    container.querySelector('[data-icon-state="active"] svg')?.getAttribute("class") ?? "";

  it("cycles through business types with matching tiles, and keeps going", () => {
    vi.useFakeTimers();
    const { container } = render(
      <h1 className="group">
        <RotatingBusiness />
      </h1>,
    );
    expect(active(container)).toBe("restaurant");
    expect(tileIcon(container)).toMatch(/chef-hat/);

    act(() => vi.advanceTimersByTime(FIRST_CHANGE_MS));
    expect(active(container)).toBe("café");
    expect(tileIcon(container)).toMatch(/coffee/);
    // The word it replaced lifts away.
    expect(container.querySelector('[data-state="past"]')).toHaveTextContent("restaurant");

    // One step per hold, then round again rather than stopping.
    for (const word of ["bar", "bakery", "food truck", "restaurant", "café", "bar"]) {
      act(() => vi.advanceTimersByTime(HOLD_MS));
      expect(active(container)).toBe(word);
    }
    expect(tileIcon(container)).toMatch(/wine/);
  });

  it("pauses while the tab is hidden and resumes when it's back", () => {
    vi.useFakeTimers();
    const { container } = render(
      <h1 className="group">
        <RotatingBusiness />
      </h1>,
    );
    act(() => vi.advanceTimersByTime(FIRST_CHANGE_MS));
    expect(active(container)).toBe("café");

    const setHidden = (hidden: boolean) => {
      Object.defineProperty(document, "hidden", { value: hidden, configurable: true });
      act(() => {
        document.dispatchEvent(new Event("visibilitychange"));
      });
    };
    setHidden(true);
    act(() => vi.advanceTimersByTime(HOLD_MS * 5));
    expect(active(container)).toBe("café");

    setHidden(false);
    act(() => vi.advanceTimersByTime(HOLD_MS));
    expect(active(container)).toBe("bar");
  });

  it("stays on restaurant under reduced motion", () => {
    flags.__reducedMotion = true;
    vi.useFakeTimers();
    const { container } = render(
      <h1 className="group">
        <RotatingBusiness />
      </h1>,
    );
    act(() => vi.advanceTimersByTime(FIRST_CHANGE_MS + HOLD_MS * 6));
    expect(active(container)).toBe("restaurant");
    expect(screen.getByText("restaurant, café, bar, bakery, or food truck")).toHaveClass("sr-only");
  });
});

describe("Swipe row (phones)", () => {
  it("is a labelled, keyboard-reachable region with one dot per card", async () => {
    const user = userEvent.setup();
    render(
      <SwipeRow label="Example requests">
        <article>One</article>
        <article>Two</article>
        <article>Three</article>
        <article>Four</article>
      </SwipeRow>,
    );
    const region = screen.getByRole("region", { name: "Example requests" });
    expect(region).toHaveAttribute("tabindex", "0");

    const dots = screen.getAllByRole("button", { name: /show example \d of 4/i });
    expect(dots).toHaveLength(4);
    expect(dots[0]).toHaveAttribute("aria-current", "true");

    await user.click(dots[2]);
    expect(dots[2]).toHaveAttribute("aria-current", "true");
    expect(dots[0]).not.toHaveAttribute("aria-current");
  });
});
