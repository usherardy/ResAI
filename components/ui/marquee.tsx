import { type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/*
 * Adapted from Magic UI's Marquee (https://magicui.design, MIT license).
 * Changes: only the first copy is exposed to assistive tech, it can be paused
 * from outside, and with reduced motion it renders one static copy, either
 * wrapped or as a row you can scroll sideways.
 */

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /** Scroll right to left (default) or left to right. */
  reverse?: boolean;
  pauseOnHover?: boolean;
  /** Pause the animation, e.g. from a visible pause control. */
  paused?: boolean;
  /** How many copies of the content to render for a seamless loop. */
  repeat?: number;
  /** Accessible label for the list of items in the first copy. */
  listLabel?: string;
  /** How the single static copy is laid out under reduced motion. */
  staticLayout?: "wrap" | "scroll";
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  paused = false,
  repeat = 4,
  listLabel,
  staticLayout = "wrap",
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group/marquee flex flex-row gap-(--gap) overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        staticLayout === "scroll" && "motion-reduce:overflow-x-auto",
        className,
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          role={i === 0 && listLabel ? "list" : undefined}
          aria-label={i === 0 ? listLabel : undefined}
          aria-hidden={i > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 animate-marquee flex-row justify-around gap-(--gap)",
            pauseOnHover && "group-hover/marquee:[animation-play-state:paused]",
            paused && "[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            "motion-reduce:animate-none",
            staticLayout === "wrap"
              ? "motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center"
              : "motion-reduce:justify-start",
            i > 0 && "motion-reduce:hidden",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
