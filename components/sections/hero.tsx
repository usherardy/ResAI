import { MessagesSquareIcon, TrendingUpIcon } from "lucide-react";
import { RotatingBusiness } from "@/components/sections/rotating-business";
import { Container } from "@/components/site/section";
import { PopTile } from "@/components/ui/pop-tile";
import { RevealOnView } from "@/components/ui/reveal-on-view";
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
          className="pointer-events-none absolute inset-x-0 top-0 -bottom-32 -z-10 bg-hero-gradient [mask-image:linear-gradient(to_bottom,#000_calc(100%_-_20rem),rgb(0_0_0/0.8)_calc(100%_-_14rem),rgb(0_0_0/0.45)_calc(100%_-_8rem),rgb(0_0_0/0.15)_calc(100%_-_3.5rem),transparent)]"
        />
        <Container className="py-14 text-center sm:py-24">
          {/* Fixed lines: three from tablet width up, four on phones (the
              first line splits after "fix,"), so the headline stays big. It
              first reads as a plain sentence; on load each tile's slot widens
              (the words glide apart) and the tile pops in, one line after
              another, then bobs gently. Then "restaurant" keeps rotating
              through café, bar, bakery and food truck (RotatingBusiness). The
              font scales with the screen so each line fits on one row. The
              {" "} between lines keeps it a proper sentence for screen
              readers. */}
          <RevealOnView
            as="h1"
            id="hero-title"
            threshold={0.3}
            className="group mx-auto font-display text-[clamp(2rem,9.2vw,2.6rem)] leading-[1.12] font-semibold tracking-[-0.05em] sm:text-[clamp(2.2rem,7vw,4.75rem)]"
          >
            <span className="block whitespace-nowrap">
              Run, fix,{" "}
              <span className="block sm:inline">
                and grow{" "}
                <PopTile
                  icon={TrendingUpIcon}
                  delay={150}
                  end
                  floating
                  className="bg-linear-to-br from-[rgb(245,140,2)] to-[rgb(245,87,2)]"
                />
              </span>
            </span>{" "}
            <span className="block whitespace-nowrap">
              your <RotatingBusiness />
            </span>{" "}
            <span className="block whitespace-nowrap">
              with{" "}
              <PopTile
                icon={MessagesSquareIcon}
                delay={430}
                floating
                className="bg-linear-to-br from-[rgb(148,201,233)] to-[rgb(110,160,230)]"
              />
              agents.
            </span>
          </RevealOnView>
          <p className="mx-auto mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-pretty text-foreground/80 [animation-delay:450ms] motion-reduce:animate-none sm:mt-8 sm:text-xl">
            Manage your menu, prices, and POS by asking your agent.
          </p>

          <div className="mt-8 flex animate-fade-up flex-col gap-3 [animation-delay:600ms] motion-reduce:animate-none sm:flex-row sm:justify-center">
            <WaitlistCta />
            <a
              href="#demo"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white/70 px-6 text-[16px] font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white focus-visible:ring-[3px] focus-visible:ring-foreground/40 focus-visible:outline-none"
            >
              Try the demo
            </a>
          </div>
        </Container>
      </div>
    </section>
  );
}
