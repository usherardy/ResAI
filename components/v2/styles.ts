/**
 * Shared styles for landing page "B" (/v2). The serif comes from the
 * Instrument Serif font loaded in app/(site)/v2/page.tsx.
 */
export const serif = "font-[family-name:var(--font-serif-b)] font-normal";

/** Section headline: big editorial serif. */
export const sectionTitle = `${serif} text-[2.5rem] leading-[1.02] tracking-[-0.015em] text-balance sm:text-[3.5rem] lg:text-[4.25rem]`;

/** Small uppercase label above a headline or on a demo. */
export const kicker = "text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase";

/** White rounded card on the cream page. */
export const card =
  "rounded-[1.75rem] border border-foreground/[0.07] bg-card shadow-[0_1px_2px_oklch(0_0_0/0.03),0_12px_40px_-24px_oklch(0_0_0/0.18)]";
