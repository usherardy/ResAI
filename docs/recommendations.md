# Recommendations: what to improve next

Open suggestions from reviewing the home page against sites like amboras.com
and from walking through it the way a restaurant owner would. Most important
first. Each one says what to change and why. Done items are at the bottom.

## Before launch

1. **Keep one ending, not two.**
   - The closing section ("Your restaurant, one conversation away." + Join) is
     followed straight away by the footer's own pitch ("Update menus, change
     prices… by just asking." + Try the demo + Join). Visitors get two near-identical
     endings.
   - Recommended: keep the closing section (the only ending that says "Free, no
     commitment"). Drop the tagline and the two buttons from the footer, and keep
     its links, legal text and the doodle wordmark.
   - The other option: remove the closing section
     (`components/sections/closing-cta.tsx`) and let the footer end the page.
   - The footer (`components/site/footer.tsx`, `components/ui/doodle-crew-footer-sunny.tsx`)
     was still in progress at the time of writing, so confirm with whoever owns it first.
2. **Answer "Does it work with my POS?" near the top.**
   - It's an owner's first question, and today it's answered only in the FAQ.
   - Add one honest line under the hero, for example the POS systems planned first
     (Square, Toast, Clover…). Only state what's true.
3. **Name the founder.**
   - The quote is signed "Founder, ResAI" with no name or photo. Before launch,
     the founder is the main source of trust.
   - Add a name, a photo and one credential (years in POS support).
4. **Use a domain email address.**
   - The FAQ and footer show a personal Gmail address (set by
     `NEXT_PUBLIC_CONTACT_EMAIL`).
   - Use something like hello@ on the ResAI domain. It looks more professional
     and keeps the personal inbox private.
5. **Match the browser tab title and share image to the hero.**
   - `siteConfig.title` in `lib/site.ts` and `app/opengraph-image.tsx` still say
     "Manage your restaurant by asking your agent".
   - The hero now says "Run, fix, and grow your restaurant with agents."
6. **Settle the hero wording.**
   - The headline says "agents" (plural), while the description, FAQ and footer
     say "your agent" / "an AI agent". Pick one.
   - The line is also close to Amboras's tagline ("Build, run, and grow your next
     brand with agents"). Consider making it more distinct.
7. **Decide what to do with `/v2`.**
   - The comparison page (concept B) is hidden from search (`noindex`), but anyone
     with the link can open it.
   - Delete it (`app/(site)/v2`, `components/v2`, `tests/v2.test.tsx`) or keep
     it on purpose.

## Conversion and clarity

8. **Move the phone hero's content up.**
   - On phones the top third of the first screen is empty gradient, and nothing
     hints that there's more below.
   - Drop the full-screen height on phones, so the headline starts higher and the
     next section peeks in.
9. **Fewer demos in a row.**
   - The four boxes, the three steps and the four tabs show nine "you ask, ResAI
     does it" examples back to back.
   - One or two make the point. Consider trimming the boxes to two, or merging the
     steps into the tabs.
10. **Shorter page.**
    - The page is about 10.6 screens on desktop and 12.7 on phones; Amboras is
      about 6.
    - Section spacing is 128px on desktop (`sm:py-32` / `sm:pb-32`). Bringing it
      to about 96px, plus item 9, would cut it noticeably.
11. **Vision placement.**
    - "The POS in your pocket" (a future phone POS with tap-to-pay) is labelled
      "planned", but it can still make people wonder whether ResAI is an
      assistant or a POS.
    - It now sits after the founder quote. Moving it below "Help shape ResAI", or
      trimming it, would keep the page about today's product.

## Accessibility and code health

12. **Pause control for the rotating word.**
    - The hero word keeps cycling while it's on screen. It pauses off screen and
      on hidden tabs, and reduced motion shows "restaurant" only.
    - WCAG 2.2.2 still asks for a way to pause text that keeps changing. A small
      pause button would cover it.
13. **Full-repo lint is blocked.**
    - `components/ui/doodle-crew-footer-sunny.tsx` has two lint errors: a
      function used before it's declared, and state set directly in an effect.
    - Fix them before relying on `npm run lint` in CI.

## Done (for reference)

- One button label everywhere: "Join the waitlist".
- A join button right after the One assistant demo.
- Vision moved after the founder quote; the scrolling example strip removed.
- "Build" replaced: "Run, fix, and grow your restaurant with agents.", with
  the business word rotating (café, bar, bakery, food truck).
- Smaller, calmer type: hero 76px; section headlines 56px.
- Reassurance under the hero buttons: "Free to join · Nothing changes without
  your OK."
- The four example boxes swipe sideways on phones.
