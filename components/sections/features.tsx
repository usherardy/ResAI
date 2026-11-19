import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { Container } from "@/components/site/section";
import { FeatureVideo } from "@/components/sections/feature-video";
import { RevealOnView } from "@/components/ui/reveal-on-view";
import { SwipeRow } from "@/components/ui/swipe-row";
import { accentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/*
 * "One sentence instead of a dozen clicks." Four boxes, each one request
 * doing one job. Each box rises in the first time it scrolls into view, then
 * plays like a short screen recording (`FeatureVideo`): the request is
 * typed and sent, ResAI shows what it's checking, then the reply and result
 * build (chips pop, bars grow, checks land, the switch flips on). Reduced
 * motion shows the finished boxes. On phones the boxes sit in a swipeable
 * row (`SwipeRow`) instead of a tall stack. Example data only.
 */

type Feature = {
  title: string;
  body: string;
  example: string;
  work: [string, string];
  reply: string;
  visual: React.ReactNode;
  tone: string;
  dark?: boolean;
};

const features: Feature[] = [
  {
    title: "Menus and prices",
    body: "Add items, sizes, add-ons, and price changes by describing them.",
    example: "Add oat milk as a $0.75 option on every latte.",
    work: ["Reading your menu (38 items)", "Found 3 lattes"],
    reply: "Here’s the draft. It applies to 3 lattes.",
    visual: <MenuVisual />,
    tone: "bg-[oklch(0.95_0.025_55)]",
  },
  {
    title: "Sales, in a sentence",
    body: "Ask about sales, best sellers, or slow hours and get a straight answer.",
    example: "What were my slowest hours this week?",
    work: ["Pulling this week’s sales", "Comparing every hour"],
    reply: "Weekday afternoons are your slowest stretch.",
    visual: <SalesVisual />,
    tone: "bg-[oklch(0.95_0.02_235)]",
  },
  {
    title: "Fixes, step by step",
    body: "When a printer or card reader acts up mid-rush, get the fix one step at a time.",
    example: "The card reader on register 2 keeps disconnecting.",
    work: ["Checking the card reader", "Testing Wi-Fi at register 2"],
    reply: "I checked the likely causes. Here’s what I found.",
    visual: <FixVisual />,
    tone: "bg-ink text-white",
    dark: true,
  },
  {
    title: "Set up your way",
    body: "Change how orders, tabs, and tickets work without waiting on hold.",
    example: "Let the bar keep tabs open until close.",
    work: ["Finding the bar’s tab settings", "Checking nothing else changes"],
    reply: "Ready for your OK. This only affects the bar.",
    visual: <SetupVisual />,
    tone: "bg-card",
  },
];

/** Inline transition delay, in milliseconds after the result appears. */
const after = (ms: number) => ({ transitionDelay: `${ms}ms` });

/** Hidden until the result shows, then eased into place. */
const settle =
  "opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[result=true]:translate-y-0 group-data-[result=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";

/** Like `settle`, with a small overshoot for things that "pop". */
const pop =
  "scale-75 opacity-0 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[result=true]:scale-100 group-data-[result=true]:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100";

export function Features() {
  return (
    <section aria-labelledby="features-title" className="relative py-16 sm:py-32">
      <Container>
        <h2
          id="features-title"
          className="mx-auto max-w-4xl text-center font-display text-[1.875rem] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[3rem] lg:text-[3.5rem]"
        >
          One sentence instead of{" "}
          <em className={cn(accentSerif.className, "text-[1.12em] leading-none tracking-[-0.01em] whitespace-nowrap")}>
            a dozen clicks.
          </em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg text-pretty text-muted-foreground">
          No settings menus, no IT tickets, no waiting on hold.
        </p>

        <SwipeRow label="Example requests" className="mt-10 sm:mt-14">
          {features.map((feature, i) => (
            <RevealOnView
              as="article"
              key={feature.title}
              // Low, so on phones the next card is visible as it peeks in.
              threshold={0.05}
              // The right-hand box in each row follows the left one by a beat.
              style={after((i % 2) * 120)}
              className={cn(
                "flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] p-5 sm:p-8",
                "translate-y-8 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] data-[revealed=true]:translate-y-0 data-[revealed=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100",
                feature.tone,
                !feature.dark && "ring-1 ring-foreground/[0.06] ring-inset",
              )}
            >
              <h3 className="font-display text-[1.375rem] leading-[1.12] font-medium tracking-[-0.04em] sm:text-[1.75rem]">
                {feature.title}
              </h3>
              <p className={cn("mt-2 text-[15px] leading-relaxed", feature.dark ? "text-white/65" : "text-foreground/70")}>
                {feature.body}
              </p>
              <p className="sr-only">
                Example request: {feature.example} ResAI replies: {feature.reply}
              </p>

              <div className="mt-8 flex flex-1 items-end">
                <FeatureVideo
                  title={feature.title}
                  example={feature.example}
                  work={feature.work}
                  reply={feature.reply}
                  visual={feature.visual}
                  startDelay={(i % 2) * 450}
                />
              </div>
            </RevealOnView>
          ))}
        </SwipeRow>
      </Container>
    </section>
  );
}

/* Small illustrations of what ResAI would draft back. Example data only.
   Delays count from the moment the result appears. */

function MenuVisual() {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-[12.5px]">
      <div className="flex items-center justify-between">
        <span className="font-medium">Lattes · add-on</span>
        <span className="rounded-full bg-warning-soft px-2 py-px font-mono text-[10px] font-medium tracking-wide text-warning uppercase">
          Draft
        </span>
      </div>
      <ul className="mt-2 space-y-1.5">
        {["Latte", "Iced latte", "Vanilla latte"].map((item, i) => (
          <li key={item} className="flex items-center justify-between gap-3">
            <span>{item}</span>
            <span
              style={after(250 + i * 130)}
              className={cn(
                pop,
                "origin-right rounded-full border border-brand/25 bg-brand-soft px-2 py-px text-[11.5px] whitespace-nowrap text-brand-strong",
              )}
            >
              + Oat milk $0.75
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SalesVisual() {
  const bars = [62, 78, 34, 28, 30, 56, 88, 70];
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex h-20 items-end gap-1.5">
        {bars.map((h, i) => (
          <span
            key={i}
            style={{ height: `${h}%`, ...after(200 + i * 60) }}
            className={cn(
              "flex-1 origin-bottom scale-y-0 rounded-sm transition-[scale] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[result=true]:scale-y-100 motion-reduce:scale-y-100",
              i >= 2 && i <= 4 ? "bg-brand" : "bg-foreground/12",
            )}
          />
        ))}
      </div>
      <p className="mt-2 text-[12px] text-muted-foreground">
        <span className="font-medium text-foreground">2–5 pm</span> is your slowest stretch
      </p>
    </div>
  );
}

function FixVisual() {
  const rowClass = cn(settle, "flex -translate-y-1 items-center gap-2");
  return (
    <ul className="space-y-1.5 rounded-lg border border-border bg-card p-3 text-[12.5px]">
      <li style={after(200)} className={rowClass}>
        <CheckIcon className="size-3.5 text-success" />
        Reader is charged and paired
      </li>
      <li style={after(450)} className={rowClass}>
        <TriangleAlertIcon className="size-3.5 text-warning" />
        Wi-Fi signal is weak at register 2
      </li>
      <li style={after(700)} className={cn(rowClass, "text-muted-foreground")}>
        <span className="ml-[3px] size-2 rounded-full border border-foreground/30" />
        Next: move it closer to the router
      </li>
    </ul>
  );
}

function SetupVisual() {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-3 text-[12.5px]">
      <div>
        <p className="font-medium">Bar tabs stay open until close</p>
        <p className="text-[11.5px] text-muted-foreground">Applies to: Bar</p>
      </div>
      {/* The switch flips on once the result is in. */}
      <span
        style={after(450)}
        className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-foreground/15 transition-colors duration-300 group-data-[result=true]:bg-success motion-reduce:bg-success"
      >
        <span
          style={after(450)}
          className="absolute left-0.5 size-4 rounded-full bg-white shadow-xs transition-[translate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[result=true]:translate-x-4 motion-reduce:translate-x-4"
        />
      </span>
    </div>
  );
}
