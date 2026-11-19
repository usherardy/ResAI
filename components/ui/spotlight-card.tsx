"use client";

import { type CSSProperties, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

/*
 * Adapted from Magic UI's Magic Card (https://magicui.design, MIT license).
 * A soft glow and a lit border follow the pointer. Uses CSS variables set on
 * pointer move instead of the motion library. Purely decorative; on touch
 * screens and with no pointer the card looks like a normal card.
 */

interface SpotlightCardProps {
  className?: string;
  children: React.ReactNode;
  /** Diameter of the glow in pixels. */
  gradientSize?: number;
}

const ring: CSSProperties = {
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
  WebkitMaskComposite: "xor",
  padding: 1,
};

export function SpotlightCard({ className, children, gradientSize = 280 }: SpotlightCardProps) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      onPointerMove={onPointerMove}
      style={{ "--spot-size": `${gradientSize}px` } as CSSProperties}
      className={cn(
        "group/spot relative isolate overflow-hidden rounded-2xl border border-border bg-card [--spot-x:-999px] [--spot-y:-999px]",
        className,
      )}
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), oklch(0.64 0.19 38 / 0.08), transparent 70%)",
        }}
      />
      {/* Lit border */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          ...ring,
          background:
            "radial-gradient(calc(var(--spot-size) * 0.8) circle at var(--spot-x) var(--spot-y), oklch(0.64 0.19 38 / 0.7), transparent 70%)",
        }}
      />
      {children}
    </div>
  );
}
