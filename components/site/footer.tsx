import Link from "next/link";
import { Logo } from "@/components/site/logo";
import { siteConfig } from "@/lib/site";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "ResAI",
    links: [
      { href: "/#demo", label: "Try the demo" },
      { href: "/#how-it-works", label: "How it works" },
      { href: "/#vision", label: "Vision" },
      { href: "/#faq", label: "FAQ" },
    ],
  },
  {
    title: "Early access",
    links: [
      { href: "#join", label: "Join the waitlist" },
      { href: "/opt-out", label: "Opt out of emails" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms" },
    ],
  },
];

const footerLinkClass =
  "inline-block py-1.5 text-white/85 underline-offset-4 hover:text-white hover:underline";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 pt-16 pb-10 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-12">
          <div className="col-span-2 space-y-4 md:col-span-1">
            <Logo inverted />
            <p className="max-w-xs font-display text-[1.75rem] leading-[1.15] font-medium tracking-[-0.04em]">
              Restaurant software you can talk to.
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              An AI agent for independent restaurants, cafés, and bars. In
              early development.
            </p>
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="inline-block text-sm font-medium text-white underline-offset-4 hover:underline"
            >
              {siteConfig.contactEmail}
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="text-[12px] font-semibold tracking-[0.14em] text-white/45 uppercase">{column.title}</h2>
              <ul className="mt-3 space-y-1 text-[15px]">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {/* A plain <a> for "#join" so the browser fires hashchange,
                        which opens the waitlist panel on any page. */}
                    {link.href.startsWith("#") ? (
                      <a href={link.href} className={footerLinkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={footerLinkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>© {siteConfig.copyrightYear} {siteConfig.name}</p>
          <p>ResAI is pre-launch and not yet available for purchase.</p>
        </div>
      </div>
    </footer>
  );
}
