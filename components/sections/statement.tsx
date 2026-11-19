import { ArrowUpRightIcon, ChefHatIcon, MessagesSquareIcon, ReceiptTextIcon, type LucideIcon } from "lucide-react";
import { Container } from "@/components/site/section";
import { cn } from "@/lib/utils";

/** A small rounded icon tile that sits inline with the headline text. */
function InlineTile({ icon: Icon, className }: { icon: LucideIcon; className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mx-[0.08em] inline-flex size-[0.92em] items-center justify-center rounded-[0.24em] align-[-0.14em] text-white shadow-[0_0.12em_0.3em_-0.08em_oklch(0_0_0/0.35),inset_0_0.03em_0_oklch(1_0_0/0.35)]",
        className,
      )}
    >
      <Icon className="size-[0.5em]" strokeWidth={1.75} />
    </span>
  );
}

export function Statement() {
  return (
    <section aria-labelledby="statement-title" className="py-16 sm:py-32">
      <Container className="text-center">
        <h2
          id="statement-title"
          className="mx-auto max-w-5xl font-display text-[2.7rem] leading-[1.14] font-semibold tracking-[-0.05em] text-balance sm:text-[4.5rem] lg:text-[6rem] lg:leading-[1.08]"
        >
          {/* Each tile is kept on the same line as the word before it. */}
          ResAI is{" "}
          <span className="whitespace-nowrap">
            your{" "}
            <InlineTile icon={ChefHatIcon} className="bg-linear-to-br from-[rgb(245,140,2)] to-[rgb(245,87,2)]" />
          </span>{" "}
          <span className="whitespace-nowrap">
            restaurant&rsquo;s{" "}
            <InlineTile icon={ReceiptTextIcon} className="bg-linear-to-br from-[rgb(238,174,202)] to-[rgb(202,140,214)]" />
          </span>{" "}
          <span className="whitespace-nowrap">
            AI{" "}
            <InlineTile icon={MessagesSquareIcon} className="bg-linear-to-br from-[rgb(148,201,233)] to-[rgb(110,160,230)]" />
          </span>{" "}
          agent
        </h2>
        <p className="mt-8 text-lg text-muted-foreground">Your POS, one conversation away.</p>
        <a
          href="#demo"
          className="mt-6 inline-flex h-10 items-center gap-1.5 rounded-lg bg-foreground px-4 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          Try the demo
          <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </a>
      </Container>
    </section>
  );
}
