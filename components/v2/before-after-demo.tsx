"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, RotateCcwIcon, SparklesIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/demo/use-demo-player";
import { card, kicker } from "@/components/v2/styles";
import { cn } from "@/lib/utils";

/*
 * Before/after demo for landing page "B": a casual request types itself out,
 * ResAI shows what it understood, then a clean draft appears for approval.
 * Plays once when scrolled into view. Example data only; nothing is changed.
 */

const REQUEST = "can u bump all the burgers a buck? not the kids one tho";

const NOTICES = ["6 burgers found", "Kids burger skipped", "+$1.00 each"];

const ITEMS = [
  { name: "Classic Burger", from: 12, to: 13 },
  { name: "Cheeseburger", from: 13, to: 14 },
  { name: "Bacon BBQ Burger", from: 15, to: 16 },
  { name: "Mushroom Swiss", from: 14.5, to: 15.5 },
  { name: "Veggie Burger", from: 13, to: 14 },
  { name: "Double Smash", from: 16, to: 17 },
  { name: "Kids Burger", from: 8, to: 8, skipped: true },
];

const TYPE_END = REQUEST.length;
const NOTICE_END = TYPE_END + NOTICES.length;
const TOTAL = NOTICE_END + ITEMS.length;

/** How long to wait before advancing from `step` to `step + 1`. */
function delayFor(step: number) {
  if (step === 0) return 400;
  if (step < TYPE_END) return 32;
  if (step === TYPE_END) return 450;
  if (step < NOTICE_END) return 420;
  if (step === NOTICE_END) return 350;
  return 110;
}

const money = (n: number) => `$${n.toFixed(2)}`;

export function BeforeAfterDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [timelineStep, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [approved, setApproved] = useState(false);

  // Reduced motion shows the finished demo. Otherwise start when in view.
  const step = reducedMotion ? TOTAL : timelineStep;

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlaying(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing || step >= TOTAL) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), delayFor(step));
    return () => window.clearTimeout(id);
  }, [playing, step]);

  const typed = Math.min(step, TYPE_END);
  const notices = Math.max(0, Math.min(step - TYPE_END, NOTICES.length));
  const rows = Math.max(0, Math.min(step - NOTICE_END, ITEMS.length));
  const done = step >= TOTAL;
  const typing = playing && step > 0 && step < TYPE_END;

  const replay = () => {
    setApproved(false);
    if (reducedMotion) return;
    setStep(0);
    setPlaying(true);
  };

  return (
    <div
      ref={rootRef}
      id="see-it-work"
      className="mx-auto grid max-w-5xl scroll-mt-24 gap-4 text-left md:grid-cols-[1fr_1.15fr] md:gap-5"
    >
      {/* Before: what the owner types */}
      <div className={cn(card, "flex flex-col p-5 sm:p-7")}>
        <p className={kicker}>You type</p>
        <div className="mt-5 flex justify-end">
          <p
            className={cn(
              "max-w-88 rounded-[1.25rem] rounded-br-md bg-foreground px-4 py-3 text-[15px] leading-relaxed text-background transition-opacity duration-300 sm:text-base",
              // Hidden until the first letter appears, so it's never an empty blob.
              typed === 0 && "opacity-0",
            )}
          >
            <span className="sr-only">{REQUEST}</span>
            <span aria-hidden="true">
              {REQUEST.slice(0, typed) || " "}
              {typing ? (
                <span className="ms-0.5 inline-block h-[1.05em] w-0.5 animate-caret bg-background/80 align-[-0.15em]" />
              ) : null}
            </span>
          </p>
        </div>

        <div className="mt-auto pt-8">
          <p className={kicker}>ResAI noticed</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {NOTICES.map((notice, i) => (
              <li
                key={notice}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-foreground ring-1 ring-brand/25 transition-[opacity,translate,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  i < notices ? "translate-y-0 scale-100 opacity-100" : "translate-y-1 scale-90 opacity-0",
                )}
              >
                <SparklesIcon className="size-3.5 text-brand-strong" aria-hidden="true" />
                {notice}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* After: the clean draft */}
      <div className={cn(card, "flex flex-col p-5 sm:p-7")}>
        <div className="flex items-center justify-between gap-3">
          <p className={kicker}>ResAI drafts</p>
          <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Example data
          </span>
        </div>
        <p className="mt-4 text-[15px] font-medium">Burgers · +$1.00 · 6 items</p>

        <ul className="mt-3 divide-y divide-border">
          {ITEMS.map((item, i) => (
            <li
              key={item.name}
              className={cn(
                "flex items-center justify-between gap-3 py-2.5 text-[15px] transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                i < rows ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0",
              )}
            >
              <span className={cn(item.skipped && "text-muted-foreground")}>{item.name}</span>
              {item.skipped ? (
                <span className="flex items-center gap-2 text-muted-foreground tabular">
                  <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium">Skipped</span>
                  {money(item.from)}
                </span>
              ) : (
                <span className="flex items-center gap-2 tabular">
                  <span className="text-muted-foreground line-through decoration-foreground/30">
                    {money(item.from)}
                  </span>
                  <span className="font-semibold">{money(item.to)}</span>
                </span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex min-h-11 items-center justify-between gap-3 pt-5">
          {done ? (
            approved ? (
              <p className="flex items-center gap-2 text-sm font-medium text-success" role="status">
                <CheckIcon className="size-4" strokeWidth={3} aria-hidden="true" />
                Approved in preview. No prices were changed.
              </p>
            ) : (
              <button
                type="button"
                onClick={() => setApproved(true)}
                className="inline-flex h-11 animate-fade-in cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                <CheckIcon className="size-4" aria-hidden="true" />
                Approve 6 changes
              </button>
            )
          ) : (
            <span className="text-sm text-muted-foreground">Drafting…</span>
          )}
          {done ? (
            <button
              type="button"
              onClick={replay}
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <RotateCcwIcon className="size-3.5" aria-hidden="true" />
              Replay
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
