import { AssistantTabs } from "@/components/sections/assistant-tabs";
import { Container } from "@/components/site/section";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { accentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/**
 * "One assistant for the whole back office" ("Try the demo" jumps here),
 * ending with a join prompt right after the visitor has seen a result.
 */
export function Demo() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-20 pb-16 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-surface px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <h2
            id="demo-title"
            className="mx-auto max-w-3xl text-center font-display text-[1.875rem] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[3rem] lg:text-[3.5rem]"
          >
            One assistant for the{" "}
            <em className={cn(accentSerif.className, "text-[1.12em] leading-none tracking-[-0.01em]")}>
              whole back office.
            </em>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-center text-lg text-pretty text-muted-foreground">
            Pick a job and watch ResAI work through it.
          </p>
          <div className="mt-8 sm:mt-10">
            <AssistantTabs />
          </div>
          <div className="mt-10 flex flex-col items-center gap-5 border-t border-foreground/10 pt-8 text-center sm:mt-12 sm:flex-row sm:justify-between sm:gap-8 sm:text-left">
            <div>
              <p className="font-display text-[1.375rem] leading-tight font-semibold tracking-[-0.035em] text-balance sm:text-[1.625rem]">
                Want this for your restaurant?
              </p>
              <p className="mt-1.5 text-[14px] text-pretty text-muted-foreground">
                Free to join, no commitment. This is a concept preview with
                example data; ResAI isn&apos;t live yet.
              </p>
            </div>
            <WaitlistCta className="shrink-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
