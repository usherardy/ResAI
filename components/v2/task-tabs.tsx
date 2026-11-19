"use client";

import { useId, useRef, useState } from "react";
import { MenuDraftCard } from "@/components/demo/cards/menu-draft-card";
import { PrinterCard } from "@/components/demo/cards/printer-card";
import { PriceChangeCard } from "@/components/demo/cards/price-change-card";
import { RevenueCard } from "@/components/demo/cards/revenue-card";
import { scenarios, type ScenarioId } from "@/components/demo/scenarios";
import { Container } from "@/components/site/section";
import { card, kicker, sectionTitle } from "@/components/v2/styles";
import { cn } from "@/lib/utils";

/*
 * "Same thing, different ways" tabs (an idea from Wispr Flow's tone
 * selector): one assistant, four kinds of back-office work. Reuses the
 * main page's demo cards. Example data only.
 */

const tabs: { id: ScenarioId; label: string }[] = [
  { id: "menu", label: "Menus" },
  { id: "prices", label: "Prices" },
  { id: "revenue", label: "Sales" },
  { id: "printer", label: "Fixes" },
];

export function TaskTabs() {
  const uid = useId();
  const [active, setActive] = useState<ScenarioId>("menu");
  const [approved, setApproved] = useState<Partial<Record<ScenarioId, boolean>>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const prompt = scenarios[active].prompt;
  const approve = () => setApproved((a) => ({ ...a, [active]: true }));
  const isApproved = Boolean(approved[active]);

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section aria-labelledby="tasks-title" className="py-16 sm:py-28">
      <Container>
        <h2 id="tasks-title" className={cn(sectionTitle, "mx-auto max-w-3xl text-center")}>
          One assistant for the <em className="italic">whole back office.</em>
        </h2>

        <div
          role="tablist"
          aria-label="Kinds of work"
          className="mx-auto mt-10 flex w-fit gap-1 rounded-full border border-foreground/10 bg-white/70 p-1"
        >
          {tabs.map((tab, i) => {
            const selected = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "h-10 cursor-pointer rounded-full px-4 text-[15px] font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:px-5",
                  selected ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`${uid}-panel`}
          aria-labelledby={`${uid}-tab-${active}`}
          className="mx-auto mt-8 grid max-w-5xl items-center gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-10"
        >
          <div key={`prompt-${active}`} className="animate-fade-up">
            <p className={kicker}>You ask</p>
            <p className="mt-4 font-[family-name:var(--font-serif-b)] text-[2rem] leading-[1.12] tracking-[-0.01em] text-balance sm:text-[2.5rem]">
              &ldquo;{prompt}&rdquo;
            </p>
            <p className="mt-4 text-[15px] text-muted-foreground">
              ResAI drafts it. You check it and approve it.
            </p>
          </div>
          <div key={`card-${active}`} className={cn(card, "animate-fade-up p-3 sm:p-4")}>
            {active === "menu" ? <MenuDraftCard approved={isApproved} onApprove={approve} /> : null}
            {active === "prices" ? <PriceChangeCard approved={isApproved} onApprove={approve} /> : null}
            {active === "revenue" ? <RevenueCard /> : null}
            {active === "printer" ? <PrinterCard approved={isApproved} onApprove={approve} /> : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
