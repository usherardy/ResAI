import { ArrowDownIcon } from "lucide-react";
import { Container } from "@/components/site/section";
import { BeforeAfterDemo } from "@/components/v2/before-after-demo";
import { serif } from "@/components/v2/styles";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { cn } from "@/lib/utils";

export function HeroB() {
  return (
    <section aria-labelledby="hero-b-title" className="relative isolate overflow-hidden">
      {/* Soft ember and lilac glows behind the headline. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-[46rem] bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,oklch(0.86_0.08_45/0.45),transparent_70%),radial-gradient(ellipse_40%_35%_at_85%_20%,oklch(0.88_0.06_300/0.35),transparent_70%)]"
      />
      <Container className="pt-14 text-center sm:pt-24">
        <p className="inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-white/60 px-3.5 py-1.5 text-[13px] font-medium text-foreground/80 backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-brand" aria-hidden="true" />
          Early access · Coming soon
        </p>

        <h1
          id="hero-b-title"
          className={cn(
            serif,
            "mx-auto mt-7 max-w-5xl text-[3.1rem] leading-[0.98] tracking-[-0.02em] text-balance sm:text-[4.75rem] lg:text-[6.25rem]",
          )}
        >
          Build, run, and grow your restaurant{" "}
          <em className="whitespace-nowrap text-brand-strong italic">with agents.</em>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-foreground/75 sm:text-xl">
          ResAI is an AI agent that turns plain requests into ready-to-approve POS
          changes.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <WaitlistCta />
          <a
            href="#see-it-work"
            className="inline-flex h-12 items-center gap-1.5 rounded-full px-5 text-[16px] font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            See it work
            <ArrowDownIcon className="size-4" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-4 text-sm text-foreground/60">
          Coming soon for US restaurants, cafés, and bars.
        </p>
      </Container>

      <Container className="pt-14 pb-6 sm:pt-20">
        <BeforeAfterDemo />
      </Container>
    </section>
  );
}
