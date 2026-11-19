import { type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/*
 * Adapted from Magic UI's Border Beam (https://magicui.design, MIT license).
 * Changes: animated with a CSS offset-path keyframe instead of the motion
 * library, shown only where offset-path rect() is supported, and hidden
 * under reduced motion. Place it inside a `relative overflow-hidden` element.
 */

interface BorderBeamProps {
  /** Length of the beam in pixels. */
  size?: number;
  /** Seconds for one trip around the border. */
  duration?: number;
  /** Seconds to offset the start (lets two beams run apart). */
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  reverse?: boolean;
  className?: string;
}

export function BorderBeam({
  size = 120,
  duration = 10,
  delay = 0,
  colorFrom = "oklch(0.64 0.19 38)",
  colorTo = "oklch(0.83 0.13 75)",
  borderWidth = 1.5,
  reverse = false,
  className,
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box] supports-[offset-path:rect(0_auto_auto_0)]:block motion-reduce:hidden!"
      style={{ "--border-beam-width": `${borderWidth}px` } as CSSProperties}
    >
      <div
        className={cn(
          "absolute aspect-square animate-border-beam bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent",
          className,
        )}
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            "--duration": `${duration}s`,
            "--color-from": colorFrom,
            "--color-to": colorTo,
            animationDelay: `-${delay}s`,
            animationDirection: reverse ? "reverse" : undefined,
          } as CSSProperties
        }
      />
    </div>
  );
}
