import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { LEGAL_EFFECTIVE_DATE, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What ResAI collects through its early-access waitlist, why, who can see it, and how to opt out or ask for deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  const email = siteConfig.contactEmail;
  return (
    <LegalPage
      title="Privacy Policy"
      updated={LEGAL_EFFECTIVE_DATE}
      intro={
        <p>
          ResAI is a pre-launch startup. Right now the only personal information
          we collect is what you give us through the early-access waitlist. Here&apos;s
          what that is, what we do with it, and how to get it removed.
        </p>
      }
    >
      <h2>What we collect</h2>
      <p>When you join the waitlist, we collect:</p>
      <ul>
        <li>
          <strong>Required:</strong> your email address and your restaurant or
          business name.
        </li>
        <li>
          <strong>Optional:</strong> your name, type of business, current POS
          system, number of locations, your biggest POS frustration, and
          whether you&apos;re open to a research call.
        </li>
        <li>
          <strong>Context:</strong> the date you signed up, which version of
          this policy you saw, and campaign tags (like <code>utm_source</code>)
          if you arrived through a link that had them.
        </li>
      </ul>
      <p>
        To prevent spam and abuse, we process your IP address when you submit a
        form. We turn it, and your email, into a one-way hash for rate limiting.
        We don&apos;t store your raw IP address with your signup, and the hashes
        are deleted routinely, usually within about a day. Our hosting provider
        may keep standard server logs for security and reliability.
      </p>
      <p>
        This site doesn&apos;t use advertising or analytics cookies, and we
        don&apos;t run third-party tracking scripts.
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>To contact you about ResAI early access and related product updates.</li>
        <li>
          If you opted in, to invite you to a short research call about how you
          run your restaurant.
        </li>
        <li>
          To decide what to build first. For example, which POS systems and
          problems come up most. We look at this in aggregate.
        </li>
      </ul>
      <p>
        We don&apos;t sell your personal information, and we don&apos;t share it
        for advertising.
      </p>

      <h2>Who can see it</h2>
      <p>
        Only the ResAI team and the service providers that run this site for
        us: our hosting provider and our database provider (Supabase). They
        process data on our behalf under their own security and privacy terms.
        We may also disclose information if the law requires it, or to a
        successor if ResAI is ever acquired or merged, in which case this
        policy would still apply to your information.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep waitlist details until you ask us to delete them, or until we
        no longer need them for early access and research. We review the list
        and remove stale entries at least once a year.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>
          <strong>Stop hearing from us:</strong> use the{" "}
          <Link href="/opt-out">opt-out page</Link> or email{" "}
          <a href={`mailto:${email}?subject=Opt%20out`}>{email}</a> with the
          subject “Opt out.” Every email we send will also include a way to
          unsubscribe.
        </li>
        <li>
          <strong>See, correct, or delete your information:</strong> email{" "}
          <a href={`mailto:${email}?subject=Privacy%20request`}>{email}</a> from
          the address you signed up with. We&apos;ll reply within 30 days.
        </li>
        <li>
          Depending on where you live (for example, California), you may have
          additional rights under state privacy laws. Contact us and we&apos;ll
          honor them.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Data is encrypted in transit. Waitlist records are stored in a database
        that isn&apos;t publicly accessible: only our server can read or write
        it, using credentials that are never sent to your browser. No system is
        perfectly secure, but we limit access to the people who need it.
      </p>

      <h2>Children</h2>
      <p>
        This site is meant for restaurant owners and operators. It isn&apos;t
        directed to children under 16, and we don&apos;t knowingly collect their
        information.
      </p>

      <h2>Changes</h2>
      <p>
        If we change this policy, we&apos;ll update the date at the top. If a
        change materially affects how we use information you&apos;ve already
        given us, we&apos;ll email you first.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy? Email <a href={`mailto:${email}`}>{email}</a>.
      </p>
    </LegalPage>
  );
}
