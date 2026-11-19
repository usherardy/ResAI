"use client";

import { ArrowUpRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWaitlistSheet } from "@/components/waitlist/waitlist-sheet";

/*
 * Waitlist pill, adapted from a 21st.dev "button with icon".
 *
 * At rest it's a pill with an ember knob. On hover (or keyboard focus) the
 * knob slides across to the left and turns into an arrow. Clicking opens the
 * "Join the waitlist" panel, which slides in from the left.
 */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const tones = {
  /** Black pill for light backgrounds, like the hero. */
  dark: "bg-foreground text-background shadow-[0_10px_24px_-12px_oklch(0_0_0/0.5)] focus-visible:ring-brand/45",
  /** White pill for the dark ink sections. */
  light: "bg-white text-foreground focus-visible:ring-brand/70",
} as const;

type WaitlistCtaProps = {
  tone?: keyof typeof tones;
  label?: string;
  className?: string;
};

export function WaitlistCta({
  tone = "dark",
  label = "Join the early-access waitlist",
  className,
}: WaitlistCtaProps) {
  const { open } = useWaitlistSheet();

  return (
    <button
      type="button"
      onClick={open}
      aria-haspopup="dialog"
      className={cn(
        "group relative inline-flex h-12 w-full cursor-pointer items-center overflow-clip rounded-full ps-6 pe-14 text-[16px] font-medium whitespace-nowrap transition-all duration-500 outline-none focus-visible:ring-[3px] sm:w-auto",
        EASE,
        "hover:ps-14 hover:pe-6 focus-visible:ps-14 focus-visible:pe-6",
        tones[tone],
        className,
      )}
    >
      <span className="relative z-10 grow text-center">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1 right-1 flex size-10 items-center justify-center rounded-full bg-brand text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.25)] transition-all duration-500",
          EASE,
          "group-hover:right-[calc(100%-2.75rem)] group-hover:rotate-45 group-focus-visible:right-[calc(100%-2.75rem)] group-focus-visible:rotate-45 group-active:scale-95",
        )}
      >
        <ArrowUpRightIcon className="size-4" strokeWidth={2.25} />
      </span>
    </button>
  );
}
