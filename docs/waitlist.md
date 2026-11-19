# Join flow

How "Join the waitlist" works, from the button to the database.

## Entry points

All of these open the same full-page form:

| Where | What it is |
| --- | --- |
| Hero, "Help shape ResAI" section, closing section | The black pill "Join the early-access waitlist" with the orange knob (`WaitlistCta`) |
| Header | The "Join waitlist" button |
| Footer | The "Join the waitlist" link (`#join`) |
| Any link to `#join` or `/#join` | Opens the page from anywhere on the site, e.g. in emails or ads |

The pill's hover effect: the orange knob slides from right to left and its
arrow turns to point right. It does the same on keyboard focus.

## The page

A full-screen dialog that slides in from the right.

- **Left (desktop):** the hero's sunset gradient with a faint dot texture and
  an orange glow at the bottom. Logo, "Early access", a big "Join the
  waitlist." headline, one line of pitch, the four perks as frosted cards,
  and "Free to join. No commitment. Opt out anytime."
- **Right (desktop):** "A few quick questions" and the form. Email | Phone
  and Website | Locations sit side by side. Only this side scrolls.
- **Phones:** one full-screen column with a short gradient band on top (logo,
  headline, one line). The perks are hidden so the questions start high. The
  whole page scrolls.
- **Join button:** pinned to the bottom while the questions scroll. Any
  submit error appears directly above it, so it's never hidden.
- **Close:** a "Close" pill top-right, or Escape. On phones it scrolls away
  with the page instead of covering the questions.

The questions themselves, and how each answer is stored, are in
[Waitlist data](data.md).

## Motion

CSS only (no animation library). The `stagger-rise` utility, the `rise` and
`edge-glow` keyframes live in `app/globals.css`.

| Moment | What happens | Timing |
| --- | --- | --- |
| Open | The page slides in from the right edge | 750ms, ease-out-expo `cubic-bezier(0.16, 1, 0.3, 1)` |
| Open | A thin orange edge on its leading (left) side glows, then fades as it lands | 900ms |
| Open | Backdrop dims and lightly blurs the site behind | 500ms |
| Open | Eyebrow, headline and pitch rise in one after another (14px up, fade in) | from 220ms, 70ms apart |
| Open | Perk cards rise in | from 460ms, 70ms apart |
| Open | "A few quick questions" heading | from 300ms, 60ms apart |
| Open | Each row of questions rises in | from 380ms, 45ms apart |
| Close | The page slides back out to the right | 450ms, ease-in `cubic-bezier(0.7, 0, 0.84, 0)` |

**Reduced motion:** visitors with the "reduce motion" setting get no
animation. The page simply appears and disappears.

## Behavior details

- **Focus:** on open, focus goes to the page itself, so screen readers
  announce "Join the waitlist." and phones don't pop the keyboard up straight
  away. Tab goes to Close, then the first question. On close, focus returns
  to whatever opened it.
- **Draft kept:** closing the page by accident keeps what was typed and which
  chips were picked, until the visitor reloads. If they already joined,
  reopening shows the success screen again.
- **Tap again to clear:** tapping the selected "How many locations?" option
  again clears it, since the question is optional.
- **`#join` links:** the page opens, then `#join` is removed from the URL so
  the link works again and a refresh doesn't reopen it. On a fresh page load
  it waits until the page has finished loading.
- **Validation** runs in the browser first (same rules as the server), shows
  a message under each field, and moves focus to the first problem.

## What happens on submit

1. The browser checks the answers. If something's wrong, nothing is sent.
2. It sends JSON to `POST /api/waitlist` with the answers, any UTM tags from
   the URL, how long the visitor took (`elapsedMs`), and a hidden
   `honeypot` field.
3. The server runs its checks (see [Architecture](architecture.md#spam-and-abuse-protection))
   and stores the lead in `waitlist_leads`.

| Response | When | What the visitor sees |
| --- | --- | --- |
| **200** | Stored. Also returned for duplicates and suspected bots (nothing is stored for those) | "You're on the list." with their email (opting out lives in the footer and privacy policy) |
| **400** | Invalid answers (or invalid JSON) | Field messages + "Please check the highlighted fields." |
| **403** | Cross-site request | "Cross-site requests aren't allowed." |
| **413** | Body over 10 KB | "Request is too large." |
| **415** | Not JSON | "Expected a JSON request." |
| **429** | Rate limited | "Too many attempts. Please wait a few minutes and try again." |
| **500** | Database insert failed | "Something went wrong on our end, and your details weren't saved. Please try again." |
| **503** | Supabase not configured | "Signups are temporarily unavailable, and your details weren't saved…" with the contact email |
| No response | Network failure | "We couldn't reach our server, so your details weren't saved…" |

The site never shows the success screen unless the signup was stored (or
deliberately dropped as spam/duplicate).

## Files

| File | Role |
| --- | --- |
| `components/waitlist/waitlist-sheet.tsx` | The full page: layout, motion, open/close, `#join`, focus, keeps the draft |
| `components/waitlist/waitlist-form.tsx` | The questions, browser validation, submit, success screen |
| `components/waitlist/waitlist-cta.tsx` | The pill button that opens the page |
| `components/ui/sheet.tsx` | Dialog primitive (shadcn/Radix) the page is built on |
| `lib/waitlist/perks.ts` | The four perks, shared with the "Help shape ResAI" section |
| `lib/waitlist/schema.ts` | Validation rules and option lists, shared by browser and server |
| `app/api/waitlist/route.ts` | The API endpoint |
