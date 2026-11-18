import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            An AI-native operating system for independent restaurants, cafés,
            and bars. In early development.
          </p>
        </div>

        <nav aria-label="Footer" className="text-sm">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
            <li>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {siteConfig.contactEmail}
              </a>
            </li>
            <li>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-foreground"
              >
                Terms
              </Link>
            </li>
            <li>
              <Link
                href="/opt-out"
                className="text-muted-foreground hover:text-foreground"
              >
                Opt out of emails
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-10 text-xs text-muted-foreground sm:px-8">
        © {siteConfig.copyrightYear} {siteConfig.name}. ResAI is pre-launch and
        not yet available for purchase.
      </div>
    </footer>
  );
}
