import { CheckIcon, PrinterIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApproveFooter, CardShell, MetaPill, type CardProps } from "./card-shell";

const checks: { label: string; detail: string; ok: boolean }[] = [
  { label: "POS terminals online", detail: "3 of 3", ok: true },
  { label: "Orders reaching kitchen route", detail: "Last at 12:58 PM", ok: true },
  { label: "Expo printer", detail: "Printing normally", ok: true },
  {
    label: "Kitchen printer",
    detail: "No reply at 192.168.1.87 since 12:41 PM",
    ok: false,
  },
];

const fixSteps = [
  "Print a self-test slip. On most thermal printers, hold the feed button while you turn it on. The slip shows its current address.",
  "Tell me the address on the slip and I’ll update the printer settings.",
  "To keep it from happening again, reserve that address on your router. I can walk you through it.",
];

export function PrinterCard({ approved, onApprove }: CardProps) {
  return (
    <CardShell
      icon={<PrinterIcon />}
      title="Kitchen printing · diagnosis"
      meta={<MetaPill tone="danger">1 issue</MetaPill>}
      footer={
        <ApproveFooter
          summary="Meanwhile, send kitchen tickets to the expo printer?"
          actionLabel="Reroute tickets"
          approvedLabel="Approved in preview. No printers were changed."
          approved={approved}
          onApprove={onApprove}
        />
      }
    >
      <ul className="space-y-1.5">
        {checks.map((check) => (
          <li key={check.label} className="flex items-start gap-2 text-[13px]">
            <span
              className={cn(
                "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full text-white",
                check.ok ? "bg-success" : "bg-destructive",
              )}
              aria-hidden="true"
            >
              {check.ok ? (
                <CheckIcon className="size-2.5" strokeWidth={3.5} />
              ) : (
                <XIcon className="size-2.5" strokeWidth={3.5} />
              )}
            </span>
            <span className="min-w-0">
              <span className="sr-only">{check.ok ? "OK: " : "Problem: "}</span>
              <span className="font-medium">{check.label}</span>{" "}
              <span className="text-muted-foreground">· {check.detail}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-3 rounded-lg bg-warning-soft p-2.5 text-[12.5px]">
        <p className="flex items-center gap-1.5 font-medium text-warning">
          <TriangleAlertIcon className="size-3.5" aria-hidden="true" />
          Likely cause
        </p>
        <p className="mt-1 text-foreground/85">
          The printer&apos;s network address probably changed after a router
          restart. It&apos;s a common cause when a printer isn&apos;t set to a
          fixed address.
        </p>
      </div>

      <ol className="mt-3 space-y-1.5 text-[12.5px]">
        {fixSteps.map((step, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-px flex size-4 shrink-0 items-center justify-center rounded-full border border-border font-mono text-[10px] text-muted-foreground">
              {i + 1}
            </span>
            <span className="text-foreground/85">{step}</span>
          </li>
        ))}
      </ol>
    </CardShell>
  );
}
