const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const usdWhole = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** Formats integer cents as US dollars, e.g. 1430 -> "$14.30". */
export function formatCents(cents: number): string {
  return usd.format(cents / 100);
}

/** Formats whole dollars without cents, e.g. 2184 -> "$2,184". */
export function formatDollars(dollars: number): string {
  return usdWhole.format(dollars);
}

/** Applies a percentage change to a price in cents, rounding to the cent. */
export function applyPercent(cents: number, percent: number): number {
  return Math.round(cents * (1 + percent / 100));
}

/** Rounds a price in cents up to the next quarter dollar. */
export function roundUpToQuarter(cents: number): number {
  return Math.ceil(cents / 25) * 25;
}
