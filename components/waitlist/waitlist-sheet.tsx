"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/site/logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { WaitlistForm, useWaitlistDraft } from "@/components/waitlist/waitlist-form";
import { cn } from "@/lib/utils";
import { waitlistPerks } from "@/lib/waitlist/perks";

/**
 * The "Join the waitlist" page. A full-screen dialog that slides in from the
 * right: the hero's sunset gradient with the pitch on the left, the form on
 * the right. Mounted once in the root layout so every entry point (hero,
 * closing CTA, header, waitlist section) opens the same form, and so plain
 * `#join` links open it from any page.
 */

export const WAITLIST_HASH = "#join";

type WaitlistSheetContextValue = { open: () => void };

const WaitlistSheetContext = createContext<WaitlistSheetContextValue | null>(null);

export function useWaitlistSheet(): WaitlistSheetContextValue {
  const context = useContext(WaitlistSheetContext);
  if (!context) {
    throw new Error("useWaitlistSheet must be used inside <WaitlistSheetProvider>.");
  }
  return context;
}

export function WaitlistSheetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Lives here, not in the form, so closing the panel keeps the draft.
  const draft = useWaitlistDraft();

  // The pills aren't Radix triggers, so remember what opened the panel and
  // send focus back there on close (keyboard and screen reader users).
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const rememberFocus = () => {
    const active = document.activeElement;
    returnFocusRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
  };

  const open = useCallback(() => {
    rememberFocus();
    setIsOpen(true);
  }, []);
  const contextValue = useMemo(() => ({ open }), [open]);

  // `#join` in the URL opens the panel, then the hash is cleared so the
  // link works again and a refresh doesn't reopen it.
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash !== WAITLIST_HASH) return;
      rememberFocus();
      setIsOpen(true);
      const { pathname, search } = window.location;
      window.history.replaceState(window.history.state, "", pathname + search);
    };
    // On a fresh page load, wait until the page has loaded and gone idle.
    // Opening the dialog marks the rest of the page aria-hidden, and doing
    // that while lower sections are still hydrating causes a mismatch.
    let cancelPending = () => {};
    const openWhenSettled = () => {
      if (typeof window.requestIdleCallback === "function") {
        const idleId = window.requestIdleCallback(openFromHash, { timeout: 1500 });
        cancelPending = () => window.cancelIdleCallback(idleId);
      } else {
        const timeoutId = window.setTimeout(openFromHash, 300);
        cancelPending = () => window.clearTimeout(timeoutId);
      }
    };
    if (document.readyState === "complete") openWhenSettled();
    else window.addEventListener("load", openWhenSettled, { once: true });

    window.addEventListener("hashchange", openFromHash);
    return () => {
      window.removeEventListener("load", openWhenSettled);
      window.removeEventListener("hashchange", openFromHash);
      cancelPending();
    };
  }, []);

  return (
    <WaitlistSheetContext.Provider value={contextValue}>
      {children}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          showClose={false}
          className={cn(
            "w-full max-w-none gap-0 border-0 border-l-0 outline-none sm:max-w-none",
            // Phones: one column, the whole page scrolls. Desktop: two
            // columns, and only the form side scrolls.
            "overflow-y-auto overscroll-contain lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:overflow-hidden",
            // A long, soft glide in; a quicker exit back to the right.
            "data-[state=open]:duration-[750ms] data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)]",
            "data-[state=closed]:duration-[450ms] data-[state=closed]:ease-[cubic-bezier(0.7,0,0.84,0)]",
            // Ember leading edge: glows while the page slides in, then fades.
            "before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:z-20 before:w-1 before:animate-edge-glow before:bg-brand",
          )}
          ref={contentRef}
          tabIndex={-1}
          // Focus the page itself on open: screen readers announce its title,
          // and phones don't pop the keyboard up over it. Tab goes to Close,
          // then the first question.
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            contentRef.current?.focus({ preventScroll: true });
          }}
          onCloseAutoFocus={(event) => {
            const target = returnFocusRef.current;
            if (!target?.isConnected) return;
            event.preventDefault();
            target.focus();
          }}
        >
          {/* Anchored to the page, not the viewport: on phones it scrolls away
              instead of covering the questions. On desktop only the form
              column scrolls, so it stays put. */}
          <SheetClose className="absolute top-4 right-4 z-30 inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-white/80 px-4 text-sm font-medium text-foreground shadow-[0_6px_16px_-10px_oklch(0_0_0/0.4)] ring-1 ring-foreground/10 backdrop-blur-md transition-colors hover:bg-white focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:top-5 sm:right-5">
            <XIcon className="size-4" aria-hidden="true" />
            Close
          </SheetClose>

          {/* Brand side */}
          <aside className="relative isolate shrink-0 overflow-hidden bg-hero-gradient lg:h-full">
            <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dot-grid opacity-50" />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,oklch(0.72_0.2_45/0.35),transparent_70%)]"
            />
            <div className="flex h-full flex-col px-5 pt-5 pb-8 sm:px-10 sm:pt-6 lg:overflow-y-auto lg:px-14 lg:pt-10 lg:pb-12">
              <Logo />
              <div className="mt-8 lg:my-auto lg:py-10">
                <div className="stagger-rise [--stagger-delay:220ms] [--stagger-step:70ms]">
                  <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/70 uppercase">
                    <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
                    Early access
                  </p>
                  <SheetTitle className="mt-3 font-display text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-[3.25rem] lg:text-[4.25rem]">
                    Join the waitlist.
                  </SheetTitle>
                  <p className="mt-4 max-w-md text-[17px] leading-relaxed text-pretty text-foreground/80">
                    We&apos;re building ResAI with restaurant owners, not just
                    for them.
                  </p>
                </div>

                <ul className="mt-10 hidden max-w-md space-y-2.5 stagger-rise [--stagger-delay:460ms] [--stagger-step:70ms] lg:block">
                  {waitlistPerks.map((perk) => (
                    <li
                      key={perk.title}
                      className="flex gap-3.5 rounded-2xl bg-white/45 px-4 py-3.5 ring-1 ring-white/60 backdrop-blur-[2px]"
                    >
                      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                        <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-[15px] font-medium">{perk.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-foreground/75">
                          {perk.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="hidden text-sm text-foreground/75 lg:block">
                Free to join. No commitment. Opt out anytime.
              </p>
            </div>
          </aside>

          {/* Form side */}
          <div className="relative shrink-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain">
            <div className="mx-auto w-full max-w-xl px-5 pt-8 pb-6 sm:px-10 lg:pt-24 lg:pb-12">
              <div className="stagger-rise [--stagger-delay:300ms] [--stagger-step:60ms]">
                <h3 className="font-display text-[1.6rem] leading-tight font-semibold tracking-[-0.025em]">
                  A few quick questions
                </h3>
                <SheetDescription className="mt-1.5 text-[15px] leading-relaxed">
                  Takes about a minute. Fields marked{" "}
                  <span className="text-brand-strong" aria-hidden="true">*</span>
                  <span className="sr-only">with an asterisk</span> are required.
                </SheetDescription>
              </div>
              <div className="mt-8">
                <WaitlistForm draft={draft} onDone={() => setIsOpen(false)} animated />
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </WaitlistSheetContext.Provider>
  );
}
