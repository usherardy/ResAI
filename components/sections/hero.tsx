import { Container } from "@/components/site/section";
import { Showcase } from "@/components/sections/showcase";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      {/* A soft wash of the sunset gradient in the top corner. */}
      <div
        aria-hidden="true"
        className="absolute -top-64 -right-40 -z-10 size-[46rem] rounded-full bg-hero-gradient opacity-35 blur-3xl"
      />

      <Container className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h1
          id="hero-title"
          className="max-w-3xl font-display text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.6rem] lg:text-[4rem]"
        >
          Manage your menu, prices, and POS in plain English
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
          ResAI is an AI agent for restaurants. Type what you need, check what
          it drafts, and approve it. Nothing changes without your OK.
        </p>

        {/* Top-aligned so an email error under the pill doesn't shift the other button. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
          <WaitlistCta />
          <a
            href="#demo"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground/[0.07] px-6 text-[16px] font-medium text-foreground transition-colors hover:bg-foreground/[0.12] focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Try the demo
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Coming soon for US restaurants, cafés, and bars.
        </p>
      </Container>

      <Showcase />
    </section>
  );
}
