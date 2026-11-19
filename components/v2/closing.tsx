import { Container } from "@/components/site/section";
import { serif } from "@/components/v2/styles";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { cn } from "@/lib/utils";

export function Closing() {
  return (
    <section aria-labelledby="closing-b-title" className="pt-8 pb-20 sm:pt-12 sm:pb-28">
      <Container>
        <div className="relative isolate mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-ink px-6 py-20 text-center text-white sm:px-12 sm:py-28">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,oklch(0.64_0.19_38/0.45),transparent_75%)]"
          />
          <h2
            id="closing-b-title"
            className={cn(serif, "mx-auto max-w-3xl text-[2.9rem] leading-[1] tracking-[-0.015em] text-balance sm:text-[4.5rem]")}
          >
            Be one of the first to <em className="text-[oklch(0.8_0.12_50)] italic">just ask.</em>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-white/70 sm:text-lg">
            Free to join. No commitment. We&apos;ll reach out as early versions are ready.
          </p>
          <div className="mt-9 flex justify-center">
            <WaitlistCta tone="light" />
          </div>
        </div>
      </Container>
    </section>
  );
}
