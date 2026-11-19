import { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/*
 * Adapted from Magic UI's Animated Shiny Text (https://magicui.design, MIT license).
 * Changes: uses the site's ink color at an opacity that keeps small text
 * above WCAG AA contrast, and drops an invalid transition declaration.
 */

interface AnimatedShinyTextProps extends ComponentPropsWithoutRef<"span"> {
  /** Width of the shine band in pixels. */
  shimmerWidth?: number;
}

export function AnimatedShinyText({
  children,
  className,
  shimmerWidth = 100,
  style,
  ...props
}: AnimatedShinyTextProps) {
  return (
    <span
      style={{ "--shiny-width": `${shimmerWidth}px`, ...style } as CSSProperties}
      className={cn(
        "text-foreground/65",
        // The shine: a narrow gradient band clipped to the text.
        "animate-shiny-text bg-size-[var(--shiny-width)_100%] bg-clip-text bg-position-[0_0] bg-no-repeat",
        "bg-linear-to-r from-transparent via-foreground via-50% to-transparent",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
