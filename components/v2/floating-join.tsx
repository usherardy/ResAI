"use client";

import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { useWaitlistSheet } from "@/components/waitlist/waitlist-sheet";
import { cn } from "@/lib/utils";

const DISMISSED_KEY = "resai:floating-join-dismissed";

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    // Storage can be unavailable (private mode). The card still works.
    return false;
  }
}

/**
 * Small join card in the bottom corner (an idea from Wispr Flow's app card).
 * Appears once the visitor scrolls past the hero; closing it hides it for the
 * rest of the visit.
 */
export function FloatingJoin() {
  const { open } = useWaitlistSheet();
  const [scrolled, setScrolled] = useState(false);
  // Read once on the client. The card starts hidden either way (not yet
  // scrolled), so server and client render the same markup.
  const [dismissed, setDismissed] = useState(readDismissed);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Ignore: it just won't be remembered.
    }
  };

  const visible = scrolled && !dismissed;

  return (
    <aside
      aria-label="Join the waitlist"
      inert={!visible}
      className={cn(
        "fixed right-4 bottom-4 left-4 z-40 flex items-center gap-3 rounded-2xl border border-foreground/10 bg-white/90 p-3 shadow-[0_18px_40px_-18px_oklch(0_0_0/0.35)] backdrop-blur-md transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:left-auto sm:w-[22rem]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <LogoMark className="size-10" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-semibold">ResAI · Early access</p>
        <p className="truncate text-[13px] text-muted-foreground">Run your restaurant by asking.</p>
      </div>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        Join
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <XIcon className="size-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
