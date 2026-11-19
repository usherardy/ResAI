/**
 * Hand-off from the page's quick email CTAs to the full waitlist form.
 *
 * The form listens for this event, fills in the email, scrolls itself into
 * view and moves focus to the next field. It calls `preventDefault()` to
 * signal that it picked the email up.
 */
export const WAITLIST_PREFILL_EVENT = "resai:waitlist-prefill";

export type WaitlistPrefill = { email: string };

/** Returns false when no waitlist form on the page handled the email. */
export function requestWaitlistPrefill(email: string): boolean {
  const event = new CustomEvent<WaitlistPrefill>(WAITLIST_PREFILL_EVENT, {
    detail: { email },
    cancelable: true,
  });
  return !window.dispatchEvent(event);
}
