"use client";

import { useId, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";
import { ArrowUpRightIcon, CircleAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { requestWaitlistPrefill } from "@/lib/waitlist/prefill";
import { LIMITS, emailSchema } from "@/lib/waitlist/schema";

/*
 * Waitlist pill, adapted from a 21st.dev "button with icon".
 *
 * At rest it's a pill with an ember knob. On hover (or keyboard focus) the
 * knob slides across and turns into an arrow. Click it and the same pill
 * opens into an email field, with the knob as the submit button. The email
 * is then handed to the full waitlist form further down the page, which
 * collects the rest.
 */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const tones = {
  /** Black pill for light backgrounds, like the hero. */
  dark: {
    pill: "bg-foreground text-background shadow-[0_10px_24px_-12px_oklch(0_0_0/0.5)]",
    focusRing: "has-focus-visible:ring-[3px] has-focus-visible:ring-brand/45",
    errorRing: "ring-[3px] ring-destructive/55",
    input:
      "placeholder:text-background/50 autofill:shadow-[inset_0_0_0_100px_var(--foreground)] autofill:[-webkit-text-fill-color:var(--background)]",
    errorText: "text-foreground",
    errorIcon: "text-destructive",
  },
  /** White pill for the dark ink sections. */
  light: {
    pill: "bg-white text-foreground",
    focusRing: "has-focus-visible:ring-[3px] has-focus-visible:ring-brand/70",
    errorRing: "ring-[3px] ring-[oklch(0.68_0.2_27/0.8)]",
    input:
      "placeholder:text-foreground/45 autofill:shadow-[inset_0_0_0_100px_white] autofill:[-webkit-text-fill-color:var(--foreground)]",
    errorText: "text-white/85",
    errorIcon: "text-[oklch(0.75_0.16_30)]",
  },
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
  const uid = useId();
  const inputId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const t = tones[tone];
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus inside the click handler so mobile browsers raise the keyboard.
  const expand = () => {
    flushSync(() => setOpen(true));
    inputRef.current?.focus();
  };

  const collapse = (restoreFocus: boolean) => {
    flushSync(() => {
      setOpen(false);
      setError(null);
    });
    if (restoreFocus) triggerRef.current?.focus();
  };

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email address.");
      inputRef.current?.focus();
      return;
    }

    if (!requestWaitlistPrefill(result.data)) {
      router.push("/#waitlist");
      return;
    }

    // The full form now has the email and focus. Reset for a return visit.
    setOpen(false);
    setEmail("");
    setError(null);
  }

  return (
    <div className={cn("inline-flex w-full flex-col items-center gap-2.5 sm:w-auto", className)}>
      <form
        noValidate
        onSubmit={onSubmit}
        onBlur={(event) => {
          if (!open || email.trim()) return;
          if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
          collapse(false);
        }}
        className={cn(
          // overflow-clip, not -hidden: a hidden box can still be scrolled, and
          // focusing the input mid-slide would nudge it up a few pixels.
          "relative isolate flex h-12 w-full overflow-clip rounded-full transition-shadow duration-300",
          t.pill,
          error ? t.errorRing : t.focusRing,
        )}
      >
        <button
          ref={triggerRef}
          type="button"
          onClick={expand}
          aria-expanded={open}
          aria-controls={inputId}
          inert={open}
          className={cn(
            "peer grow cursor-pointer rounded-full ps-6 pe-14 text-[16px] font-medium whitespace-nowrap outline-none transition-all duration-500",
            EASE,
            "hover:ps-14 hover:pe-6 focus-visible:ps-14 focus-visible:pe-6",
            open && "invisible -translate-y-3 opacity-0 blur-[2px]",
          )}
        >
          {label}
        </button>

        <label htmlFor={inputId} className="sr-only">
          Email address
        </label>
        <input
          ref={inputRef}
          id={inputId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="go"
          placeholder="you@yourrestaurant.com"
          maxLength={LIMITS.email}
          inert={!open}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Escape") return;
            event.preventDefault();
            collapse(true);
          }}
          className={cn(
            "absolute inset-y-0 inset-s-0 inset-e-12 min-w-0 bg-transparent ps-6 pe-2 text-[16px] caret-brand outline-none transition-all duration-500",
            EASE,
            t.input,
            open
              ? "translate-y-0 opacity-100 delay-100"
              : "pointer-events-none translate-y-3 opacity-0 blur-[2px]",
          )}
        />

        {/* The knob: decoration while closed, the submit button once open. */}
        <button
          type="submit"
          inert={!open}
          aria-label="Continue"
          className={cn(
            "absolute top-1 right-1 z-10 flex size-10 items-center justify-center rounded-full bg-brand text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.25)] transition-all duration-500",
            EASE,
            open
              ? "rotate-45 cursor-pointer hover:bg-brand-strong active:scale-95"
              : "pointer-events-none peer-hover:right-[calc(100%-2.75rem)] peer-hover:rotate-45 peer-focus-visible:right-[calc(100%-2.75rem)] peer-focus-visible:rotate-45",
          )}
        >
          <ArrowUpRightIcon className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </button>
      </form>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className={cn(
            // w-0 + min-w-full: wraps to the pill's width instead of widening it.
            "w-0 min-w-full animate-fade-in text-center text-[13px] leading-snug font-medium text-balance",
            t.errorText,
          )}
        >
          <CircleAlertIcon
            className={cn("me-1.5 inline-block size-3.5 align-[-0.2em]", t.errorIcon)}
            aria-hidden="true"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}
