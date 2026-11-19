import { LogoMark } from "@/components/site/logo";
import { Container } from "@/components/site/section";

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
            <blockquote className="font-display text-[1.45rem] leading-[1.28] font-medium tracking-[-0.03em] text-balance sm:text-[2.25rem] lg:text-[2.7rem] lg:leading-[1.18]">
              <p>
                “After working in restaurant POS technical support, I saw how
                much time restaurant owners lose to complicated settings and
                avoidable technical issues. ResAI started with a simple
                question: what if managing restaurant technology were as easy
                as having a conversation?”
              </p>
            </blockquote>
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
