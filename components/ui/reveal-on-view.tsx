"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType } from "react";

type RevealOnViewProps<T extends ElementType> = {
  /** The element to render, e.g. "h2". Defaults to "div". */
  as?: T;
  /** How much of the element must be visible before it reveals (0–1). */
  threshold?: number;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Sets `data-revealed="true"` the first time the element scrolls into view,
 * then stops watching. Style the before/after states with
 * `group-data-[revealed=true]:` (add `group` to the className). The children
 * stay as they are, so server-rendered content passes straight through.
 */
export function RevealOnView<T extends ElementType = "div">({
  as,
  threshold = 0.6,
  children,
  ...props
}: RevealOnViewProps<T>) {
  const Tag: ElementType = as ?? "div";
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || revealed) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [revealed, threshold]);

  return (
    <Tag ref={ref} data-revealed={revealed ? "true" : "false"} {...props}>
      {children}
    </Tag>
  );
}
