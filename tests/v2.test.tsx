// @vitest-environment jsdom
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { BeforeAfterDemo } from "@/components/v2/before-after-demo";
import { FloatingJoin } from "@/components/v2/floating-join";
import { TaskTabs } from "@/components/v2/task-tabs";
import { WaitlistSheetProvider } from "@/components/waitlist/waitlist-sheet";

const flags = globalThis as { __reducedMotion?: boolean };

afterEach(() => {
  flags.__reducedMotion = false;
  window.sessionStorage.clear();
});

describe("Landing page B", () => {
  it("shows the finished before/after demo under reduced motion and approves it", async () => {
    flags.__reducedMotion = true;
    const user = userEvent.setup();
    render(<BeforeAfterDemo />);

    // The screen-reader copy plus the visible copy, already fully typed.
    expect(screen.getAllByText("can u bump all the burgers a buck? not the kids one tho")).toHaveLength(2);
    expect(screen.getByText("Kids burger skipped")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /approve 6 changes/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/approved in preview\. no prices were changed/i);
  });

  it("switches the task tabs and their demo cards", async () => {
    const user = userEvent.setup();
    render(<TaskTabs />);

    expect(screen.getByRole("tab", { name: "Menus" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Pizza · new category")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Fixes" }));
    expect(screen.getByRole("tab", { name: "Fixes" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Kitchen printing · diagnosis")).toBeInTheDocument();
    expect(screen.getByText(/kitchen orders printing/i)).toBeInTheDocument();

    // Arrow keys move between tabs.
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Sales" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Sales" })).toHaveAttribute("aria-selected", "true");
  });

  it("shows the floating join card after scrolling and hides it when closed", async () => {
    const user = userEvent.setup();
    render(
      <WaitlistSheetProvider>
        <FloatingJoin />
      </WaitlistSheetProvider>,
    );
    const card = screen.getByRole("complementary", { name: /join the waitlist/i });
    expect(card).toHaveAttribute("inert");

    Object.defineProperty(window, "scrollY", { value: 5000, configurable: true });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(card).not.toHaveAttribute("inert");

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(card).toHaveAttribute("inert");
    expect(window.sessionStorage.getItem("resai:floating-join-dismissed")).toBe("1");
    Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  });
});
