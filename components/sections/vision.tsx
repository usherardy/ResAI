import { NfcIcon } from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";

const capabilities = [
  {
    title: "Take orders on a phone or tablet",
    body: "Ring up orders at the counter, tableside, or out on the patio.",
  },
  {
    title: "Contactless payments on supported devices",
    body: "Tap to Pay on supported phones and tablets, processed by certified payment providers.",
  },
  {
    title: "The same agent, wherever you are",
    body: "Change the menu or check sales from the floor instead of the back office.",
  },
  {
    title: "Less dedicated hardware",
    body: "Use devices that fit your space instead of buying a terminal for every station.",
  },
];

function PlannedBadge() {
  return (
    <span className="shrink-0 rounded-full border border-brand/25 bg-brand-soft px-2 py-0.5 font-mono text-[10.5px] font-medium tracking-wide text-brand-strong uppercase">
      Planned
    </span>
  );
}

export function Vision() {
  return (
    <section
      id="vision"
      aria-labelledby="vision-title"
      className="overflow-hidden border-t border-border bg-surface/70 py-20 sm:py-28"
    >
      <Container className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <SectionHeading
            id="vision-title"
            eyebrow="Vision · where we’re headed"
            title="The POS in your pocket."
            description="After the agent, we plan to build a phone and tablet POS that runs on hardware you may already own, so there’s less to buy, mount, and maintain."
          />

          <ul className="mt-10 divide-y divide-border border-y border-border">
            {capabilities.map((c) => (
              <li key={c.title} className="flex items-start justify-between gap-4 py-4">
                <div>
                  <h3 className="font-medium">{c.title}</h3>
                  <p className="mt-1 text-[15px] text-muted-foreground">{c.body}</p>
                </div>
                <PlannedBadge />
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[13px] leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              These are planned capabilities and aren&apos;t available today.
            </span>{" "}
            ResAI doesn&apos;t process payments. When we offer contactless
            payments, certified payment providers will handle them, and
            availability will depend on device model, operating system version,
            location, and card or wallet support.
          </p>
        </div>

        <PhoneMockup />
      </Container>
    </section>
  );
}

function PhoneMockup() {
  return (
    <figure className="relative mx-auto w-full max-w-[19rem]">
      <div
        role="img"
        aria-label="Concept mockup of a phone showing a Tap to Pay screen for a $44.64 order. Not a working product."
        className="relative rounded-[3rem] bg-foreground p-2.5 shadow-[0_30px_60px_-20px_oklch(0_0_0/0.35),0_0_0_1px_oklch(0_0_0/0.08)]"
      >
        <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2.5rem] bg-card px-5 pt-3 pb-5">
          {/* Status bar */}
          <div className="flex h-7 items-center justify-between text-[11px] font-semibold" aria-hidden="true">
            <span>12:32</span>
            <span className="absolute top-2.5 left-1/2 h-[22px] w-[5.5rem] -translate-x-1/2 rounded-full bg-foreground" />
            <span className="flex items-center gap-1">
              <span className="h-2 w-3.5 rounded-[2px] border border-foreground/70" />
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Table 6 · #1042</span>
            <span className="rounded-full bg-brand-soft px-1.5 py-px font-mono text-[9.5px] font-medium tracking-wide text-brand-strong uppercase">
              Concept
            </span>
          </div>

          <dl className="mt-3 space-y-1.5 text-[12px]">
            {[
              ['2 × Margherita 12"', "$30.00"],
              ["1 × Garlic knots", "$7.00"],
              ["1 × Lemonade", "$4.00"],
              ["Tax", "$3.64"],
            ].map(([item, price]) => (
              <div key={item} className="flex justify-between gap-2">
                <dt className={item === "Tax" ? "text-muted-foreground" : undefined}>{item}</dt>
                <dd className="tabular">{price}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-[12px] text-muted-foreground">Total</span>
            <span className="text-2xl font-semibold tracking-tight tabular">$44.64</span>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative flex size-24 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-brand/15" />
              <span className="absolute inset-3 rounded-full border border-brand/25" />
              <span className="absolute inset-3 animate-soft-pulse rounded-full" />
              <span className="relative flex size-12 items-center justify-center rounded-full bg-brand text-white">
                <NfcIcon className="size-6" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-4 text-[15px] font-semibold tracking-tight">Tap to pay</p>
            <p className="mt-1 text-[11.5px] leading-snug text-muted-foreground">
              Hold a contactless card or phone near the top of this device
            </p>
          </div>

          <div className="rounded-full border border-border py-2 text-center text-[12px] font-medium">
            Other payment options
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-xs text-muted-foreground">
        Concept mockup. Not a working product.
      </figcaption>
    </figure>
  );
}
