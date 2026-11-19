"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpIcon, CheckIcon, LoaderCircleIcon, RotateCcwIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/components/demo/use-demo-player";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";

/*
 * One feature box played like a short screen recording, so a visitor can
 * follow what happens: the request types itself into the message box and is
 * sent, ResAI shows what it's checking, then the reply and result appear.
 * A status label and a thin progress bar narrate it. It plays once when
 * scrolled into view, then offers Replay. Reduced motion shows the end.
 *
 * The result (`visual`) sits inside an element with `data-result`, so its
 * pieces can build in with `group-data-[result=true]:` classes.
 */

type FeatureVideoProps = {
  /** The box title, used to name the Replay button. */
  title: string;
  example: string;
  /** What ResAI shows it's doing, one line at a time. */
  work: [string, string];
  reply: string;
  visual: React.ReactNode;
  /** Extra wait before playing, to stagger boxes side by side. */
  startDelay?: number;
};

/** How long to wait before advancing from `step` to `step + 1`. */
function delayFor(step: number, n: number) {
  if (step === 0) return 500; // empty message box
  if (step < n) return 28; // one character
  if (step === n) return 320; // fully typed, then send
  if (step === n + 1) return 450; // sent, thinking dots
  if (step === n + 2 || step === n + 3) return 700; // each work line
  return 1500; // result builds, then done
}

export function FeatureVideo({ title, example, work, reply, visual, startDelay = 0 }: FeatureVideoProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [timelineStep, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [run, setRun] = useState(0);

  const n = example.length;
  const SENT = n + 1;
  const WORK = n + 2; // first work line; the second is WORK + 1
  const RESULT = n + 4;
  const DONE = n + 5;
  let total = 0;
  for (let s = 0; s < DONE; s++) total += delayFor(s, n);

  // Reduced motion shows the finished box. Otherwise start when in view.
  const step = reducedMotion ? DONE : timelineStep;

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          timer = window.setTimeout(() => setPlaying(true), startDelay);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [reducedMotion, startDelay]);

  useEffect(() => {
    if (!playing || step >= DONE) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), delayFor(step, n));
    return () => window.clearTimeout(id);
  }, [playing, step, DONE, n]);

  const replay = () => {
    setRun((r) => r + 1);
    setStep(0);
    setPlaying(true);
  };

  const typing = step >= 1 && step < SENT;
  const typed = Math.min(step, n);
  const sent = step >= SENT;
  const working = sent && step < RESULT;
  const result = step >= RESULT;
  const done = step >= DONE;
  const status = result ? "Ready" : working ? "ResAI is working" : "You type";

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-hidden rounded-2xl bg-card p-3.5 text-foreground shadow-[0_24px_48px_-24px_oklch(0_0_0/0.35)] sm:p-4"
    >
      {/* Status, like a caption, plus Replay once it has finished. */}
      <div className="flex h-6 items-center justify-between gap-3">
        <p
          aria-hidden="true"
          className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase"
        >
          <span
            className={cn(
              "size-1.5 rounded-full transition-colors",
              result ? "bg-success" : working ? "animate-soft-pulse bg-brand" : "bg-foreground/25",
            )}
          />
          {status}
        </p>
        <button
          type="button"
          onClick={replay}
          aria-label={`Replay example: ${title}`}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-[11.5px] text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
            done && !reducedMotion ? "animate-fade-in" : "invisible",
          )}
        >
          <RotateCcwIcon className="size-3" aria-hidden="true" />
          Replay
        </button>
      </div>

      <div aria-hidden="true">
        {/* The sent message. Its space is kept so nothing jumps. */}
        <div className="mt-3 flex justify-end">
          <p
            className={cn(
              "max-w-[88%] origin-bottom-right rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-[13.5px] leading-snug text-background transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
              sent ? "scale-100 opacity-100" : "scale-90 opacity-0",
            )}
          >
            {example}
          </p>
        </div>

        <div className="mt-4 flex items-start gap-2.5">
          <LogoMark className="size-6" />
          {/* Working and result share one spot; the result sets the height. */}
          <div className="grid min-w-0 flex-1">
            <div
              className={cn(
                "col-start-1 row-start-1 transition-opacity duration-300",
                working ? "opacity-100" : "opacity-0",
              )}
            >
              {step === SENT ? <ThinkingDots /> : null}
              <ul className="space-y-1">
                {work.map((line, i) =>
                  step >= WORK + i ? (
                    <li
                      key={line}
                      className="flex animate-fade-in items-center gap-2 font-mono text-[11.5px] text-muted-foreground"
                    >
                      {step === WORK + i ? (
                        <LoaderCircleIcon className="size-3 shrink-0 animate-spin text-brand" />
                      ) : (
                        <CheckIcon className="size-3 shrink-0 text-success" strokeWidth={3} />
                      )}
                      {line}
                    </li>
                  ) : null,
                )}
              </ul>
            </div>
            <div
              key={run}
              data-result={result ? "true" : "false"}
              className={cn(
                "group col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                result ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
              )}
            >
              <p className="text-[13.5px] leading-snug">{reply}</p>
              <div className="mt-3">{visual}</div>
            </div>
          </div>
        </div>

        {/* The message box the request is typed into. */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-input bg-background py-1.5 ps-3 pe-1.5">
          <div className="grid min-w-0 flex-1 text-[13px] leading-5">
            {/* Invisible full text keeps the box one size while typing. */}
            <span className="invisible col-start-1 row-start-1">{example}</span>
            <span className="col-start-1 row-start-1">
              {typing ? (
                <>
                  {example.slice(0, typed)}
                  <span className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-caret bg-brand" />
                </>
              ) : (
                <span className="text-muted-foreground">Ask ResAI…</span>
              )}
            </span>
          </div>
          <span
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full transition-[background-color,color,scale] duration-200",
              typed > 0 && !sent ? "bg-foreground text-background" : "bg-muted text-muted-foreground",
              step === n && "scale-90",
            )}
          >
            <ArrowUpIcon className="size-3.5" />
          </span>
        </div>
      </div>

      {/* Thin progress bar along the bottom, like a video's. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-foreground/[0.06]">
        {playing || reducedMotion ? (
          <span
            key={run}
            style={{ "--duration": `${total}ms` } as React.CSSProperties}
            className="absolute inset-0 origin-left animate-video-progress bg-brand/70 motion-reduce:animate-none"
          />
        ) : null}
      </span>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex h-5 items-center gap-1">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="size-1.5 animate-dot-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
