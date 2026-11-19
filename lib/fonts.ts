import { Geist_Mono, Instrument_Serif, Inter } from "next/font/google";

/**
 * One family for headlines and body, set tight at display sizes. Defined here
 * (not inline in layout.tsx) so other modules — e.g. the footer's canvas text
 * measurement — can read the resolved family name via `inter.style.fontFamily`.
 * A CSS `var()` can't be measured by canvas, but this concrete generated name
 * can.
 */
export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Italic serif for the one emphasized phrase in a home page headline
 * ("a dozen clicks"). Only the italic is loaded, and it isn't preloaded
 * because it's below the fold.
 */
export const accentSerif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});
