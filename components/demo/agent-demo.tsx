"use client";

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import {
  ArrowUpIcon,
  ChartColumnIcon,
  CheckIcon,
  LoaderCircleIcon,
  PercentIcon,
  PrinterIcon,
  RotateCcwIcon,
  TagIcon,
  TrendingUpIcon,
  UtensilsCrossedIcon,
  type LucideIcon,
} from "lucide-react";
import { LogoMark } from "@/components/site/logo";
import { cn } from "@/lib/utils";
import { matchPrompt } from "./match-prompt";
import {
  FALLBACK_REPLY,
  SAMPLE_RESTAURANT,
  scenarioOrder,
  scenarios,
  type ScenarioId,
} from "./scenarios";
import { usePrefersReducedMotion, useDemoPlayer, type RunTarget } from "./use-demo-player";
import type { CardProps } from "./cards/card-shell";
import { MenuDraftCard } from "./cards/menu-draft-card";
import { RevenueCard } from "./cards/revenue-card";
import { PrinterCard } from "./cards/printer-card";
import { PriceChangeCard } from "./cards/price-change-card";
import { BestSellersCard } from "./cards/best-sellers-card";
import { DiscountCard } from "./cards/discount-card";

const icons: Record<ScenarioId, LucideIcon> = {
  menu: UtensilsCrossedIcon,
  revenue: ChartColumnIcon,
  printer: PrinterIcon,
  prices: TagIcon,
  bestsellers: TrendingUpIcon,
  discount: PercentIcon,
};

const cards: Record<ScenarioId, ComponentType<CardProps>> = {
  menu: MenuDraftCard,
  revenue: RevenueCard,
  printer: PrinterCard,
  prices: PriceChangeCard,
  bestsellers: BestSellersCard,
  discount: DiscountCard,
};

const AUTOPLAY_SCENARIO: ScenarioId = "menu";

