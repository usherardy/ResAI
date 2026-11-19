"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChefHatIcon,
  CoffeeIcon,
  CroissantIcon,
  TruckIcon,
  WineIcon,
  type LucideIcon,
} from "lucide-react";
import { usePrefersReducedMotion } from "@/components/demo/use-demo-player";
import { PopTile } from "@/components/ui/pop-tile";
import { cn } from "@/lib/utils";

/*
 * The hero's rotating word: "your restaurant" becomes café, bar, bakery and
 * food truck, with the tile beside it changing to match. It starts after the
 * intro and keeps cycling while the hero is on screen. It pauses when the
 * visitor scrolls away or switches tabs, and picks up again when they come
 * back.
 *
 * Each change is one smooth crossfade on a shared curve and duration: the old
 * word blurs and lifts out while the new one blurs and rises in, the slot's
 * width glides to the new word (so the centered line moves with it), and the
 * tile's icons crossfade with a slight turn. Nothing is clipped, and there's
 * no empty beat between words.
 *
 * Screen readers get one fixed phrase instead. Reduced motion shows
 * "restaurant" only. The server renders "restaurant" too, so nothing changes
 * when the page's scripts load. Must sit inside the hero's `group` heading,
 * which reveals the tile.
 */

export const businesses: { word: string; icon: LucideIcon }[] = [
  { word: "restaurant", icon: ChefHatIcon },
  { word: "café", icon: CoffeeIcon },
  { word: "bar", icon: WineIcon },
  { word: "bakery", icon: CroissantIcon },
  { word: "food truck", icon: TruckIcon },
];

/** After the tiles have landed. */
export const FIRST_CHANGE_MS = 2800;
/** How long each word stays. */
export const HOLD_MS = 3000;

/** One duration and curve for everything that moves, so it reads as one motion. */
const MOTION = "duration-[650ms] ease-[cubic-bezier(0.45,0,0.2,1)]";

export function RotatingBusiness() {
  const reducedMotion = usePrefersReducedMotion();
  const [{ index, prev }, setWords] = useState<{ index: number; prev: number | null }>({
    index: 0,
    prev: null,
  });
  // Each word's width in em, so the slot scales with the headline's size.
  const [widths, setWidths] = useState<number[] | null>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const slotRef = useRef<HTMLSpanElement>(null);
  // The hero loads on screen; the observer corrects this if it isn't.
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const started = useRef(false);

  // Measure once the font has loaded.
  useEffect(() => {
    let cancelled = false;
    Promise.resolve(document.fonts?.ready).then(() => {
      if (cancelled) return;
      const ems = wordRefs.current.map((el) => {
        if (!el) return 0;
        const fontSize = parseFloat(getComputedStyle(el).fontSize);
        return fontSize ? el.getBoundingClientRect().width / fontSize : 0;
      });
      // No layout (e.g. in tests): keep the natural width.
      if (ems.length === businesses.length && ems.every((w) => w > 0)) setWidths(ems);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Only cycle while the word is on screen and the tab is visible.
  useEffect(() => {
    const el = slotRef.current;
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    const observer =
      el && "IntersectionObserver" in window
        ? new IntersectionObserver((entries) => setInView(entries.some((entry) => entry.isIntersecting)))
        : null;
    if (el) observer?.observe(el);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
    };
  }, []);

  const running = !reducedMotion && inView && pageVisible;

  // Advance one word at a time, round and round: the first change waits for
  // the intro, later ones (including after a pause) wait one hold.
  useEffect(() => {
    if (!running) return;
    const delay = started.current ? HOLD_MS : FIRST_CHANGE_MS;
    started.current = true;
    const id = window.setTimeout(
      () => setWords({ index: (index + 1) % businesses.length, prev: index }),
      delay,
    );
    return () => window.clearTimeout(id);
  }, [running, index]);

  const active = reducedMotion ? 0 : index;
  const leaving = reducedMotion ? null : prev;
  const stateOf = (i: number) => (i === active ? "active" : i === leaving ? "past" : "next");

  return (
    <>
      <span className="sr-only">restaurant, café, bar, bakery, or food truck</span>
      <span
        ref={slotRef}
        aria-hidden="true"
        style={widths ? { width: `${widths[active]}em` } : undefined}
        className={cn("relative inline-block align-baseline whitespace-nowrap transition-[width]", MOTION)}
      >
        {businesses.map((business, i) => {
          const state = stateOf(i);
          return (
            <span
              key={business.word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              data-state={state}
              className={cn(
                // The active word sits in the flow (it sets the natural width
                // before measuring); the others wait on top of it, invisible.
                state === "active" ? "relative" : "absolute top-0 left-0",
                "transition-[opacity,translate,filter]",
                MOTION,
                // The old word leaves a little faster than the new one arrives,
                // so a longer old word is gone before the tile slides over it.
                "data-[state=active]:translate-y-0 data-[state=active]:opacity-100 data-[state=active]:blur-none data-[state=active]:delay-[90ms]",
                "data-[state=past]:-translate-y-[0.22em] data-[state=past]:opacity-0 data-[state=past]:blur-[0.09em] data-[state=past]:duration-[360ms]",
                "data-[state=next]:translate-y-[0.22em] data-[state=next]:opacity-0 data-[state=next]:blur-[0.09em]",
              )}
            >
              {business.word}
            </span>
          );
        })}
      </span>{" "}
      <PopTile
        delay={290}
        end
        floating
        className="bg-linear-to-br from-[rgb(238,174,202)] to-[rgb(202,140,214)]"
      >
        {/* All five icons stacked; they crossfade with a slight turn. */}
        <span className="grid">
          {businesses.map(({ word, icon: Icon }, i) => (
            <span
              key={word}
              data-icon-state={stateOf(i)}
              className={cn(
                "col-start-1 row-start-1 flex transition-[opacity,scale,rotate]",
                MOTION,
                "data-[icon-state=active]:scale-100 data-[icon-state=active]:rotate-0 data-[icon-state=active]:opacity-100",
                "data-[icon-state=past]:scale-75 data-[icon-state=past]:-rotate-[25deg] data-[icon-state=past]:opacity-0",
                "data-[icon-state=next]:scale-75 data-[icon-state=next]:rotate-[25deg] data-[icon-state=next]:opacity-0",
              )}
            >
              <Icon className="size-[0.5em]" strokeWidth={1.75} />
            </span>
          ))}
        </span>
      </PopTile>
    </>
  );
}
