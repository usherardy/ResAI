import { CheckIcon } from "lucide-react";
import { Container, Eyebrow } from "@/components/site/section";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

const perks = [
  {
    title: "Talk with the founder",
    body: "If you’re up for it, a short call about how your restaurant runs and where your POS gets in the way.",
  },
  {
    title: "Try it early",
    body: "We’ll invite owners in small groups as early versions are ready to test.",
  },
  {
    title: "Steer what we build first",
    body: "Your answers about your POS and your frustrations set our priorities.",
  },
  {
    title: "Free, no commitment",
    body: "Joining costs nothing, and you can opt out anytime.",
  },
];

export function Waitlist() {
  return (
    <section
      id="waitlist"
      aria-labelledby="waitlist-title"
      className="scroll-mt-16 pb-20 sm:pb-28"
    >
      <Container>
        <div className="grid gap-10 rounded-[2rem] bg-surface p-5 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16 lg:p-14">
          <div className="px-1 pt-3 sm:px-0 lg:pt-2">
            <Eyebrow>Early access</Eyebrow>
            <h2
              id="waitlist-title"
              className="mt-5 font-display text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.028em] text-balance sm:text-[3rem]"
            >
              Help shape ResAI.
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
              We&apos;re building ResAI with restaurant owners, not just for them.
              Join the waitlist and tell us what slows you down.
            </p>

            <ul className="mt-10 border-t border-foreground/10">
              {perks.map((perk) => (
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

          <div className="rounded-2xl bg-card p-5 shadow-[0_24px_48px_-28px_oklch(0_0_0/0.2)] sm:p-8">
            <WaitlistForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
