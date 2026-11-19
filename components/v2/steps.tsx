import { CheckIcon, SparklesIcon } from "lucide-react";
import { Container } from "@/components/site/section";
import { RevealOnView } from "@/components/ui/reveal-on-view";
import { card, sectionTitle } from "@/components/v2/styles";
import { cn } from "@/lib/utils";

/** Rises in when the row scrolls into view; `index` staggers the cards. */
const riseIn =
  "translate-y-4 opacity-0 transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-data-[revealed=true]:translate-y-0 group-data-[revealed=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-medium ring-1 ring-brand/25">
      <SparklesIcon className="size-3 text-brand-strong" aria-hidden="true" />
      {children}
    </span>
  );
}

const steps = [
  {
    title: "Ask",
    body: "Type it the way you'd text a manager. No menus to dig through.",
    panel: (
      <div className="flex justify-end">
        <p className="max-w-[15rem] rounded-2xl rounded-br-md bg-foreground px-3.5 py-2.5 text-[14px] leading-snug text-background">
          Add a lunch special: soup and half sandwich, $12, weekdays 11 to 2.
        </p>
      </div>
    ),
  },
  {
    title: "Review",
    body: "ResAI drafts the change and shows exactly what it understood.",
    panel: (
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-[14px]">
          <span>Lunch special</span>
          <span className="font-semibold tabular">$12.00</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Tag>New item</Tag>
          <Tag>Mon–Fri, 11–2</Tag>
        </div>
      </div>
    ),
  },
  {
    title: "Approve",
    body: "One tap and it goes live. Nothing changes without your OK.",
    panel: (
      <div className="flex flex-col items-start gap-3">
        <span className="inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-4 text-[14px] font-medium text-background">
          <CheckIcon className="size-4" aria-hidden="true" />
          Approve
        </span>
        <span className="text-[13px] text-muted-foreground">Or ask for changes first.</span>
      </div>
    ),
  },
];

export function Steps() {
  return (
    <section aria-labelledby="steps-title" className="py-16 sm:py-28">
      <Container>
        <h2 id="steps-title" className={cn(sectionTitle, "text-center")}>
          Ask. Review. <em className="italic">Approve.</em>
        </h2>

        <RevealOnView threshold={0.25} as="ol" className="group mx-auto mt-14 grid max-w-6xl gap-4 md:grid-cols-3 md:gap-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              style={{ transitionDelay: `${i * 120}ms` }}
              className={cn(card, riseIn, "flex flex-col p-6 sm:p-7")}
            >
              <div className="flex h-36 flex-col justify-center rounded-2xl bg-[oklch(0.975_0.01_82)] p-4">
                {step.panel}
              </div>
              <p className="mt-6 text-sm font-medium text-muted-foreground tabular">0{i + 1}</p>
              <h3 className="mt-1 font-[family-name:var(--font-serif-b)] text-[2rem] leading-tight">{step.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </RevealOnView>
      </Container>
    </section>
  );
}
