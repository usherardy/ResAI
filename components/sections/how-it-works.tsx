import { ArrowUpIcon, CheckIcon, SparklesIcon } from "lucide-react";
import { Container, Eyebrow } from "@/components/site/section";
import { RevealOnView } from "@/components/ui/reveal-on-view";
import { accentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/*
 * How it works as a three-step stepper, following one example (a lunch
 * special) from request to live. Each step's badge lights up, its little
 * screen plays (the request types in; the draft and tags appear; Approve
 * turns into "Live on your menu"), and the line runs on to the next step.
 *
 * Timing: every animated piece sets `--d`, its delay within its own step.
 * On wide screens (lg) the three steps sit in a row and reveal together, so
 * each step also waits `--step` × 1.1s to play in order. Below that the steps
 * stack as a vertical timeline and each one plays when it scrolls into view.
 * Reduced motion shows the end state. Example data only.
 */

/** Delay within the step; on wide screens, plus 1.1s per earlier step. */
const timed = "[transition-delay:var(--d)] lg:[transition-delay:calc(var(--step)*1.1s_+_var(--d))]";
const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

const pop =
  "scale-75 opacity-0 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[revealed=true]:scale-100 group-data-[revealed=true]:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100";
const settle =
  "translate-y-2 opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[revealed=true]:translate-y-0 group-data-[revealed=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";
const fadeIn =
  "opacity-0 transition-opacity duration-150 group-data-[revealed=true]:opacity-100 motion-reduce:opacity-100";
const fadeOut =
  "opacity-100 transition-opacity duration-300 group-data-[revealed=true]:opacity-0 motion-reduce:opacity-0";

/** The small white "screen" inside each step's panel. */
const screen =
  "w-full max-w-[17.5rem] rounded-2xl bg-card p-3.5 text-left shadow-[0_1px_2px_oklch(0_0_0/0.05),0_10px_24px_-14px_oklch(0_0_0/0.3)] ring-1 ring-foreground/[0.05]";

const REQUEST = "Add a lunch special: soup and half sandwich, $12, weekdays 11 to 2.";

function AskScreen() {
  const words = REQUEST.split(" ");
  return (
    <div style={d(350)} className={cn(settle, timed, screen)}>
      {/* The request appears word by word, as if typed. */}
      <p className="min-h-[4.1em] text-[14px] leading-snug">
        {words.map((word, i) => (
          <span key={i} style={d(500 + i * 70)} className={cn(fadeIn, timed)}>
            {word}{" "}
          </span>
        ))}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[10.5px] tracking-[0.08em] text-muted-foreground uppercase">To ResAI</span>
        <span
          style={d(500 + words.length * 70)}
          className={cn(
            timed,
            "flex size-7 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors duration-200",
            "group-data-[revealed=true]:bg-foreground group-data-[revealed=true]:text-background motion-reduce:bg-foreground motion-reduce:text-background",
          )}
        >
          <ArrowUpIcon className="size-3.5" />
        </span>
      </div>
    </div>
  );
}

function Tag({ ms, children }: { ms: number; children: React.ReactNode }) {
  return (
    <span
      style={d(ms)}
      className={cn(
        pop,
        timed,
        "inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[11.5px] font-medium ring-1 ring-brand/25",
      )}
    >
      <SparklesIcon className="size-3 text-brand-strong" />
      {children}
    </span>
  );
}

function ReviewScreen() {
  return (
    <div style={d(350)} className={cn(settle, timed, screen)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] font-semibold">Lunch special</span>
        <span className="rounded-full bg-warning-soft px-2 py-px font-mono text-[10px] font-medium tracking-wide text-warning uppercase">
          Draft
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2 text-[13px]">
        <span className="text-muted-foreground">Soup + half sandwich</span>
        <span className="font-semibold tabular">$12.00</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Tag ms={700}>New item</Tag>
        <Tag ms={820}>Mon–Fri, 11–2</Tag>
      </div>
    </div>
  );
}

function ApproveScreen() {
  return (
    <div style={d(350)} className={cn(settle, timed, screen)}>
      <div className="flex items-center justify-between gap-2 text-[14px]">
        <span className="font-semibold">Lunch special</span>
        <span className="font-semibold tabular">$12.00</span>
      </div>
      <p className="mt-1 text-[13px] text-muted-foreground">Weekdays, 11 AM–2 PM</p>
      {/* The Approve button turns into the "live" confirmation. */}
      <div className="mt-3 grid">
        <span
          style={d(1000)}
          className={cn(
            fadeOut,
            timed,
            "col-start-1 row-start-1 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-foreground text-[13px] font-medium text-background",
          )}
        >
          <CheckIcon className="size-4" />
          Approve
        </span>
        <span
          style={d(1000)}
          className={cn(
            pop,
            timed,
            "col-start-1 row-start-1 inline-flex h-9 items-center justify-center gap-2 rounded-full bg-success text-[13px] font-medium text-white",
          )}
        >
          <CheckIcon className="size-4" strokeWidth={3} />
          Live on your menu
        </span>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Ask",
    body: "Type what you need, the way you’d tell a manager.",
    screen: <AskScreen />,
  },
  {
    title: "Review",
    body: "ResAI drafts the change and shows you what it understood.",
    screen: <ReviewScreen />,
  },
  {
    title: "Approve",
    body: "One tap and it goes live. Nothing changes without your OK.",
    screen: <ApproveScreen />,
  },
];

/** One stretch of the progress line. `vertical` is for the phone timeline. */
function Line({ ms, className }: { ms: number; className?: string }) {
  return (
    <span className={cn("relative overflow-hidden bg-foreground/10", className)}>
      <span
        style={d(ms)}
        className={cn(
          timed,
          "absolute inset-0 origin-top scale-y-0 bg-brand transition-[scale] duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] lg:origin-left lg:scale-x-0 lg:scale-y-100",
          "group-data-[revealed=true]:scale-100 motion-reduce:scale-100",
        )}
      />
    </span>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 pb-16 sm:pb-32">
      <Container>
        <Eyebrow className="text-center">How it works</Eyebrow>
        <h2
          id="how-title"
          className="mx-auto mt-4 max-w-4xl text-center font-display text-[1.875rem] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[3rem] lg:text-[3.5rem]"
        >
          Ask. Review.{" "}
          <em className={cn(accentSerif.className, "text-[1.12em] leading-none tracking-[-0.01em]")}>Approve.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg text-pretty text-muted-foreground">
          From a plain request to a live change, in three steps.
        </p>

        <ol className="mx-auto mt-12 grid max-w-6xl sm:mt-16 lg:grid-cols-3 lg:gap-6">
          {steps.map((step, i) => {
            const first = i === 0;
            const last = i === steps.length - 1;
            return (
              <RevealOnView
                as="li"
                key={step.title}
                threshold={0.35}
                style={{ "--step": i } as React.CSSProperties}
                className="group grid grid-cols-[2.75rem_1fr] gap-x-4 pb-5 last:pb-0 lg:block lg:pb-0"
              >
                {/* The rail. On phones: the badge with a line down to the
                    next step. On wide screens: the badge centered over its
                    card, with the line running through to its neighbours. */}
                <div aria-hidden="true" className="flex flex-col items-center lg:mb-6 lg:flex-row">
                  {first ? (
                    <span className="hidden flex-1 lg:block" />
                  ) : (
                    <Line ms={0} className="hidden h-0.5 flex-1 lg:-ms-3 lg:block" />
                  )}
                  <span
                    style={d(250)}
                    className={cn(
                      timed,
                      "relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-card text-[15px] font-semibold text-muted-foreground tabular ring-[6px] ring-background transition-[background-color,border-color,color,box-shadow] duration-500",
                      "group-data-[revealed=true]:border-brand group-data-[revealed=true]:bg-brand group-data-[revealed=true]:text-white group-data-[revealed=true]:shadow-[0_8px_20px_-6px_oklch(0.64_0.19_38/0.6)]",
                      "motion-reduce:border-brand motion-reduce:bg-brand motion-reduce:text-white",
                    )}
                  >
                    {i + 1}
                  </span>
                  {last ? (
                    <span className="hidden flex-1 lg:block" />
                  ) : (
                    <Line ms={750} className="w-0.5 flex-1 lg:-me-3 lg:h-0.5 lg:w-auto" />
                  )}
                </div>

                <div
                  className={cn(
                    "flex flex-col rounded-[1.75rem] bg-card p-3 shadow-[0_1px_2px_oklch(0_0_0/0.03),0_18px_44px_-30px_oklch(0_0_0/0.3)] ring-1 ring-foreground/[0.06] sm:p-3.5",
                    "translate-y-4 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:[transition-delay:calc(var(--step)*120ms)]",
                    "group-data-[revealed=true]:translate-y-0 group-data-[revealed=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
                  )}
                >
                  <div aria-hidden="true" className="flex h-44 items-center justify-center rounded-[1.4rem] bg-surface px-4">
                    {step.screen}
                  </div>
                  <div className="px-3 pt-6 pb-4 lg:px-5 lg:text-center">
                    <p className="text-[12px] font-semibold tracking-[0.14em] text-brand-strong uppercase">
                      Step {i + 1}
                    </p>
                    <h3 className="mt-2 font-display text-[1.5rem] leading-none font-semibold tracking-[-0.04em] sm:text-[1.625rem]">
                      {step.title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-[19rem] text-[15px] leading-relaxed text-pretty text-foreground/70 lg:text-balance">
                      {step.body}
                    </p>
                  </div>
                </div>
              </RevealOnView>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
