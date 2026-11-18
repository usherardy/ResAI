import type { ScenarioId } from "./scenarios";

/**
 * Maps free text typed into the concept preview to one of the scripted
 * scenarios. Strong keywords count 3, supporting keywords count 1. Anything
 * below the threshold returns null and the demo says honestly that it only
 * knows a few examples.
 */
const keywordTable: Record<ScenarioId, { strong: string[]; weak: string[] }> = {
  menu: {
    strong: ["menu", "pizza", "pizzas", "topping", "toppings", "modifier"],
    weak: ["size", "sizes", "item", "items", "create", "add", "build", "new"],
  },
  revenue: {
    strong: ["revenue", "sales", "how much", "made today", "earn", "earned"],
    weak: ["today", "compare", "friday", "yesterday", "money", "week", "make", "made"],
  },
  printer: {
    strong: ["print", "printer", "printing", "ticket"],
    weak: ["kitchen", "broken", "offline", "not working", "fix", "why", "error"],
  },
  prices: {
    strong: ["price", "prices", "pricing", "raise", "increase"],
    weak: ["burger", "%", "percent", "cost", "change", "lower"],
  },
  bestsellers: {
    strong: ["best", "selling", "seller", "popular", "top"],
    weak: ["most", "items", "week", "which"],
  },
  discount: {
    strong: ["discount", "promo", "promotion", "happy hour", "coupon", "deal"],
    weak: ["lunch", "weekday", "weekdays", "off", "%"],
  },
};

const THRESHOLD = 3;

function countHits(text: string, keywords: string[]): number {
  let hits = 0;
  for (const keyword of keywords) {
    // Match whole words for plain words; substring for phrases/symbols.
    const isWord = /^[a-z]+$/.test(keyword);
    const found = isWord
      ? new RegExp(`\\b${keyword}\\b`).test(text)
      : text.includes(keyword);
    if (found) hits += 1;
  }
  return hits;
}

export function matchPrompt(input: string): ScenarioId | null {
  const text = input.toLowerCase().replace(/[’']/g, "").trim();
  if (!text) return null;

  let best: ScenarioId | null = null;
  let bestScore = 0;

  for (const [id, { strong, weak }] of Object.entries(keywordTable) as [
    ScenarioId,
    { strong: string[]; weak: string[] },
  ][]) {
    const score = countHits(text, strong) * 3 + countHits(text, weak);
    if (score > bestScore) {
      best = id;
      bestScore = score;
    }
  }

  return bestScore >= THRESHOLD ? best : null;
}
