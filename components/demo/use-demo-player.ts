"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { scenarios, type ScenarioId } from "./scenarios";

export type RunTarget = ScenarioId | "fallback";

export type Run = {
  id: number;
  target: RunTarget;
  /** The owner's message as it appears in the conversation. */
  text: string;
};

export type Phase = "idle" | "typing" | "thinking" | "done";

export type PlayerState = {
  run: Run | null;
  phase: Phase;
  /** Characters of the prompt typed into the composer so far. */
  typed: number;
  /** How many agent steps are visible. The last one is "in progress". */
  stepsShown: number;
  approved: boolean;
};

const initialState: PlayerState = {
  run: null,
  phase: "idle",
  typed: 0,
  stepsShown: 0,
  approved: false,
};

/** Timing, in ms. One full run takes about 4.5 seconds. */
const TIMING = {
  charMin: 16,
  charJitter: 26,
  afterTyping: 260,
  firstStep: 380,
  perStep: 620,
  afterSteps: 480,
  fallbackThinking: 700,
};

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

export function stepCount(target: RunTarget): number {
  return target === "fallback" ? 0 : scenarios[target].steps.length;
}

export function useDemoPlayer({ reducedMotion }: { reducedMotion: boolean }) {
  const [state, setState] = useState<PlayerState>(initialState);
  const timers = useRef<number[]>([]);
  const runCounter = useRef(0);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const play = useCallback(
    (target: RunTarget, options: { userText?: string } = {}) => {
      clearTimers();
      const id = ++runCounter.current;
      const text =
        options.userText ??
        (target === "fallback" ? "" : scenarios[target].prompt);
      const run: Run = { id, target, text };
      const steps = stepCount(target);

      if (reducedMotion) {
        setState({
          run,
          phase: "done",
          typed: text.length,
          stepsShown: steps,
          approved: false,
        });
        return;
      }

      const at = (ms: number, fn: () => void) => {
        timers.current.push(window.setTimeout(fn, ms));
      };

      let t = 0;
      const shouldType = options.userText === undefined;

      if (shouldType) {
        setState({ run, phase: "typing", typed: 0, stepsShown: 0, approved: false });
        for (let i = 1; i <= text.length; i++) {
          t += TIMING.charMin + Math.random() * TIMING.charJitter;
          const typed = i;
          at(t, () => setState((s) => (s.run?.id === id ? { ...s, typed } : s)));
        }
        t += TIMING.afterTyping;
        at(t, () =>
          setState((s) => (s.run?.id === id ? { ...s, phase: "thinking" } : s)),
        );
      } else {
        setState({
          run,
          phase: "thinking",
          typed: text.length,
          stepsShown: 0,
          approved: false,
        });
      }

      if (steps === 0) {
        t += TIMING.fallbackThinking;
      } else {
        t += TIMING.firstStep;
        for (let i = 1; i <= steps; i++) {
          const shown = i;
          at(t, () =>
            setState((s) => (s.run?.id === id ? { ...s, stepsShown: shown } : s)),
          );
          if (i < steps) t += TIMING.perStep;
        }
        t += TIMING.perStep;
      }

      t += TIMING.afterSteps;
      at(t, () =>
        setState((s) =>
          s.run?.id === id ? { ...s, phase: "done", stepsShown: steps } : s,
        ),
      );
    },
    [clearTimers, reducedMotion],
  );

  const approve = useCallback(() => {
    setState((s) => (s.phase === "done" ? { ...s, approved: true } : s));
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    setState(initialState);
  }, [clearTimers]);

  return { state, play, approve, stop };
}
