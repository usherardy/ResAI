"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, LoaderCircleIcon, RotateCcwIcon } from "lucide-react";
import { MenuDraftCard } from "@/components/demo/cards/menu-draft-card";
import { PrinterCard } from "@/components/demo/cards/printer-card";
import { PriceChangeCard } from "@/components/demo/cards/price-change-card";
import { RevenueCard } from "@/components/demo/cards/revenue-card";
import { scenarios, type ScenarioId } from "@/components/demo/scenarios";
import { usePrefersReducedMotion } from "@/components/demo/use-demo-player";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/*
 * "One assistant for the whole back office": four tabs, each played like a
 * short video so a visitor can follow along. The request types out, ResAI
 * ticks through what it's checking, then the result card replaces the
 * loading placeholder. The first tab plays when the section scrolls into
 * view; picking a tab plays that one. Reduced motion shows each result
 * straight away. Scripted example data (see components/demo/scenarios.ts).
 */

const tabs: { id: ScenarioId; label: string; ready: string }[] = [
  { id: "menu", label: "Menus", ready: "Draft ready for your OK" },
  { id: "prices", label: "Prices", ready: "Draft ready for your OK" },
  { id: "revenue", label: "Sales", ready: "Here’s your answer" },
  { id: "printer", label: "Fixes", ready: "Found the problem" },
];

/** How long to wait before advancing from `step` to `step + 1`. */
function delayFor(step: number, n: number) {
  if (step === 0) return 350; // blinking caret
  if (step < n) return 22; // one character
  if (step === n) return 380; // fully typed, then send
  return 650; // each working line, then the result
}

