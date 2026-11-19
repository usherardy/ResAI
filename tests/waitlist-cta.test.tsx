// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { WAITLIST_PREFILL_EVENT, type WaitlistPrefill } from "@/lib/waitlist/prefill";

const push = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

function listenForPrefill() {
  const received: string[] = [];
  const onPrefill = (event: Event) => {
    event.preventDefault();
    received.push((event as CustomEvent<WaitlistPrefill>).detail.email);
  };
  window.addEventListener(WAITLIST_PREFILL_EVENT, onPrefill);
  return {
    received,
    stop: () => window.removeEventListener(WAITLIST_PREFILL_EVENT, onPrefill),
  };
}

describe("WaitlistCta", () => {
  it("opens into a focused email field when clicked", async () => {
    const user = userEvent.setup();
    render(<WaitlistCta />);

    const trigger = screen.getByRole("button", { name: /join the early-access waitlist/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByLabelText(/email address/i)).toHaveFocus();
  });

  it("shows an error and doesn't hand off an invalid email", async () => {
    const prefill = listenForPrefill();
    const user = userEvent.setup();
    render(<WaitlistCta />);

    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));
    await user.type(screen.getByLabelText(/email address/i), "not-an-email{Enter}");

    expect(await screen.findByRole("alert")).toHaveTextContent(/enter a valid email address/i);
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute("aria-invalid", "true");
    expect(prefill.received).toEqual([]);

    await user.type(screen.getByLabelText(/email address/i), "x");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    prefill.stop();
  });

  it("hands a normalized email to the waitlist form and resets", async () => {
    const prefill = listenForPrefill();
    const user = userEvent.setup();
    render(<WaitlistCta />);

    const trigger = screen.getByRole("button", { name: /join the early-access waitlist/i });
    await user.click(trigger);
    await user.type(screen.getByLabelText(/email address/i), "  Owner@CornerSlice.com ");
    await user.click(screen.getByRole("button", { name: /continue/i }));

    expect(prefill.received).toEqual(["owner@cornerslice.com"]);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByLabelText(/email address/i)).toHaveValue("");
    prefill.stop();
  });

  it("closes on Escape and returns focus to the button", async () => {
    const user = userEvent.setup();
    render(<WaitlistCta />);

    const trigger = screen.getByRole("button", { name: /join the early-access waitlist/i });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("falls back to the waitlist section when no form is on the page", async () => {
    push.mockClear();
    const user = userEvent.setup();
    render(<WaitlistCta />);

    await user.click(screen.getByRole("button", { name: /join the early-access waitlist/i }));
    await user.type(screen.getByLabelText(/email address/i), "owner@cornerslice.com{Enter}");

    expect(push).toHaveBeenCalledWith("/#waitlist");
  });

  it("fills the full form and moves focus to the restaurant name", async () => {
    const user = userEvent.setup();
    render(
      <>
        <div data-testid="cta">
          <WaitlistCta />
        </div>
        <div data-testid="form">
          <WaitlistForm />
        </div>
      </>,
    );

    const cta = within(screen.getByTestId("cta"));
    await user.click(cta.getByRole("button", { name: /join the early-access waitlist/i }));
    await user.type(cta.getByLabelText(/email address/i), "owner@cornerslice.com{Enter}");

    const form = within(screen.getByTestId("form"));
    expect(form.getByLabelText(/^email/i)).toHaveValue("owner@cornerslice.com");
    expect(form.getByLabelText(/restaurant or business name/i)).toHaveFocus();
    expect(form.getByRole("status")).toHaveTextContent(/almost there/i);
  });
});
