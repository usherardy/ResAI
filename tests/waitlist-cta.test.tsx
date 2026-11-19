// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { WaitlistSheetProvider } from "@/components/waitlist/waitlist-sheet";

function renderPill() {
  return render(
    <WaitlistSheetProvider>
      <WaitlistCta />
    </WaitlistSheetProvider>,
  );
}

const pill = () => screen.getByRole("button", { name: /join the early-access waitlist/i });

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("WaitlistCta + waitlist panel", () => {
  it("opens the panel with the questions when the pill is pressed", async () => {
    const user = userEvent.setup();
    renderPill();

    expect(pill()).toHaveAttribute("aria-haspopup", "dialog");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(pill());

    const dialog = await screen.findByRole("dialog", { name: /join the waitlist/i });
    expect(dialog).toBeInTheDocument();
    expect(screen.getByLabelText(/restaurant or company name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^phone/i)).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /not working with your pos/i })).toBeInTheDocument();
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("closes on Escape and returns focus to the pill", async () => {
    const user = userEvent.setup();
    renderPill();

    await user.click(pill());
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(pill()).toHaveFocus();
  });

  it("keeps what was typed after closing and reopening", async () => {
    const user = userEvent.setup();
    renderPill();

    await user.click(pill());
    await user.type(await screen.findByLabelText(/restaurant or company name/i), "Corner Slice");
    await user.click(screen.getByRole("checkbox", { name: /fees are too high/i }));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(pill());
    expect(await screen.findByLabelText(/restaurant or company name/i)).toHaveValue("Corner Slice");
    expect(screen.getByRole("checkbox", { name: /fees are too high/i })).toBeChecked();
  });

  it("opens from a #join link and clears the hash", async () => {
    window.history.replaceState(null, "", "/#join");
    renderPill();

    expect(await screen.findByRole("dialog", { name: /join the waitlist/i })).toBeInTheDocument();
    expect(window.location.hash).toBe("");
  });
});
