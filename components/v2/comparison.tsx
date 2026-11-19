import { Container } from "@/components/site/section";
import { RevealOnView } from "@/components/ui/reveal-on-view";
import { card, kicker, sectionTitle } from "@/components/v2/styles";
import { cn } from "@/lib/utils";

/*
 * Stat-style comparison (an idea from Wispr Flow's "wpm" bar), kept honest:
 * the step counts are an illustration, not a measurement.
 */

const dashboardSteps = [
  "Log in",
  "Open menu editor",
  "Find Classic Burger",
  "Edit price",
  "Save",
  "Find Cheeseburger",
  "Edit price",
  "Save",
  "…4 more burgers",
  "Skip kids menu",
  "Review",
  "Publish",
];

const askExample = "Bump the burgers a dollar, not the kids one.";

export function Comparison() {
  return (
    <section aria-labelledby="comparison-title" className="py-16 sm:py-28">
      <Container>
        <h2 id="comparison-title" className={cn(sectionTitle, "mx-auto max-w-3xl text-center")}>
          One sentence instead of <em className="italic">a dozen clicks.</em>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-center text-lg text-pretty text-muted-foreground">
          Raising six burger prices, the old way and the ResAI way.
        </p>

        <RevealOnView
          threshold={0.35}
          className={cn(card, "group mx-auto mt-12 max-w-5xl p-6 sm:p-10")}
        >
          <div className="flex items-center justify-between gap-3">
            <p className={kicker}>Raise 6 burger prices</p>
            <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              Illustrative
            </span>
          </div>

          <div className="mt-8 grid gap-8 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-x-8 sm:gap-y-10">
            <p className="text-[15px] font-medium">Typical back-office dashboard</p>
            <div>
              <ol className="flex flex-wrap gap-1.5" aria-label="Dashboard steps">
                {dashboardSteps.map((step, i) => (
                  <li
                    key={`${step}-${i}`}
                    style={{ transitionDelay: `${i * 70}ms` }}
                    className="rounded-full bg-surface px-3 py-1.5 text-[13px] text-foreground/75 opacity-0 transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] translate-y-1 group-data-[revealed=true]:translate-y-0 group-data-[revealed=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
                  >
                    {step}
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-sm text-muted-foreground">About 12 steps across a few screens.</p>
            </div>

            <p className="text-[15px] font-medium">ResAI</p>
            <div>
              <div
                style={{ transitionDelay: `${dashboardSteps.length * 70 + 150}ms` }}
                className="inline-flex scale-90 items-center gap-2.5 rounded-full bg-foreground py-2 ps-2 pe-4 text-[15px] text-background opacity-0 transition-[opacity,scale] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-data-[revealed=true]:scale-100 group-data-[revealed=true]:opacity-100 motion-reduce:scale-100 motion-reduce:opacity-100"
              >
                <span className="rounded-full bg-brand px-2.5 py-0.5 text-[12px] font-semibold text-white">Ask</span>
                &ldquo;{askExample}&rdquo;
              </div>
              <p className="mt-3 text-sm text-muted-foreground">One sentence, then one tap to approve.</p>
            </div>
          </div>
        </RevealOnView>
      </Container>
    </section>
  );
}
