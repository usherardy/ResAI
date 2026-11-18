import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardProps = {
  approved: boolean;
  onApprove: () => void;
};

export function CardShell({
  icon,
  title,
  meta,
  children,
  footer,
  className,
}: {
  icon: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_oklch(0_0_0/0.04),0_4px_16px_-8px_oklch(0_0_0/0.08)]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-3.5 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-surface text-foreground [&>svg]:size-3.5"
            aria-hidden="true"
          >
            {icon}
          </span>
          <p className="truncate text-[13px] font-medium">{title}</p>
        </div>
        {meta}
      </div>
      <div className="px-3.5 py-3 sm:px-4">{children}</div>
      {footer ? (
        <div className="border-t border-border bg-surface/60 px-3.5 py-2.5 sm:px-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}

export function MetaPill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "warning" | "success" | "danger";
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium tracking-wide uppercase",
        tone === "neutral" && "bg-surface text-muted-foreground",
        tone === "warning" && "bg-warning-soft text-warning",
        tone === "success" && "bg-success-soft text-success",
        tone === "danger" && "bg-brand-soft text-brand-strong",
      )}
    >
      {children}
    </span>
  );
}

/**
 * The approval footer shared by every card that would change something.
 * Approving in the preview only flips local state. That's stated plainly.
 */
export function ApproveFooter({
  summary,
  actionLabel,
  approvedLabel = "Approved in preview. Nothing was actually changed.",
  approved,
  onApprove,
}: {
  summary: string;
  actionLabel: string;
  approvedLabel?: string;
} & CardProps) {
  if (approved) {
    return (
      <p
        className="flex animate-fade-in items-center gap-2 text-[13px] font-medium text-success"
        role="status"
      >
        <span className="flex size-4 items-center justify-center rounded-full bg-success text-white">
          <CheckIcon className="size-3" aria-hidden="true" strokeWidth={3} />
        </span>
        {approvedLabel}
      </p>
    );
  }
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <p className="text-xs text-muted-foreground">{summary}</p>
      <button
        type="button"
        onClick={onApprove}
        className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <CheckIcon className="size-3.5" aria-hidden="true" />
        {actionLabel}
      </button>
    </div>
  );
}
