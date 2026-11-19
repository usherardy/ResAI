"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const raised = scrolled || open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-background/90 text-foreground backdrop-blur-md transition-shadow duration-200",
        raised && "shadow-[0_1px_0_var(--border)]",
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10"
      >
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="-m-1 rounded-md p-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="ResAI home"
          >
            <Logo />
          </Link>
          <ul className="hidden items-center gap-1 md:flex">
            {[...navLinks, { href: "/#faq", label: "FAQ" }].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-3 py-2 text-[15px] text-foreground/80 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/#demo"
            className="hidden h-9 items-center rounded-lg px-3 text-[15px] text-foreground/70 transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:inline-flex"
          >
            Try the demo
          </Link>
          <Link
            href="/#waitlist"
            className="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[15px] font-medium text-background transition-colors hover:bg-foreground/85 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Join waitlist
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none md:hidden"
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <XIcon className="size-5" aria-hidden="true" />
            ) : (
              <MenuIcon className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      <div id={menuId} hidden={!open} className="border-t border-border px-5 pt-2 pb-4 md:hidden">
        <ul className="flex flex-col">
          {[...navLinks, { href: "/#demo", label: "Try the demo" }, { href: "/#faq", label: "FAQ" }].map(
            (link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-3 text-base text-foreground hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {link.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </div>
    </header>
  );
}
