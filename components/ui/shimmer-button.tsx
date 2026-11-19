import { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

/*
 * Adapted from Magic UI's Shimmer Button (https://magicui.design, MIT license).
 * Changes: a link variant for in-page CTAs, the site's ink and ember colors,
 * a visible focus ring, and the moving spark is removed under reduced motion.
 */

interface ShimmerOptions {
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  background?: string;
}

const DEFAULTS = {
  shimmerColor: "oklch(0.8 0.15 50)",
  shimmerSize: "0.06em",
  shimmerDuration: "3s",
  background: "oklch(0.17 0.006 60)",
} satisfies Required<ShimmerOptions>;

function shimmerStyle(options: ShimmerOptions, style?: CSSProperties) {
  const o = {
    shimmerColor: options.shimmerColor ?? DEFAULTS.shimmerColor,
    shimmerSize: options.shimmerSize ?? DEFAULTS.shimmerSize,
    shimmerDuration: options.shimmerDuration ?? DEFAULTS.shimmerDuration,
    background: options.background ?? DEFAULTS.background,
  };
  return {
    "--spread": "90deg",
    "--shimmer-color": o.shimmerColor,
    "--radius": "9999px",
    "--speed": o.shimmerDuration,
    "--cut": o.shimmerSize,
    "--bg": o.background,
    ...style,
  } as CSSProperties;
}

const baseClass =
  "group/shimmer relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden [border-radius:var(--radius)] border border-white/10 px-6 text-center font-medium text-white sm:whitespace-nowrap [background:var(--bg)] transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none";

function ShimmerLayers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Spark that travels around the edge */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -z-30 overflow-visible blur-[2px] @container-size motion-reduce:hidden"
      >
        <span className="absolute inset-0 aspect-square h-[100cqh] animate-shimmer-slide rounded-none [mask:none]">
          <span className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </span>
      </span>
      {children}
      {/* Inner highlight */}
      <span
        aria-hidden="true"
        className="absolute inset-0 size-full [border-radius:var(--radius)] shadow-[inset_0_-8px_10px_#ffffff1f] transition-all duration-300 ease-in-out group-hover/shimmer:shadow-[inset_0_-6px_10px_#ffffff3f] group-active/shimmer:shadow-[inset_0_-10px_10px_#ffffff3f]"
      />
      {/* Backdrop that leaves a thin ring for the spark */}
      <span
        aria-hidden="true"
        className="absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
      />
    </>
  );
}

type ShimmerButtonProps = ComponentPropsWithoutRef<"button"> & ShimmerOptions;

export function ShimmerButton({
  shimmerColor,
  shimmerSize,
  shimmerDuration,
  background,
  className,
  style,
  children,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      style={shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, background }, style)}
      className={cn(baseClass, className)}
      {...props}
    >
      <ShimmerLayers>{children}</ShimmerLayers>
    </button>
  );
}

type ShimmerLinkProps = ComponentPropsWithoutRef<"a"> & ShimmerOptions;

export function ShimmerLink({
  shimmerColor,
  shimmerSize,
  shimmerDuration,
  background,
  className,
  style,
  children,
  ...props
}: ShimmerLinkProps) {
  return (
    <a
      style={shimmerStyle({ shimmerColor, shimmerSize, shimmerDuration, background }, style)}
      className={cn(baseClass, className)}
      {...props}
    >
      <ShimmerLayers>{children}</ShimmerLayers>
    </a>
  );
}
