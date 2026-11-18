import { LogoMark } from "@/components/site/logo";
import { Container } from "@/components/site/section";

export function FounderStory() {
  return (
    <section aria-labelledby="founder-title" className="border-t border-border py-20 sm:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2
            id="founder-title"
            className="font-mono text-xs font-medium tracking-[0.08em] text-brand-strong uppercase"
          >
            Why we’re building this
          </h2>
          <figure className="mt-6">
            <blockquote className="font-serif text-[1.9rem] leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[2.5rem] sm:leading-[1.2]">
              <p>
                “After working in restaurant POS technical support, I saw how
                much time restaurant owners lose to complicated settings and
                avoidable technical issues. ResAI started with a simple
                question: what if managing restaurant technology were as easy
                as having a conversation?”
              </p>
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-3">
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
