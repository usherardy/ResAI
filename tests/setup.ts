import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// Browser APIs jsdom doesn't implement. Only installed in DOM environments.
if (typeof window !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  afterEach(() => cleanup());

  if (!window.matchMedia) {
    window.matchMedia = (query: string) =>
      ({
        matches: query.includes("prefers-reduced-motion") ? Boolean(
          (globalThis as { __reducedMotion?: boolean }).__reducedMotion,
        ) : false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }

  if (!("IntersectionObserver" in window)) {
    class ImmediateIntersectionObserver {
      constructor(private callback: IntersectionObserverCallback) {}
      observe(target: Element) {
        this.callback(
          [{ isIntersecting: true, target } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    Object.defineProperty(window, "IntersectionObserver", {
      value: ImmediateIntersectionObserver,
      writable: true,
    });
  }

  if (!("ResizeObserver" in window)) {
    class NoopResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, "ResizeObserver", { value: NoopResizeObserver, writable: true });
  }

  if (!Element.prototype.scrollTo) {
    Element.prototype.scrollTo = function scrollTo() {};
  }
}
