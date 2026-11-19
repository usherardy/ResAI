import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/legal-page";
import { OptOutForm } from "@/components/waitlist/opt-out-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Opt out of emails",
  description: "Stop ResAI from contacting you about early access or research calls.",
  alternates: { canonical: "/opt-out" },
  robots: { index: false, follow: true },
};

export default function OptOutPage() {
  const email = siteConfig.contactEmail;
  return (
    <LegalPage
      title="Opt out of emails"
      intro={
        <p>
          Enter the email you signed up with, and we&apos;ll stop contacting you
          about early access and research calls.
        </p>
      }
    >
      <div className="mt-8">
        <OptOutForm />
      </div>
      <p className="text-sm text-muted-foreground">
        Prefer email? Write to{" "}
        <a href={`mailto:${email}?subject=Opt%20out`}>{email}</a> with the
        subject “Opt out.” Opting out stops outreach but keeps your record so
        we remember not to contact you. To have your information deleted
        entirely, email us and say so. See the{" "}
        <Link href="/privacy">Privacy Policy</Link> for details.
      </p>
    </LegalPage>
  );
}
