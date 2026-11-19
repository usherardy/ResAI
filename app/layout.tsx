import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { siteConfig } from "@/lib/site";
import "./globals.css";

// One family for headlines and body, set tight at display sizes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "restaurant POS",
    "AI for restaurants",
    "restaurant operating system",
    "restaurant menu management",
    "POS troubleshooting",
    "independent restaurants",
    "cafés",
    "bars",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#faf9f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-US"
      className={`${inter.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col font-sans">
        <a
          href="#main"
          className="sr-only z-[100] rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {/* Each section brings its own chrome and <main id="main">:
            app/(site)/layout.tsx for the public site, app/admin/ for the dashboard. */}
        {children}
      </body>
    </html>
  );
}
