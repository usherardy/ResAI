import { Container } from "@/components/site/section";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="pb-16 sm:pb-32">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-hero-gradient px-5 py-16 text-center sm:px-12 sm:py-28">
          <h2
            id="closing-title"
            className="mx-auto max-w-3xl font-display text-[1.875rem] leading-[1.06] font-semibold tracking-[-0.045em] text-balance sm:text-[3rem] lg:text-[3.5rem]"
          >
            Your restaurant, one conversation away.
          </h2>
          <p className="mx-auto mt-5 max-w-md text-pretty text-foreground/75 sm:text-lg">
            Free to join. No commitment. We&apos;ll reach out as early versions
            are ready.
          </p>
          <WaitlistCta className="mt-9" />
        </div>
      </Container>
    </section>
  );
}
