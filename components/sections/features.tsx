import { CheckIcon, TriangleAlertIcon } from "lucide-react";
import { AgentDemo } from "@/components/demo/agent-demo";
import { LogoMark } from "@/components/site/logo";
import { Container } from "@/components/site/section";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  body: string;
  example: string;
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
    reply: "Here’s the draft. It applies to 3 lattes.",
    visual: <MenuVisual />,
    tone: "bg-[oklch(0.95_0.025_55)]",
  },
  {
    title: "Sales, in a sentence",
    body: "Ask about sales, best sellers, or slow hours and get a straight answer.",
    example: "What were my slowest hours this week?",
    reply: "Weekday afternoons are your slowest stretch.",
    visual: <SalesVisual />,
    tone: "bg-[oklch(0.95_0.02_235)]",
  },
  {
    title: "Fixes, step by step",
    body: "When a printer or card reader acts up mid-rush, get the fix one step at a time.",
    example: "The card reader on register 2 keeps disconnecting.",
    reply: "I checked the likely causes. Here’s what I found.",
    visual: <FixVisual />,
    tone: "bg-ink text-white",
    dark: true,
  },
  {
    title: "Set up your way",
    body: "Change how orders, tabs, and tickets work without waiting on hold.",
    example: "Let the bar keep tabs open until close.",
    reply: "Ready for your OK. This only affects the bar.",
    visual: <SetupVisual />,
    tone: "bg-card",
  },
];

export function Features() {
  return (
    <section aria-labelledby="features-title" className="pb-16 sm:pb-32">
      <Container>
        <h2
          id="features-title"
          className="mx-auto max-w-3xl text-center font-display text-[2.25rem] leading-[1.08] font-medium tracking-[-0.045em] text-balance sm:text-[3rem]"
        >
          No settings menus, no IT tickets, no waiting on hold.
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-14 sm:gap-4 md:grid-cols-2">
          <article
            id="demo"
            aria-labelledby="demo-title"
            className="min-w-0 scroll-mt-20 rounded-[1.75rem] bg-surface p-4 sm:p-8 md:col-span-2 lg:p-10"
          >
            <div className="flex flex-col gap-4 px-1 pt-2 sm:px-0 sm:pt-0 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h3
                  id="demo-title"
                  className="font-display text-[2.4rem] leading-none font-medium tracking-[-0.05em] sm:text-[3.25rem]"
                >
                  One assistant.
                </h3>
                <p className="mt-4 max-w-md text-[16px] leading-relaxed text-foreground/75">
                  Menus, prices, sales, and fixes in one conversation. Try it
                  with a sample restaurant.
                </p>
              </div>
              <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground lg:text-right">
                Concept preview. ResAI isn&apos;t live yet, so the answers are
                scripted with example data.
              </p>
            </div>
            <div className="mt-8">
              <AgentDemo />
            </div>
          </article>

          {features.map((feature) => (
            <article
              key={feature.title}
              className={cn(
                "flex min-w-0 flex-col overflow-hidden rounded-[1.75rem] p-5 sm:p-8",
                feature.tone,
                !feature.dark && "ring-1 ring-foreground/[0.06] ring-inset",
              )}
            >
              <h3 className="font-display text-[1.75rem] leading-[1.1] font-medium tracking-[-0.045em] sm:text-[2.1rem]">
                {feature.title}
              </h3>
              <p className={cn("mt-2 text-[15px] leading-relaxed", feature.dark ? "text-white/65" : "text-foreground/70")}>
                {feature.body}
              </p>
              <p className="sr-only">Example request: {feature.example}</p>

              <div aria-hidden="true" className="mt-8 flex flex-1 items-end">
                <div className="w-full rounded-2xl bg-card p-3.5 text-foreground sm:p-4 shadow-[0_24px_48px_-24px_oklch(0_0_0/0.35)]">
                  <div className="flex justify-end">
                    <p className="max-w-[88%] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-[13.5px] leading-snug text-background">
                      {feature.example}
                    </p>
                  </div>
                  <div className="mt-4 flex items-start gap-2.5">
                    <LogoMark className="size-6" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] leading-snug">{feature.reply}</p>
                      <div className="mt-3">{feature.visual}</div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* Small illustrations of what ResAI would draft back. Example data only. */

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
        {["Latte", "Iced latte", "Vanilla latte"].map((item) => (
          <li key={item} className="flex items-center justify-between gap-3">
            <span>{item}</span>
            <span className="rounded-full border border-brand/25 bg-brand-soft px-2 py-px text-[11.5px] text-brand-strong">
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
            style={{ height: `${h}%` }}
            className={cn("flex-1 rounded-sm", i >= 2 && i <= 4 ? "bg-brand" : "bg-foreground/12")}
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
  return (
    <ul className="space-y-1.5 rounded-lg border border-border bg-card p-3 text-[12.5px]">
      <li className="flex items-center gap-2">
        <CheckIcon className="size-3.5 text-success" />
        Reader is charged and paired
      </li>
      <li className="flex items-center gap-2">
        <TriangleAlertIcon className="size-3.5 text-warning" />
        Wi-Fi signal is weak at register 2
      </li>
      <li className="flex items-center gap-2 text-muted-foreground">
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
      <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-success">
        <span className="absolute right-0.5 size-4 rounded-full bg-white shadow-xs" />
      </span>
    </div>
  );
}
