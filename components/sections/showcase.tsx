"use client";

import { PauseIcon, PlayIcon } from "lucide-react";
import { useState } from "react";
import { BestSellersCard } from "@/components/demo/cards/best-sellers-card";
import { DiscountCard } from "@/components/demo/cards/discount-card";
import { MenuDraftCard } from "@/components/demo/cards/menu-draft-card";
import { PrinterCard } from "@/components/demo/cards/printer-card";
import { PriceChangeCard } from "@/components/demo/cards/price-change-card";
import { RevenueCard } from "@/components/demo/cards/revenue-card";
import { scenarios, type ScenarioId } from "@/components/demo/scenarios";
import { Container } from "@/components/site/section";
import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const noop = () => {};

const tiles: { id: ScenarioId; tag: string; tone: string; card: React.ReactNode }[] = [
  {
    id: "menu",
    tag: "Menus",
    tone: "bg-[oklch(0.84_0.13_78)] text-[oklch(0.28_0.06_50)]",
    card: <MenuDraftCard approved={false} onApprove={noop} />,
  },
  {
    id: "revenue",
    tag: "Sales",
    tone: "bg-[oklch(0.87_0.055_235)] text-[oklch(0.27_0.06_255)]",
    card: <RevenueCard />,
  },
  {
    id: "printer",
    tag: "Fixes",
    tone: "bg-ink text-white",
    card: <PrinterCard approved={false} onApprove={noop} />,
  },
  {
    id: "prices",
    tag: "Pricing",
    tone: "bg-[oklch(0.89_0.06_25)] text-[oklch(0.3_0.08_25)]",
    card: <PriceChangeCard approved={false} onApprove={noop} />,
  },
  {
    id: "bestsellers",
    tag: "Insights",
    tone: "bg-[oklch(0.88_0.05_150)] text-[oklch(0.28_0.05_155)]",
    card: <BestSellersCard />,
  },
  {
    id: "discount",
    tag: "Promotions",
    tone: "bg-[oklch(0.87_0.05_300)] text-[oklch(0.28_0.06_300)]",
    card: <DiscountCard approved={false} onApprove={noop} />,
  },
];

/**
 * A slow strip of large tiles, each showing a request and the draft ResAI
 * would come back with. Decorative: the tiles are inert, and the same
 * examples are fully usable in the demo further down.
 */
export function Showcase() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="pb-6">
      <p className="sr-only">
        Example requests and the drafts ResAI would return, shown as concept
        previews with example data. Try them in the interactive demo below.
      </p>
      <div className="[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] motion-reduce:[mask-image:none]">
        <Marquee
          pauseOnHover
          paused={paused}
          repeat={2}
          staticLayout="scroll"
          className="p-0 [--duration:90s] [--gap:0.75rem] motion-reduce:px-5 sm:motion-reduce:px-8 lg:motion-reduce:px-10"
        >
          {tiles.map((tile) => (
            <div
              key={tile.id}
              inert
              aria-hidden="true"
              className={cn(
                "relative h-[25rem] w-[19rem] shrink-0 overflow-hidden rounded-[1.75rem] p-6 sm:h-[28rem] sm:w-[27rem] sm:p-7",
                tile.tone,
              )}
            >
              <p className="text-[12px] font-semibold tracking-[0.14em] uppercase opacity-70">{tile.tag}</p>
              <p className="mt-3 font-display text-[1.45rem] leading-[1.15] font-medium tracking-[-0.035em] text-balance sm:text-[1.7rem]">
                “{scenarios[tile.id].prompt}”
              </p>
              <div className="absolute inset-x-5 top-[10.5rem] text-foreground shadow-[0_24px_48px_-20px_oklch(0_0_0/0.45)] sm:inset-x-7 sm:top-[11.5rem]">
                {tile.card}
              </div>
            </div>
          ))}
        </Marquee>
      </div>

      <Container className="mt-4 flex items-center justify-between gap-4">
        <p className="text-[13px] text-muted-foreground">Concept previews with example data</p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.07] text-foreground/75 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none motion-reduce:hidden"
        >
          {paused ? (
            <PlayIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <PauseIcon className="size-3.5" aria-hidden="true" />
          )}
          <span className="sr-only">{paused ? "Play" : "Pause"} scrolling examples</span>
        </button>
      </Container>
    </div>
  );
}
