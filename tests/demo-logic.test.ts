import { describe, expect, it } from "vitest";
import { matchPrompt } from "@/components/demo/match-prompt";
import { scenarioOrder, scenarios } from "@/components/demo/scenarios";
import { applyPercent, formatCents, roundUpToQuarter } from "@/lib/format";

describe("matchPrompt", () => {
  it("routes every scripted prompt to its own scenario", () => {
    for (const id of scenarioOrder) {
      expect(matchPrompt(scenarios[id].prompt)).toBe(id);
    }
  });

  it.each([
    ["How much did we make today?", "revenue"],
    ["the ticket printer in the kitchen is broken", "printer"],
    ["add a new pasta item to the menu", "menu"],
    ["what are my most popular items", "bestsellers"],
    ["can you make a happy hour deal", "discount"],
    ["increase prices on drinks by 5%", "prices"],
  ])("routes %j to %s", (input, expected) => {
    expect(matchPrompt(input)).toBe(expected);
  });

  it("returns null for things the preview doesn't know", () => {
    expect(matchPrompt("what's the weather tomorrow")).toBeNull();
    expect(matchPrompt("hello")).toBeNull();
    expect(matchPrompt("   ")).toBeNull();
  });
});

describe("price math", () => {
  it("applies a percentage without floating-point drift", () => {
    expect(applyPercent(1300, 10)).toBe(1430);
    expect(applyPercent(1500, 10)).toBe(1650);
    expect(applyPercent(1550, 10)).toBe(1705);
  });

  it("rounds up to the next quarter", () => {
    expect(roundUpToQuarter(1430)).toBe(1450);
    expect(roundUpToQuarter(1650)).toBe(1650);
    expect(roundUpToQuarter(1705)).toBe(1725);
  });

  it("formats cents as dollars", () => {
    expect(formatCents(1430)).toBe("$14.30");
  });
});
