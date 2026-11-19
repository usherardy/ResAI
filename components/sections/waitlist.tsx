import { CheckIcon } from "lucide-react";
import { Container, Eyebrow } from "@/components/site/section";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";
import { waitlistPerks } from "@/lib/waitlist/perks";

const joinSteps = [
  "Your business name and number of locations",
  "Email and phone, so we can reach you",
  "The POS problems that slow you down",
];

export function Waitlist() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-title"
      className="scroll-mt-16 pb-16 sm:pb-28"
    >
      <Container>
        <div className="grid gap-10 rounded-[2rem] bg-surface p-5 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:p-14">
          <div className="min-w-0 px-1 pt-3 sm:px-0 lg:pt-2">
            <Eyebrow>Early access</Eyebrow>
            <h2
              id="waitlist-title"
              className="mt-5 font-display text-[1.625rem] leading-[1.08] font-semibold tracking-[-0.028em] text-balance sm:text-[2.5rem]"
            >
              Help shape ResAI.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
              We&apos;re building ResAI with restaurant owners, not just for them.
              Join the waitlist and tell us what slows you down.
            </p>

            <ul className="mt-10 border-t border-foreground/10">
              {waitlistPerks.map((perk) => (
                <li key={perk.title} className="flex gap-4 border-b border-foreground/10 py-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                    <CheckIcon className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-medium">{perk.title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                      {perk.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col justify-center rounded-2xl bg-card p-6 shadow-[0_24px_48px_-28px_oklch(0_0_0/0.2)] sm:p-10 lg:self-center">
            <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
              Takes about a minute
            </p>
            <p className="mt-3 text-xl leading-snug font-medium tracking-tight text-balance sm:text-2xl">
              Tell us about your restaurant, how to reach you, and what&apos;s
              not working with your POS.
            </p>
            <ol className="mt-6 space-y-2.5 text-[15px] text-muted-foreground">
              {joinSteps.map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-medium text-foreground tabular">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <WaitlistCta className="mt-8 sm:w-full" />
          </div>
        </div>
      </Container>
    </section>
  );
}
