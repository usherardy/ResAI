import { Instrument_Serif } from "next/font/google";

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
