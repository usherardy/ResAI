import { AssistantTabs } from "@/components/sections/assistant-tabs";
import { Container } from "@/components/site/section";
import { accentSerif } from "@/lib/fonts";
import { cn } from "@/lib/utils";

/** "One assistant for the whole back office" ("Try the demo" jumps here). */
export function Demo() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-20 pb-16 sm:pb-32">
      <Container>
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-surface px-4 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <h2
            id="demo-title"
            className="mx-auto max-w-3xl text-center font-display text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.045em] text-balance sm:text-[3.5rem] lg:text-[4rem]"
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
          <p className="mt-8 text-center text-[13px] text-muted-foreground">
            Concept preview with example data. ResAI isn&apos;t live yet.
          </p>
        </div>
      </Container>
    </section>
  );
}
