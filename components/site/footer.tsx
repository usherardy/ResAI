import DoodleCrewFooter from "@/components/ui/doodle-crew-footer-sunny";
import { LogoMark } from "@/components/site/logo";
import { inter } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";

/**
 * The public site footer: the "doodle crew" footer, conformed to the ResAI
 * look. The crew is a cast of restaurant food — a coffee cup, a sunny-side egg,
 * a bao in a chef's toque, a chili pepper and a cupcake — drawn as crisp vector
 * line art (the hand-drawn ink texture is turned off), with the real ResAI
 * logo and the site's Inter type everywhere. The palette matches the site
 * (dark ink ground, warm paper lines, ember/tomato accent). Links point at the
 * real routes; "#join" stays a plain anchor so the browser fires hashchange and
 * the waitlist panel opens on any page.
 */
export function SiteFooter() {
  return (
    <DoodleCrewFooter
      // Match the site tokens: near-black ground, near-white ink, brand ember.
      palette={{
        background: "oklch(0.13 0.004 60)",
        ink: "oklch(0.97 0.006 90)",
        accent: "oklch(0.64 0.19 38)",
      }}
      // The real ResAI mark, and the site's Inter for every bit of type. A
      // concrete family name (not a CSS var) so the wordmark's canvas measuring
      // works. texture stays ON — the scratchy ink edges + line boil are the
      // whole charm; they ride on top of the Inter glyphs either way.
      logo={<LogoMark inverted />}
      fontFamily={inter.style.fontFamily}
      serifFamily={inter.style.fontFamily}
      uiFamily={inter.style.fontFamily}
      wordmark="RESAI"
      brand={siteConfig.name}
      blurb="Restaurant software you can talk to — an AI agent for independent restaurants, cafés, bars, bakeries, and food trucks. In early development."
      tagline="Update menus, change prices, check sales, and fix the POS by just asking."
      // The little drifting doodles: all food-and-restaurant themed.
      doodles={["sandwich", "flame", "heart", "sandwich", "star", "flame"]}
      doodleCount={11}
      crew={[
        { kind: "coffee", letter: 0, seat: "front", offset: -0.28, name: "Bean", says: "Flat white, extra foam?" },
        { kind: "egg", letter: 1, seat: "top", name: "Sunny", says: "Brunch is always on." },
        { kind: "bao", letter: 2, seat: "front", offset: 0.12, scale: 0.95, name: "Chef", says: "Table's ready — follow me." },
        { kind: "pepper", letter: 3, seat: "behind", name: "Pep", says: "86 the ghost pepper. Trust me." },
        { kind: "cupcake", letter: 4, seat: "front", offset: 0.4, flip: true, name: "Cherry", says: "Dessert first. I insist." },
      ]}
      columns={[
        {
          title: "ResAI",
          links: [
            { label: "Try the demo", href: "/#demo" },
            { label: "How it works", href: "/#how-it-works" },
            { label: "Vision", href: "/#vision" },
            { label: "FAQ", href: "/#faq" },
          ],
        },
        {
          title: "Early access",
          links: [
            { label: "Join the waitlist", href: "#join" },
            { label: "Opt out of emails", href: "/opt-out" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
          ],
        },
      ]}
      actions={[
        { label: "Try the demo", href: "/#demo", icon: "heart", variant: "outline" },
        { label: "Join the waitlist", href: "#join", icon: "sandwich", variant: "solid" },
      ]}
      copyright={`© ${siteConfig.copyrightYear} ${siteConfig.name} · Pre-launch, not yet available for purchase.`}
      legal={[
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]}
      socials={[{ label: siteConfig.contactEmail, href: `mailto:${siteConfig.contactEmail}` }]}
    />
  );
}
