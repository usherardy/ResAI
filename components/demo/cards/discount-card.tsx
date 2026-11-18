import { PercentIcon } from "lucide-react";
import { ApproveFooter, CardShell, MetaPill, type CardProps } from "./card-shell";

const rules: [string, string][] = [
  ["Discount", "20% off"],
  ["When", "Mon–Fri, 11:00 AM–2:00 PM"],
  ["Applies to", "Food on the lunch menu (24 items)"],
  ["Excludes", "Alcohol, gift cards"],
  ["Order types", "Dine-in, takeout"],
  ["Starts", "Next Monday"],
];

export function DiscountCard({ approved, onApprove }: CardProps) {
  return (
    <CardShell
      icon={<PercentIcon />}
      title="Weekday lunch · 20% off"
      meta={
        <MetaPill tone={approved ? "success" : "warning"}>
          {approved ? "Approved" : "Draft"}
        </MetaPill>
      }
      footer={
        <ApproveFooter
          summary="No overlapping discounts found"
          actionLabel="Approve discount"
          approvedLabel="Approved in preview. No discount was created."
          approved={approved}
          onApprove={onApprove}
        />
      }
    >
      <dl className="divide-y divide-border/70 text-[13px]">
        {rules.map(([term, value]) => (
          <div key={term} className="flex justify-between gap-4 py-1.5 first:pt-0 last:pb-0">
            <dt className="text-muted-foreground">{term}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </CardShell>
  );
}
