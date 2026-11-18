/**
 * Site-wide configuration. Anything a founder is likely to change before
 * launch (domain, contact email, legal dates) lives here.
 */

function normalizeUrl(url: string | undefined): string {
  const fallback = "http://localhost:3000";
  if (!url) return fallback;
  try {
    const parsed = new URL(url);
    return parsed.origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "ResAI",
  title: "ResAI: Run your restaurant. Just ask.",
  description:
    "ResAI is an AI-native operating system for independent restaurants, cafés, and bars. Create menus, change prices, understand revenue, and troubleshoot your POS by talking to an AI agent. Now taking early-access signups.",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@resai.example",
  /** Shown in the footer. Hardcoded so pages stay fully static. */
  copyrightYear: 2026,
} as const;

/**
 * Bump this whenever the privacy policy changes in a way that matters.
 * It is stored with every waitlist signup so we know which version
 * the person saw.
 */
export const PRIVACY_NOTICE_VERSION = "2026-11-18";
export const LEGAL_EFFECTIVE_DATE = "November 18, 2026";

export const navLinks = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#vision", label: "Vision" },
] as const;
