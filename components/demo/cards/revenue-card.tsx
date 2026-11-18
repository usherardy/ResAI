import { ChartColumnIcon } from "lucide-react";
import { formatDollars } from "@/lib/format";
import { CardShell, MetaPill } from "./card-shell";

// Example data: sums are internally consistent (today $2,184 vs. $1,962).
const hours = [
  { label: "11a", today: 312, lastFriday: 298 },
  { label: "12p", today: 688, lastFriday: 612 },
  { label: "1p", today: 741, lastFriday: 655 },
  { label: "2p", today: 443, lastFriday: 397 },
];

const totals = {
  today: hours.reduce((sum, h) => sum + h.today, 0),
  lastFriday: hours.reduce((sum, h) => sum + h.lastFriday, 0),
  ordersToday: 96,
  ordersLastFriday: 91,
};

const change = ((totals.today - totals.lastFriday) / totals.lastFriday) * 100;
const max = Math.max(...hours.flatMap((h) => [h.today, h.lastFriday]));

export function RevenueCard() {
  return (
    <CardShell
      icon={<ChartColumnIcon />}
      title="Today vs. last Friday · through 3:00 PM"
      meta={<MetaPill>Example data</MetaPill>}
      footer={
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Insight:</span> the
          12–2 PM rush is up {formatDollars(688 + 741 - (612 + 655))} on last
          Friday. That&apos;s most of today&apos;s gain.
        </p>
      }
    >
      <dl className="grid grid-cols-3 gap-2">
        <div>
          <dt className="font-mono text-[10.5px] text-muted-foreground uppercase">
            Sales
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tracking-tight tabular">
            {formatDollars(totals.today)}
          </dd>
          <dd className="text-[11.5px] font-medium text-success tabular">
            +{change.toFixed(1)}%{" "}
            <span className="font-normal text-muted-foreground">
              vs {formatDollars(totals.lastFriday)}
            </span>
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10.5px] text-muted-foreground uppercase">
            Orders
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tracking-tight tabular">
            {totals.ordersToday}
          </dd>
          <dd className="text-[11.5px] text-muted-foreground tabular">
            vs {totals.ordersLastFriday}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10.5px] text-muted-foreground uppercase">
            Avg. ticket
          </dt>
          <dd className="mt-0.5 text-lg font-semibold tracking-tight tabular">
            ${(totals.today / totals.ordersToday).toFixed(2)}
          </dd>
          <dd className="text-[11.5px] text-muted-foreground tabular">
            vs ${(totals.lastFriday / totals.ordersLastFriday).toFixed(2)}
          </dd>
        </div>
      </dl>

      <div
        role="img"
        aria-label={`Hourly sales, example data. ${hours
          .map(
            (h) =>
              `${h.label}: today ${formatDollars(h.today)}, last Friday ${formatDollars(h.lastFriday)}`,
          )
          .join("; ")}.`}
        className="mt-4"
      >
        <div className="flex h-24 items-end gap-4 border-b border-border px-1">
          {hours.map((h) => (
            <div key={h.label} className="flex h-full flex-1 items-end gap-1">
              <div
                className="flex-1 rounded-t-[3px] bg-foreground/12"
                style={{ height: `${(h.lastFriday / max) * 100}%` }}
              />
              <div
                className="flex-1 rounded-t-[3px] bg-brand"
                style={{ height: `${(h.today / max) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-4 px-1" aria-hidden="true">
          {hours.map((h) => (
            <span
              key={h.label}
              className="flex-1 text-center font-mono text-[10.5px] text-muted-foreground"
            >
              {h.label}
            </span>
          ))}
        </div>
        <div
          className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground"
          aria-hidden="true"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-brand" /> Today
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2 rounded-[2px] bg-foreground/15" /> Last
            Friday
          </span>
        </div>
      </div>
    </CardShell>
  );
}
