import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL_EFFECTIVE_DATE, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the ResAI website and joining the early-access waitlist.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  const email = siteConfig.contactEmail;
  return (
    <LegalPage
      title="Terms"
      updated={LEGAL_EFFECTIVE_DATE}
      intro={
        <p>
          These terms cover this website and the early-access waitlist. By using
          the site, you agree to them.
        </p>
      }
    >
      <h2>ResAI is pre-launch</h2>
      <p>
        ResAI is in development. We aren&apos;t selling a product or service
        through this site. The interactive demo is a concept preview: its
        responses are scripted, its numbers are made up, and it isn&apos;t
        connected to any restaurant or POS. Features described here, including
        a phone POS and contactless payments, are plans. They may change,
        arrive later than expected, or not ship at all.
      </p>

      <h2>The waitlist</h2>
      <ul>
        <li>Joining is free and doesn&apos;t commit you to anything.</li>
        <li>
          Joining doesn&apos;t guarantee access. We may invite people in groups
          and choose participants based on fit.
        </li>
        <li>
          Any early-access program will come with its own terms, which
          you&apos;ll see before you start.
        </li>
        <li>
          Please give accurate information and only sign up with an email
          address you&apos;re allowed to use.
        </li>
      </ul>

      <h2>Feedback</h2>
      <p>
        If you share ideas or feedback, we may use them to improve ResAI
        without owing you anything for it. We&apos;ll treat personal details as
        described in our <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don&apos;t misuse the site. That means no submitting other people&apos;s
        information, no automated or bulk sign-ups, no attempts to break or
        overload our systems, and no scraping.
      </p>

      <h2>Our content</h2>
      <p>
        The ResAI name, logo, and the content of this site belong to ResAI.
        Please don&apos;t copy them in a way that suggests you&apos;re us or
        that we endorse you.
      </p>

      <h2>No warranties</h2>
      <p>
        The site is provided “as is.” To the extent the law allows, ResAI
        isn&apos;t liable for indirect or consequential damages arising from
        your use of the site or the waitlist.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms as ResAI develops. We&apos;ll change the date
        above when we do.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
