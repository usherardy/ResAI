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
      className="border-t border-border bg-surface/70 py-20 sm:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div className="lg:pt-4">
          <Eyebrow>Early access</Eyebrow>
          <h2
            id="waitlist-title"
            className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl"
          >
            Help shape <span className="font-serif font-normal italic">ResAI</span>.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground">
            We&apos;re building ResAI with restaurant owners, not just for them.
            Join the waitlist and tell us what slows you down.
          </p>

          <ul className="mt-10 space-y-5">
            {perks.map((perk, i) => (
              <li key={perk.title} className="flex gap-4">
                <span className="mt-0.5 font-mono text-xs text-brand-strong">0{i + 1}</span>
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

        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.12)] sm:p-8">
          <WaitlistForm />
        </div>
      </Container>
    </section>
  );
}