export function AssistantTabs() {
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<ScenarioId>("menu");
  const [run, setRun] = useState(0);
  const [timelineStep, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [approved, setApproved] = useState<Partial<Record<ScenarioId, boolean>>>({});

  const scenario = scenarios[active];
  const tab = tabs.find((t) => t.id === active) ?? tabs[0];
  const n = scenario.prompt.length;
  const lines = scenario.steps;
  const RESULT = n + 1 + lines.length;
  const step = reducedMotion ? RESULT : timelineStep;

  // Play the first tab once the section scrolls into view.
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
    if (!playing || step >= RESULT) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), delayFor(step, n));
    return () => window.clearTimeout(id);
  }, [playing, step, RESULT, n, run]);

  const play = (id: ScenarioId) => {
    setActive(id);
    setApproved((a) => ({ ...a, [id]: false }));
    setRun((r) => r + 1);
    setStep(0);
    setPlaying(true);
  };

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    play(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  const typed = Math.min(step, n);
  const typing = step < n + 1;
  const linesShown = Math.max(0, Math.min(step - n, lines.length));
  const working = step > n && step < RESULT;
  const result = step >= RESULT;
  const isApproved = Boolean(approved[active]);
  const approve = () => setApproved((a) => ({ ...a, [active]: true }));
  const status = result ? tab.ready : working ? "ResAI is working…" : "Waiting for your request";

  return (
    <div ref={rootRef}>
      <div
        role="tablist"
        aria-label="Kinds of work"
        className="mx-auto flex w-fit gap-1 rounded-full border border-foreground/10 bg-card p-1 shadow-[0_1px_2px_oklch(0_0_0/0.04)]"
      >
        {tabs.map((t, i) => {
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`${uid}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => play(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "h-10 cursor-pointer rounded-full px-4 text-[15px] font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:px-5",
                selected ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel`}
        aria-labelledby={`${uid}-tab-${active}`}
        className="mt-8 grid items-start gap-6 sm:mt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10"
      >
        {/* Left: the request, then what ResAI is doing. */}
        <div className="min-w-0 lg:pt-4">
          <p className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">You ask</p>
          <p className="sr-only">{scenario.prompt}</p>
          <p
            aria-hidden="true"
            className="mt-4 grid font-display text-[1.5rem] leading-[1.18] font-semibold tracking-[-0.03em] sm:text-[1.875rem]"
          >
            {/* The invisible full text holds the size while it types. Plain
                (unbalanced) wrapping, so the typed text breaks where the
                finished text will. */}
            <span className="invisible col-start-1 row-start-1">&ldquo;{scenario.prompt}&rdquo;</span>
            <span className="col-start-1 row-start-1">
              &ldquo;{scenario.prompt.slice(0, typed)}
              {typing ? (
                <span className="ms-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.1em] animate-caret rounded-full bg-brand" />
              ) : (
                <>&rdquo;</>
              )}
            </span>
          </p>

          <div className="mt-7 rounded-2xl bg-card p-4 shadow-[0_1px_2px_oklch(0_0_0/0.04)] ring-1 ring-foreground/[0.06] sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2.5 text-[14px] font-medium" aria-live="polite">
                <LogoMark className="size-6" />
                {status}
              </p>
              <button
                type="button"
                onClick={() => play(active)}
                className={cn(
                  "inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  result && !reducedMotion ? "animate-fade-in" : "invisible",
                )}
              >
                <RotateCcwIcon className="size-3" aria-hidden="true" />
                Replay
              </button>
            </div>
            {/* Each line is a placeholder bar until ResAI reaches it, then a
                spinner while it works, then a check. */}
            <ul className="mt-3.5 space-y-1.5" aria-label="What ResAI checked">
              {lines.map((line, i) => {
                const shown = i < linesShown;
                const inProgress = working && i === linesShown - 1;
                return (
                  <li
                    key={`${active}-${line}`}
                    className="relative flex min-h-[18px] items-center gap-2 font-mono text-[12px] leading-snug text-muted-foreground"
                  >
                    {shown ? (
                      <>
                        {inProgress ? (
                          <LoaderCircleIcon className="size-3.5 shrink-0 animate-spin text-brand" aria-hidden="true" />
                        ) : (
                          <CheckIcon className="size-3.5 shrink-0 text-success" strokeWidth={3} aria-hidden="true" />
                        )}
                        <span className="animate-fade-in">{line}</span>
                      </>
                    ) : (
                      <span aria-hidden="true" className="flex w-full items-center gap-2">
                        <span className="size-3.5 shrink-0 rounded-full border border-foreground/15" />
                        <span
                          className={cn(
                            "h-2.5 rounded-full bg-foreground/[0.07]",
                            ["w-3/5", "w-1/2", "w-2/3"][i % 3],
                            working && "animate-pulse",
                          )}
                        />
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="relative mt-3.5 border-t border-border pt-3.5">
              <p
                className={cn(
                  "text-[14px] leading-relaxed text-pretty transition-opacity duration-500",
                  result ? "opacity-100" : "opacity-0",
                )}
              >
                {scenario.reply}
              </p>
              {/* Placeholder lines where the reply will be. */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute inset-x-0 top-3.5 space-y-2.5 transition-opacity duration-300",
                  result ? "opacity-0" : "opacity-100",
                )}
              >
                {["w-full", "w-11/12", "w-2/3"].map((w) => (
                  <span
                    key={w}
                    className={cn("mt-1.5 block h-2.5 rounded-full bg-foreground/[0.07]", w, working && "animate-pulse")}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* Right: a loading placeholder, then the result card. */}
        <div className="grid min-w-0 rounded-[1.75rem] bg-card p-2.5 shadow-[0_1px_2px_oklch(0_0_0/0.03),0_18px_44px_-30px_oklch(0_0_0/0.3)] ring-1 ring-foreground/[0.06] sm:p-3">
          <div
            aria-hidden="true"
            className={cn(
              "col-start-1 row-start-1 flex flex-col rounded-xl border border-dashed border-foreground/15 p-4 transition-opacity duration-300",
              result ? "opacity-0" : "opacity-100",
            )}
          >
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              {working ? (
                <LoaderCircleIcon className="size-3.5 animate-spin text-brand" />
              ) : (
                <span className="size-1.5 rounded-full bg-foreground/25" />
              )}
              {working ? "Drafting…" : "The result will appear here"}
            </p>
            <div className="mt-5 space-y-3">
              {["w-2/3", "w-full", "w-5/6", "w-full", "w-3/4"].map((w, i) => (
                <span
                  key={i}
                  className={cn("block h-3 rounded-full bg-foreground/[0.07]", w, working && "animate-pulse")}
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
          <div
            key={`${active}-${run}`}
            className={cn(
              "col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
              result ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
            )}
            inert={!result}
          >
            {active === "menu" ? <MenuDraftCard approved={isApproved} onApprove={approve} /> : null}
            {active === "prices" ? <PriceChangeCard approved={isApproved} onApprove={approve} /> : null}
            {active === "revenue" ? <RevenueCard /> : null}
            {active === "printer" ? <PrinterCard approved={isApproved} onApprove={approve} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
