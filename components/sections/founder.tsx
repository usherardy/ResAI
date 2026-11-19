import { LogoMark } from "@/components/site/logo";
import { Container } from "@/components/site/section";
import { RevealOnView } from "@/components/ui/reveal-on-view";

/*
 * A hand-drawn brush swipe: ragged ends, wavy edges, a slight upward tilt,
 * and a second, denser pass through the middle like a marker dragged twice.
 * It stretches to fit (preserveAspectRatio="none") and box-decoration-break
 * gives every wrapped line its own swipe.
 */
const brushSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 100' preserveAspectRatio='none'>
  <path fill='rgb(250 165 95)' fill-opacity='0.5' d='M9 33C72 25 150 28 250 22S421 17 492 22C497 30 488 38 495 47C489 56 498 64 491 74C400 81 320 76 240 82S82 79 12 85C4 75 12 65 5 57C12 47 3 39 9 33Z'/>
  <path fill='rgb(245 140 70)' fill-opacity='0.28' d='M22 47C122 40 262 43 382 37S468 39 486 41L483 67C380 71 250 67 140 72S42 69 19 71C24 63 15 55 22 47Z'/>
</svg>`;

// `background-size` is left to Tailwind classes so it can animate from 0% to
// 100% width (the highlighter sweep); everything else stays inline.
const brushStroke: React.CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(brushSvg)}")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "left center",
  WebkitBoxDecorationBreak: "clone",
  boxDecorationBreak: "clone",
};

export function FounderStory() {
  return (
    <section aria-labelledby="founder-title" className="border-t border-border py-16 sm:py-32">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <h2
            id="founder-title"
            className="text-[12px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            Why we’re building this
          </h2>
          <figure className="mt-8">
            <RevealOnView
              as="blockquote"
              threshold={0.4}
              className="group font-display text-[1.3rem] leading-[1.3] font-medium tracking-[-0.03em] text-balance sm:text-[1.875rem] lg:text-[2.25rem] lg:leading-[1.22]"
            >
              <p>
                “After working in restaurant POS technical support, I saw how
                much time restaurant owners lose to complicated settings and
                avoidable technical issues. ResAI started with a simple
                question:{" "}
                {/* The negative margin cancels the padding, so the stroke runs a
                    little past the words without shifting the text. The brush
                    sweeps on from 0% to full width once the quote scrolls in. */}
                <mark
                  style={brushStroke}
                  className="-mx-[0.14em] bg-transparent px-[0.14em] text-inherit [background-size:0%_100%] transition-[background-size] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] [transition-delay:250ms] group-data-[revealed=true]:[background-size:100%_100%] motion-reduce:transition-none motion-reduce:[background-size:100%_100%]"
                >
                  what if managing restaurant technology were as easy as having
                  a conversation?
                </mark>
                ”
              </p>
            </RevealOnView>
            <figcaption className="mt-10 inline-flex items-center gap-3 text-left">
              <LogoMark className="size-9" />
              <div className="text-sm">
                <p className="font-medium">Founder, ResAI</p>
                <p className="text-muted-foreground">Formerly in restaurant POS technical support</p>
              </div>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
