import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Faq } from "@/components/sections/faq";
import { FounderStory } from "@/components/sections/founder";
import { BuiltFor } from "@/components/v2/built-for";
import { Closing } from "@/components/v2/closing";
import { Comparison } from "@/components/v2/comparison";
import { FloatingJoin } from "@/components/v2/floating-join";
import { HeroB } from "@/components/v2/hero";
import { Steps } from "@/components/v2/steps";
import { TaskTabs } from "@/components/v2/task-tabs";
import { Trust } from "@/components/v2/trust";
import { cn } from "@/lib/utils";

/*
 * Landing page "B": an editorial take inspired by wisprflow.ai, built to
 * compare with the main page at "/". Same header, footer and join flow.
 * Hidden from search engines and left out of the sitemap.
 */

const serifB = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif-b",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResAI · concept B",
  robots: { index: false, follow: false },
};

export default function LandingB() {
  return (
    <div
      className={cn(
        serifB.variable,
        // Warm cream canvas that runs up under the header.
        "-mt-16 bg-[oklch(0.965_0.014_82)] pt-16",
        // Reused sections (founder note, FAQ) pick up the serif headlines too.
        "[&_.font-display]:font-[family-name:var(--font-serif-b)] [&_.font-display]:font-normal [&_.font-display]:tracking-[-0.01em]",
      )}
    >
      <HeroB />
      <BuiltFor />
      <Comparison />
      <Steps />
      <TaskTabs />
      <Trust />
      <FounderStory />
      <Faq />
      <Closing />
      <FloatingJoin />
    </div>
  );
}
