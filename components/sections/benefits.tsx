import { Container, SectionHeading } from "@/components/site/section";

const benefits = [
  {
    title: "Skip the settings maze",
    body: "Menus, modifiers, prices, and discounts live behind tabs inside tabs. Describe the change in plain English. ResAI drafts it, and you approve it.",
    example: "Add oat milk as a $0.75 option on every latte.",
  },
  {
    title: "See how the day is going",
    body: "Ask about sales, best sellers, or slow hours and get a straight answer. No report builder, no exporting to a spreadsheet.",
    example: "What were my three slowest hours this week?",
  },
  {
    title: "Get help when something breaks",
    body: "When a printer or card reader acts up mid-rush, ResAI checks the likely causes and walks you through the fix one step at a time.",
    example: "The card reader on register 2 keeps disconnecting.",
  },
  {
    title: "Set it up the way you work",
    body: "Counter service, table service, or a busy bar. Change how orders, tabs, and tickets flow by asking, not by waiting on hold.",
    example: "Let the bar keep tabs open until close.",
  },
];

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="border-t border-border py-20 sm:py-28">
      <Container>
        <SectionHeading
          id="benefits-title"
          eyebrow="What we’re building"
          title="Less time in settings. More time running the place."
          description="Most POS systems were built for trained admins. ResAI is being built for the person who actually runs the restaurant and just needs things to work."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
          {benefits.map((benefit, i) => (
            <li key={benefit.title} className="flex flex-col bg-card p-6 sm:p-8">
              <span className="font-mono text-xs text-muted-foreground">
                0{i + 1}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight">
                {benefit.title}
              </h3>
              <p className="mt-2.5 leading-relaxed text-pretty text-muted-foreground">
                {benefit.body}
              </p>
              <div className="mt-auto pt-6">
                <p className="flex items-start gap-2 rounded-lg bg-surface px-3 py-2.5 font-mono text-[12.5px] leading-relaxed text-foreground/85">
                  <span className="text-brand-strong select-none" aria-hidden="true">
                    ›
                  </span>
                  <span>
                    <span className="sr-only">Example request: </span>
                    {benefit.example}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
