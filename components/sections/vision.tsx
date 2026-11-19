import {
  MessagesSquareIcon,
  MonitorSmartphoneIcon,
  NfcIcon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/site/section";

const capabilities: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: SmartphoneIcon,
    title: "Take orders on a phone or tablet",
    body: "At the counter, at the table, or out on the patio.",
  },
  {
    icon: NfcIcon,
    title: "Tap to Pay on supported devices",
    body: "Contactless payments, processed by certified payment providers.",
  },
  {
    icon: MessagesSquareIcon,
    title: "The same agent, anywhere",
    body: "Check sales or change the menu from the floor.",
  },
  {
    icon: MonitorSmartphoneIcon,
    title: "Less hardware to buy",
    body: "Use devices you already have instead of a terminal at every station.",
  },
];

function PlannedBadge() {
  return (
    <span className="rounded-md border border-white/15 bg-white/[0.08] px-2 py-0.5 font-mono text-[11px] font-medium tracking-[0.1em] text-white/80 uppercase">
      Planned
    </span>
  );
}

export function Vision() {
  return (
    <section id="vision" aria-labelledby="vision-title" className="scroll-mt-20 pb-24 sm:pb-32">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[1.75rem] bg-ink px-6 py-14 text-white sm:px-12 sm:py-16 lg:px-16">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 -z-10 h-[40rem] w-[50rem] max-w-full bg-[radial-gradient(closest-side,oklch(0.64_0.19_38/0.22),transparent)]"
          />
          <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
            <div>
              <SectionHeading
                id="vision-title"
                tone="dark"
                eyebrow="Vision · where we’re headed"
                title="The POS in your pocket."
                description="Next, we plan to build a phone and tablet POS that runs on devices you may already own. Less to buy, mount, and maintain."
              />
              <p className="mt-8 max-w-xl text-[13px] leading-relaxed text-white/55">
                <span className="font-medium text-white/85">
                  These are planned capabilities and aren&apos;t available today.
                </span>{" "}
                ResAI doesn&apos;t process payments. When we offer contactless
                payments, certified payment providers will handle them, and
                availability will depend on device model, operating system
                version, location, and card or wallet support.
              </p>
            </div>

            <PhoneMockup />
          </div>

          <ul className="mt-20 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((c) => (
              <li key={c.title} className="border-l border-white/20 pr-6 pl-6">
                <div className="flex items-center justify-between gap-3">
                  <c.icon className="size-6 text-white/90" strokeWidth={1.5} aria-hidden="true" />
                  <PlannedBadge />
                </div>
                <h3 className="mt-6 text-lg font-medium">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function PhoneMockup() {
  return (
    <figure className="relative isolate mx-auto w-full max-w-[19rem]">
      <div
        aria-hidden="true"
        className="absolute inset-x-[-35%] top-[15%] bottom-[10%] -z-10 rounded-full bg-[radial-gradient(closest-side,oklch(0.64_0.19_38/0.45),transparent)] blur-2xl"
      />
      <div
        role="img"
        aria-label="Concept mockup of a phone showing a Tap to Pay screen for a $44.64 order. Not a working product."
        className="relative rounded-[3rem] bg-neutral-800 p-2.5 shadow-[0_40px_80px_-30px_oklch(0_0_0/0.8)] ring-1 ring-white/15"
      >
        <div className="relative flex aspect-[9/19] flex-col overflow-hidden rounded-[2.5rem] bg-card px-5 pt-3 pb-5 text-foreground">
          <div className="flex h-7 items-center justify-between text-[11px] font-semibold" aria-hidden="true">
            <span>12:32</span>
            <span className="absolute top-2.5 left-1/2 h-[22px] w-[5.5rem] -translate-x-1/2 rounded-full bg-neutral-900" />
            <span className="h-2 w-3.5 rounded-[2px] border border-foreground/70" />
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
      <figcaption className="mt-5 text-center text-xs text-white/55">
        Concept mockup. Not a working product.
      </figcaption>
    </figure>
  );
}
