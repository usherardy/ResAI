"use client";

import { useState } from "react";
import { ArrowRightIcon, TagIcon } from "lucide-react";
import { applyPercent, formatCents, roundUpToQuarter } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ApproveFooter, CardShell, MetaPill, type CardProps } from "./card-shell";

const burgers = [
  { name: "Classic Burger", cents: 1300 },
  { name: "Cheeseburger", cents: 1400 },
  { name: "Bacon BBQ Burger", cents: 1550 },
  { name: "Mushroom Swiss", cents: 1500 },
  { name: "Veggie Burger", cents: 1400 },
];

type Rounding = "exact" | "quarter";

export function PriceChangeCard({ approved, onApprove }: CardProps) {
  const [rounding, setRounding] = useState<Rounding>("exact");

  return (
    <CardShell
      icon={<TagIcon />}
      title="Burgers · +10%"
      meta={
        <MetaPill tone={approved ? "success" : "warning"}>
          {approved ? "Approved" : "Pending"}
        </MetaPill>
      }
      footer={
        <ApproveFooter
          summary="5 items · dine-in, takeout & online menu"
          actionLabel="Approve 5 changes"
          approvedLabel="Approved in preview. No prices were changed."
          approved={approved}
          onApprove={onApprove}
        />
      }
    >
      <div
        role="radiogroup"
        aria-label="Rounding"
        className="mb-3 inline-flex rounded-lg bg-surface p-0.5 text-[12px]"
      >
        {(
          [
            ["exact", "Exact +10%"],
            ["quarter", "Round up to $0.25"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={rounding === value}
            disabled={approved}
            onClick={() => setRounding(value)}
            className={cn(
              "rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed",
              rounding === value
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <table className="w-full text-[13px]">
        <caption className="sr-only">
          Proposed burger price changes (example data)
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Current price</th>
            <th scope="col">New price</th>
          </tr>
        </thead>
        <tbody>
          {burgers.map((item) => {
            const raised = applyPercent(item.cents, 10);
            const next = rounding === "quarter" ? roundUpToQuarter(raised) : raised;
            return (
              <tr key={item.name} className="border-t border-border/70 first:border-t-0">
                <th scope="row" className="py-1.5 text-left font-medium">
                  {item.name}
                </th>
                <td className="py-1.5 text-right text-muted-foreground tabular line-through decoration-foreground/25">
                  {formatCents(item.cents)}
                </td>
                <td className="w-8 py-1.5 text-center text-muted-foreground" aria-hidden="true">
                  <ArrowRightIcon className="mx-auto size-3" />
                </td>
                <td className="py-1.5 text-right font-medium tabular">
                  {formatCents(next)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </CardShell>
  );
}
