import { SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { WaitlistSheetProvider } from "@/components/waitlist/waitlist-sheet";

/**
 * The public site's header, footer and waitlist page. Used by the (site)
 * route group and the 404 page. The admin dashboard has its own chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <WaitlistSheetProvider>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </WaitlistSheetProvider>
  );
}
