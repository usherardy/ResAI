import { TrendingUpIcon } from "lucide-react";
import { formatDollars } from "@/lib/format";
import { CardShell, MetaPill } from "./card-shell";

// Example data. Revenue = quantity x the menu prices used elsewhere in the demo.
const items = [
  { name: 'Pepperoni 16"', qty: 142, revenue: 2982 },
  { name: 'Margherita 12"', qty: 118, revenue: 1770 },
  { name: "Garlic knots", qty: 109, revenue: 763 },
  { name: "Classic Burger", qty: 86, revenue: 1118 },
  { name: "Caesar salad", qty: 64, revenue: 704 },
];

const top = items[0].qty;

export function BestSellersCard() {
  return (
    <CardShell
      icon={<TrendingUpIcon />}
      title="Top items · this week, Mon–Fri"
      meta={<MetaPill>Example data</MetaPill>}
      footer={
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Pattern:</span> garlic
          knots are in about 1 of every 3 pizza orders. A pizza-and-knots combo
          could be worth testing.
        </p>
      }
    >
      <ol className="space-y-2">
        {items.map((item, i) => (
          <li key={item.name} className="text-[13px]">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 items-baseline gap-2">
                <span className="w-3 font-mono text-[11px] text-muted-foreground">
                  {i + 1}
                </span>
                <span className="truncate font-medium">{item.name}</span>
              </span>
              <span className="shrink-0 text-muted-foreground tabular">
                {item.qty} sold ·{" "}
                <span className="text-foreground">
                  {formatDollars(item.revenue)}
                </span>
              </span>
            </div>
            <div className="mt-1 ml-5 h-1.5 overflow-hidden rounded-full bg-surface">
              <div
                className={i === 0 ? "h-full rounded-full bg-brand" : "h-full rounded-full bg-foreground/20"}
                style={{ width: `${(item.qty / top) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}
