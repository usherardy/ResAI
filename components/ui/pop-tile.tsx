import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A rounded gradient icon tile that sits between the words of a heading.
 * Its slot is zero width until the heading (a `RevealOnView` with `group`)
 * reveals: then the slot widens so the words glide apart, and the tile pops
 * in with a small overshoot and turn. `end` is for a tile that ends its line,
 * so the slot leaves no trailing gap. `floating` adds a slow bob once it has
 * landed. Decorative only; reduced motion shows the finished state.
 */
export function PopTile({
  icon: Icon,
  className,
  delay,
  end = false,
  floating = false,
}: {
  icon: LucideIcon;
  className: string;
  delay: number;
  end?: boolean;
  floating?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "inline-flex h-[0.92em] w-0 items-center align-[-0.14em] transition-[width] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        end
          ? "group-data-[revealed=true]:w-[0.92em] motion-reduce:w-[0.92em]"
          : "group-data-[revealed=true]:w-[1.12em] motion-reduce:w-[1.12em]",
      )}
    >
      <span
        style={{
          transitionDelay: `${delay + 80}ms`,
          // Start bobbing after the pop, each tile on its own beat.
          animationDelay: floating ? `${delay + 1200}ms` : undefined,
        }}
        className={cn(
          "inline-flex size-[0.92em] shrink-0 items-center justify-center rounded-[0.24em] text-white shadow-[0_0.12em_0.3em_-0.08em_oklch(0_0_0/0.35),inset_0_0.03em_0_oklch(1_0_0/0.35)]",
          "scale-0 -rotate-12 opacity-0 transition-[scale,rotate,opacity] duration-[650ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          "group-data-[revealed=true]:scale-100 group-data-[revealed=true]:rotate-0 group-data-[revealed=true]:opacity-100",
          "motion-reduce:scale-100 motion-reduce:rotate-0 motion-reduce:opacity-100",
          floating && "group-data-[revealed=true]:animate-float motion-reduce:animate-none",
          className,
        )}
      >
        <Icon className="size-[0.5em]" strokeWidth={1.75} />
      </span>
    </span>
  );
}
