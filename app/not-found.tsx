import Link from "next/link";
import { Container } from "@/components/site/section";
import { SiteChrome } from "@/components/site/site-chrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <Container className="py-28 text-center">
        <p className="font-mono text-xs tracking-[0.08em] text-brand-strong uppercase">404</p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.05] font-semibold tracking-[-0.035em]">
          We couldn&apos;t find that page.
        </h1>
        <p className="mt-4 text-muted-foreground">It may have moved, or it never existed.</p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-full bg-foreground px-6 text-[15px] font-medium text-background hover:bg-foreground/85"
        >
          Back to the homepage
        </Link>
      </Container>
    </SiteChrome>
  );
}
