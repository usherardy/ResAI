import { Container } from "@/components/site/section";
import { Showcase } from "@/components/sections/showcase";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";

export function Hero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="relative isolate -mt-16 flex min-h-svh flex-col justify-center pt-16">
        {/* Full-screen sunset gradient on its own layer. It runs up under the
            transparent header, spills a little past the hero, and fades into
            the page with an eased mask so there's no hard edge. The text sits
            above it, unfaded. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -bottom-20 -z-10 bg-hero-gradient [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_15rem),rgb(0_0_0/0.85)_calc(100%_-_10rem),rgb(0_0_0/0.4)_calc(100%_-_5rem),transparent)]"
        />
        <Container className="py-14 sm:py-24">
          <h1
            id="hero-title"
            className="max-w-3xl font-display text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.6rem] lg:text-[4rem]"
          >
            Manage your menu, prices, and POS in plain English
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-foreground/80">
            ResAI is an AI agent for restaurants. Type what you need, check what
            it drafts, and approve it. Nothing changes without your OK.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-start">
            <WaitlistCta />
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/70 px-6 text-[16px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white focus-visible:ring-[3px] focus-visible:ring-foreground/40 focus-visible:outline-none"
            >
              Try the demo
            </a>
          </div>
          <p className="mt-4 text-sm text-foreground/75">
            Coming soon for US restaurants, cafés, and bars.
          </p>
        </Container>
      </div>

      {/* relative: paints the tiles above the gradient's fading tail. */}
      <div className="relative pt-10 sm:pt-14">
        <Showcase />
      </div>
    </section>
  );
}
