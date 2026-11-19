"use client";

import { Children, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Phones (below md): the children sit in one horizontal row you swipe
 * through, snapping card by card, with the next card peeking in and dots
 * underneath that show (and jump to) the current card. From md up: a plain
 * two-column grid. Children should be the cards themselves.
 */
export function SwipeRow({
  label,
  children,
  className,
}: {
  /** Names the scrollable region for screen readers. */
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState(0);
  const count = Children.count(children);

  /** Where card `i` sits when snapped, as a scroll offset. */
  const offsetOf = (row: HTMLDivElement, i: number) => {
    const card = row.children[i] as HTMLElement | undefined;
    return card ? card.offsetLeft - parseFloat(getComputedStyle(row).paddingLeft) : 0;
  };

  const onScroll = () => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const row = rowRef.current;
      if (!row) return;
      let nearest = 0;
      for (let i = 1; i < row.children.length; i++) {
        if (Math.abs(offsetOf(row, i) - row.scrollLeft) < Math.abs(offsetOf(row, nearest) - row.scrollLeft)) nearest = i;
      }
      setActive(nearest);
    });
  };

  const goTo = (i: number) => {
    setActive(i);
    const row = rowRef.current;
    if (!row) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollTo({ left: offsetOf(row, i), behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={rowRef}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn(
          // Full-bleed on phones so cards swipe edge to edge; the padding and
          // scroll padding line each snapped card up with the page gutter.
          "relative -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-1 scrollbar-none sm:-mx-8 sm:scroll-px-8 sm:px-8",
          "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
          "[&>*]:shrink-0 [&>*]:basis-[86%] [&>*]:snap-start sm:[&>*]:basis-[68%]",
          "md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0",
        )}
      >
        {children}
      </div>
      <div className="mt-3 flex justify-center md:hidden">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show example ${i + 1} of ${count}`}
            aria-current={i === active ? "true" : undefined}
            className="group cursor-pointer p-1.5 focus-visible:outline-none"
          >
            <span
              className={cn(
                "block h-2 rounded-full transition-[width,background-color] duration-300 group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50",
                i === active ? "w-6 bg-foreground" : "w-2 bg-foreground/20",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