export function AgentDemo() {
  const reducedMotion = usePrefersReducedMotion();
  const { state, play, approve, stop } = useDemoPlayer({ reducedMotion });
  const [draft, setDraft] = useState("");

  const rootRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const userMsgRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const interacted = useRef(false);
  const autoplayed = useRef(false);

  const { run, phase, typed, stepsShown, approved } = state;
  const activeScenario: ScenarioId | null =
    run && run.target !== "fallback" ? run.target : null;

  // Autoplay one run when the window first scrolls into view. It doesn't loop.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || autoplayed.current) return;
    let timeout: number | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        timeout = window.setTimeout(
          () => {
            if (interacted.current || autoplayed.current) return;
            autoplayed.current = true;
            play(AUTOPLAY_SCENARIO);
          },
          reducedMotion ? 0 : 700,
        );
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [play, reducedMotion]);

  // Keep the owner's latest prompt pinned near the top of the conversation,
  // with the answer below it (scrolls *inside* the window, never the page).
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    const user = userMsgRef.current;
    const maxScroll = log.scrollHeight - log.clientHeight;
    const target = user ? user.offsetTop - 12 : 0;
    log.scrollTo({
      top: Math.max(0, Math.min(target, maxScroll)),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [run?.id, phase, stepsShown, reducedMotion]);

  const choose = useCallback(
    (target: RunTarget) => {
      interacted.current = true;
      autoplayed.current = true;
      setDraft("");
      play(target);
    },
    [play],
  );

  const submit = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    interacted.current = true;
    autoplayed.current = true;
    setDraft("");
    play(matchPrompt(text) ?? "fallback", { userText: text.slice(0, 200) });
  }, [draft, play]);

  const cancelTyping = useCallback(() => {
    interacted.current = true;
    autoplayed.current = true;
    if (phase === "typing") stop();
  }, [phase, stop]);

  const typing = phase === "typing" && run;
  const showExchange = run && phase !== "typing";
  const Card = activeScenario ? cards[activeScenario] : null;
  const steps = activeScenario ? scenarios[activeScenario].steps : [];
  const followUp = activeScenario ? scenarios[activeScenario].followUp : undefined;

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_1px_1px_oklch(0_0_0/0.03),0_12px_32px_-12px_oklch(0_0_0/0.14),0_40px_80px_-40px_oklch(0_0_0/0.18)]"
    >
      {/* Window chrome */}
      <div className="flex h-12 items-center justify-between gap-3 border-b border-border px-3 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <LogoMark className="size-6" />
          <span className="hidden text-[13px] font-semibold tracking-tight sm:inline">
            ResAI
          </span>
          <span className="hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
          <span className="truncate text-[13px] text-muted-foreground">
            {SAMPLE_RESTAURANT}{" "}
            <span className="text-muted-foreground/80">· sample restaurant</span>
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-muted-foreground uppercase md:inline">
            Example data
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 font-mono text-[10.5px] font-medium tracking-wide text-brand-strong uppercase">
            <span className="size-1.5 animate-soft-pulse rounded-full bg-brand" aria-hidden="true" />
            Concept preview
          </span>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[15.5rem_1fr]">
        {/* Prompt picker: chips on mobile, sidebar on desktop */}
        <div className="border-b border-border bg-surface/50 lg:border-r lg:border-b-0">
          <p
            id="demo-prompts-label"
            className="hidden px-4 pt-4 pb-2 font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase lg:block"
          >
            Try asking
          </p>
          <ul
            aria-labelledby="demo-prompts-label"
            className="scrollbar-none flex gap-1.5 overflow-x-auto px-3 py-2.5 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-2 lg:py-0"
          >
            {scenarioOrder.map((id) => {
              const Icon = icons[id];
              const active = activeScenario === id;
              return (
                <li key={id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => choose(id)}
                    aria-pressed={active}
                    className={cn(
                      "group flex w-full items-center gap-2 rounded-full border px-3 py-1.5 text-left text-[13px] transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none lg:rounded-lg lg:border-transparent lg:px-2 lg:py-2",
                      active
                        ? "border-foreground/15 bg-card text-foreground shadow-xs lg:border-border"
                        : "border-border bg-card text-muted-foreground hover:text-foreground lg:bg-transparent lg:hover:bg-card/70",
                    )}
                  >
                    <span
                      className={cn(
                        "hidden size-7 shrink-0 items-center justify-center rounded-md border lg:flex",
                        active
                          ? "border-brand/25 bg-brand-soft text-brand-strong"
                          : "border-border bg-card text-muted-foreground group-hover:text-foreground",
                      )}
                      aria-hidden="true"
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <Icon className="size-3.5 lg:hidden" aria-hidden="true" />
                    <span className="flex min-w-0 flex-col whitespace-nowrap">
                      <span className="font-medium lg:truncate">
                        {scenarios[id].label}
                      </span>
                      <span className="hidden text-[11px] text-muted-foreground lg:block">
                        {scenarios[id].kind}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="hidden px-4 pt-3 pb-4 text-[11.5px] leading-relaxed text-muted-foreground lg:block">
            Scripted examples with made-up numbers. ResAI isn&apos;t connected to
            a real restaurant here.
          </p>
        </div>

        {/* Conversation */}
        <div className="flex min-w-0 flex-col">
          <div
            ref={logRef}
            role="log"
            aria-label="Conversation with the ResAI agent (concept preview)"
            className="relative h-[30rem] overflow-y-auto px-3 pt-4 pb-8 [mask-image:linear-gradient(to_bottom,black_calc(100%-2rem),transparent)] sm:px-5 sm:pt-5 lg:h-[31rem]"
          >
            <AgentRow>
              <p className="text-[13.5px] leading-relaxed">
                Hi! I&apos;m the ResAI agent for {SAMPLE_RESTAURANT}. Ask me to
                change the menu, check sales, or figure out what&apos;s broken.
              </p>
            </AgentRow>

            {showExchange ? (
              <div key={run.id}>
                <div ref={userMsgRef} className="mt-5 flex justify-end">
                  <p className="max-w-[85%] animate-fade-up rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-[13.5px] leading-relaxed text-background">
                    <span className="sr-only">You: </span>
                    {run.text}
                  </p>
                </div>

                <AgentRow className="mt-5">
                  {steps.length > 0 && phase === "done" ? (
                    <p className="flex min-w-0 items-center gap-2 font-mono text-[11.5px] text-muted-foreground">
                      <CheckIcon
                        className="size-3 shrink-0 text-success"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                      <span className="truncate">
                        <span className="sr-only">Completed steps: </span>
                        {steps.join(" → ")}
                      </span>
                    </p>
                  ) : null}

                  {steps.length > 0 && phase !== "done" ? (
                    <ul className="space-y-1" aria-label="Agent steps">
                      {steps.slice(0, stepsShown).map((step, i) => {
                        const inProgress = phase === "thinking" && i === stepsShown - 1;
                        return (
                          <li
                            key={step}
                            className="flex animate-fade-in items-center gap-2 font-mono text-[11.5px] text-muted-foreground"
                          >
                            {inProgress ? (
                              <LoaderCircleIcon
                                className="size-3 shrink-0 animate-spin text-brand"
                                aria-hidden="true"
                              />
                            ) : (
                              <CheckIcon
                                className="size-3 shrink-0 text-success"
                                strokeWidth={3}
                                aria-hidden="true"
                              />
                            )}
                            {step}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {phase === "thinking" && stepsShown === 0 ? <ThinkingDots /> : null}

                  {phase === "done" ? (
                    <div className="animate-fade-up">
                      {activeScenario && Card ? (
                        <>
                          <p className={cn("text-[13.5px] leading-relaxed", steps.length > 0 && "mt-3")}>
                            {scenarios[activeScenario].reply}
                          </p>
                          <div className="mt-3">
                            <Card key={run.id} approved={approved} onApprove={approve} />
                          </div>
                          {followUp ? (
                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
                              Next, try
                              <SuggestionChip id={followUp} onSelect={choose} />
                            </div>
                          ) : null}
                        </>
                      ) : (
                        <>
                          <p className="text-[13.5px] leading-relaxed">{FALLBACK_REPLY}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {(["menu", "revenue", "printer"] as const).map((id) => (
                              <SuggestionChip key={id} id={id} onSelect={choose} />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ) : null}
                </AgentRow>
              </div>
            ) : null}
          </div>

          {/* Composer */}
          <form
            className="border-t border-border p-3 sm:p-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flex items-end gap-2 rounded-xl border border-input bg-background px-3 py-2 focus-within:border-brand/50 focus-within:ring-[3px] focus-within:ring-ring/20">
              <div className="relative min-w-0 flex-1">
                <label htmlFor="demo-composer" className="sr-only">
                  Ask the ResAI agent (concept preview with scripted answers)
                </label>
                <textarea
                  ref={textareaRef}
                  id="demo-composer"
                  rows={2}
                  maxLength={200}
                  value={typing ? "" : draft}
                  onFocus={cancelTyping}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      submit();
                    }
                  }}
                  placeholder={typing ? "" : "Ask ResAI about your restaurant…"}
                  className="block w-full resize-none bg-transparent text-base leading-5 outline-none placeholder:text-muted-foreground sm:text-[13.5px]"
                />
                {typing ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 text-base leading-5 text-foreground sm:text-[13.5px]"
                  >
                    {run.text.slice(0, typed)}
                    <span className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-caret bg-brand" />
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send"
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  draft.trim() || typing
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <ArrowUpIcon className="size-4" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 text-[11.5px] text-muted-foreground">
              <p>Answers are scripted examples</p>
              {phase === "done" && activeScenario ? (
                <button
                  type="button"
                  onClick={() => choose(activeScenario)}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  <RotateCcwIcon className="size-3" aria-hidden="true" />
                  Replay
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function AgentRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2.5", className)}>
      <LogoMark className="mt-0.5 size-6" />
      <div className="min-w-0 flex-1">
        <span className="sr-only">ResAI: </span>
        {children}
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="inline-flex h-5 items-center gap-1" aria-label="Thinking">
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

function SuggestionChip({
  id,
  onSelect,
}: {
  id: ScenarioId;
  onSelect: (id: ScenarioId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="rounded-full border border-border bg-card px-2.5 py-1 text-[12px] text-foreground transition-colors hover:border-foreground/25 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      “{scenarios[id].prompt}”
    </button>
  );
}
