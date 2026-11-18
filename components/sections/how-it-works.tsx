import { ArrowRightIcon, CheckIcon } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-title"
      className="border-t border-border py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Ask. Review. Approve."
          description="You stay in charge. ResAI is designed so nothing on your menu, prices, or settings changes until you say so."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          <Step
            number="1"
            title="Ask"
            body="Type what you need the way you’d tell a manager. No menus to dig through, no settings to find."
          >
            <div className="flex justify-end">
              <p className="rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-[13px] text-background">
                Raise burger prices 10%.
              </p>
            </div>
          </Step>

          <Step
            number="2"
            title="Review"
            body="ResAI shows exactly what will change: which items, old and new prices, and where it applies."
          >
            <div className="space-y-1.5 text-[13px]">
              {[
                ["Classic Burger", "$13.00", "$14.30"],
                ["Cheeseburger", "$14.00", "$15.40"],
              ].map(([item, from, to]) => (
                <div key={item} className="flex items-center justify-between gap-3">
                  <span className="font-medium">{item}</span>
                  <span className="flex items-center gap-1.5 tabular">
                    <span className="text-muted-foreground line-through decoration-foreground/25">
                      {from}
                    </span>
                    <ArrowRightIcon className="size-3 text-muted-foreground" aria-hidden="true" />
                    <span className="font-medium">{to}</span>
                  </span>
                </div>
              ))}
            </div>
          </Step>

          <Step
            number="3"
            title="Approve"
            body="Nothing goes live until you approve it. If something looks off, say what to change and ResAI revises the draft."
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12px] text-muted-foreground">5 changes ready</span>
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-foreground px-3.5 text-[13px] font-medium text-background">
                <CheckIcon className="size-3.5" aria-hidden="true" />
                Approve
              </span>
            </div>
          </Step>
        </ol>
      </Container>
    </section>
  );
}

function Step({
  number,
  title,
  body,
  children,
}: {
  number: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-full bg-brand-soft font-mono text-[12px] font-semibold text-brand-strong">
          {number}
        </span>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="mt-3 leading-relaxed text-pretty text-muted-foreground">{body}</p>
      <div
        aria-hidden="true"
        className="mt-auto min-h-[5.5rem] pt-6"
      >
        <div className="rounded-xl border border-border bg-surface/60 p-3.5">{children}</div>
      </div>
    </li>
  );
}
