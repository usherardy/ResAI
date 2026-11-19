# Architecture

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript
- Tailwind CSS v4 and shadcn/ui (Radix primitives); `tw-animate-css` for
  enter/exit animation
- Supabase (Postgres) via a server-only secret-key client
- zod for validation shared by the browser and the server
- Vitest and Testing Library

This Next.js version has breaking changes from older releases. Check the
guides in `node_modules/next/dist/docs/` before writing Next-specific code
(see `AGENTS.md`).

## Project structure

```
app/
  layout.tsx              Fonts, metadata, skip link (each area brings its own chrome)
  (site)/                 Public site: layout (header, footer, waitlist page),
                          page.tsx (landing page sections + JSON-LD), privacy/,
                          terms/, opt-out/, v2/ (landing page B, noindex)
  api/waitlist/route.ts   POST: waitlist signup
  api/opt-out/route.ts    POST: outreach opt-out
  opengraph-image.tsx     Generated 1200×630 OG image
  sitemap.ts robots.ts icon.svg not-found.tsx
components/
  demo/                   Concept demo pieces (scenarios and cards feed the home
                          page's assistant tabs)
    agent-demo.tsx          Free-typing chat demo (not on the page right now)
    use-demo-player.ts      Typing/steps timeline + reduced-motion handling
    scenarios.ts            The six scripted scenarios (all example data)
    match-prompt.ts         Routes typed text to a scenario, or admits it can't
    cards/                  One result card per scenario
  sections/               Hero (+ rotating-business word), features ("one sentence" boxes, played by
                          feature-video), how it works, demo (assistant tabs +
                          join prompt), founder, vision, waitlist, FAQ, closing CTA
  site/                   Header, footer, site chrome, logo, layout helpers
  waitlist/               Join page, form, the pill that opens it, opt-out form
  ui/                     shadcn/ui primitives (incl. sheet), a styled native <select>,
                          Magic UI effects, and the phone swipe row
lib/
  site.ts                 Site name, URL, contact email, privacy-notice version and date
  faq.ts                  FAQ copy (page + structured data)
  fonts.ts                Instrument Serif italic accent font
  waitlist/schema.ts      zod schema + option lists (shared browser/server)
  waitlist/perks.ts       The four "why join" perks
  waitlist/service.ts     Core signup/opt-out logic (framework-free, tested)
  waitlist/repository.ts  Supabase insert/RPC calls (server-only)
  waitlist/deps.ts        Wires Supabase + rate limiters (server-only)
  waitlist/handle-post.ts Shared route guards (origin, content type, size)
  security/               IP extraction, hashing, origin check, rate limiters
  supabase/admin.ts       Secret-key client (server-only)
supabase/migrations/      SQL: tables, RLS, functions, grants
tests/                    Vitest suites
docs/                     You are here
```

Page order (`app/(site)/page.tsx`): Hero → Features ("One sentence instead of a dozen
clicks" boxes) → How it works → Demo ("One assistant for the whole back office" tabs,
then a join prompt) → Founder → Vision → Waitlist → FAQ → Closing CTA.

## Request path for a signup

```
WaitlistForm (browser)
  └─ validates with waitlistSchema, POST /api/waitlist (JSON)
app/api/waitlist/route.ts
  └─ handleJsonPost: same-origin check, JSON + 10 KB limit, client IP
lib/waitlist/service.ts  submitWaitlist()
  ├─ spam signals (honeypot, fill time) → fake success, store nothing
  ├─ waitlistSchema validation → 400 with field errors
  ├─ no Supabase configured → 503
  ├─ rate limits (hashed IP + hashed email) → 429
  └─ repository.insertLead() → 200 (duplicates also 200), failure → 500
lib/waitlist/repository.ts
  └─ supabase.from("waitlist_leads").insert(...)
```

`service.ts` has no Next.js or Supabase imports, so it's tested with plain
objects. The secret-key client imports `server-only`, so the build fails if
it ever ends up in browser code.

## Spam and abuse protection

1. **Same-origin check.** Cross-site browser POSTs get a 403.
2. **JSON only, 10 KB max.** Anything else gets a 415 or 413.
3. **Honeypot field and minimum fill time (2s).** The form has a hidden field
   (sent as `honeypot`) that people never see. If it's filled, or the form was
   submitted in under 2 seconds, the server returns a normal-looking 200 and
   stores nothing, so bots learn nothing.
4. **Server-side validation** with the same zod schema as the browser. Links
   are rejected in the business name.
5. **Rate limits.** 5 signups per IP per 10 minutes and 3 per email per hour.
   An in-memory limiter runs first, then a Postgres limiter that holds across
   serverless instances. Keys are salted SHA-256 hashes. If the limiter
   itself errors, the request is let through (and logged) rather than
   blocking real owners.
6. **Duplicates.** The unique email index blocks them, and a duplicate gets
   the same response as a new signup, so the form can't reveal who's on the
   list.
7. **Database lockdown.** RLS on, no policies, public roles revoked. See
   [Waitlist data](data.md#other-tables-and-functions).

Opt-outs (`/api/opt-out`) use the same guards, a honeypot, and 10 requests per
IP per 10 minutes.

## Tests

`npm test` runs 110 tests:

| Suite | Covers |
| --- | --- |
| `schema.test.ts` | Normalization, required fields, US phone formats, website normalization, POS problem chips, limits, option lists, link spam |
| `service.test.ts` | Success, duplicate, validation, honeypot, real website not mistaken for spam, timing, not configured (503), rate limited (429), insert failure (500), hashed keys, opt-out |
| `route.test.ts` | The real route handlers: 503 without credentials, 400, 415, malformed JSON, 413, cross-origin 403, forwarded IP, opt-out |
| `security.test.ts` | IP parsing, hashing, origin checks, memory limiter, fail-open chaining |
| `waitlist-form.test.tsx` | Browser validation and focus, phone errors, full payload (chips, locations, website), toggling, loading, success, 400/429/503, network failure |
| `waitlist-cta.test.tsx` | The pill opens the page, focus moves in and returns on Escape, the draft survives close and reopen, `#join` opens it |
| `demo-logic.test.ts` | Prompt routing and price math |
| `agent-demo.test.tsx` | Labeling, autoplay, scenario selection, approval copy, rounding toggle, free-text fallback |
| `home-sections.test.tsx` | Hero headline and tiles, the rotating business word (keeps cycling, matching icons, pauses on a hidden tab, reduced motion), the phone swipe row's dots, the "one sentence" boxes, the How it works steps, a feature box playing through typing → working → result → Replay, the assistant tabs playing and switching |
| `v2.test.tsx` | Landing page B: the before/after demo, task tabs, the floating join card |
