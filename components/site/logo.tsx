import { cn } from "@/lib/utils";

/**
 * ResAI mark: two "message" lines and an ember cursor. It's meant to read as
 * "you type, it does the work" even at favicon size. `inverted` is for dark
 * backgrounds.
 */
export function LogoMark({
  className,
  inverted = false,
}: {
  className?: string;
  inverted?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-7 shrink-0", className)}
    >
      <rect
        width="32"
        height="32"
        rx="8"
        className={cn("transition-colors", inverted ? "fill-white" : "fill-foreground")}
      />
      <rect
        x="8"
        y="10.5"
        width="16"
        height="3"
        rx="1.5"
        className={cn("transition-colors", inverted ? "fill-foreground" : "fill-white")}
      />
      <rect
        x="8"
        y="18.5"
        width="8.5"
        height="3"
        rx="1.5"
        className={cn("transition-colors", inverted ? "fill-foreground" : "fill-white")}
      />
      <circle cx="21.75" cy="20" r="2.25" className="fill-brand" />
    </svg>
  );
}

export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark inverted={inverted} />
      <span className="text-[17px] font-semibold tracking-tight">ResAI</span>
    </span>
  );
}
