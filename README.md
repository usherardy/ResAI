# ResAI: landing page and early-access waitlist

Marketing site for ResAI, an AI assistant for independent US
restaurants, cafés, and bars. The site has an interactive concept demo and a
working waitlist backed by Supabase.

ResAI is pre-launch. The site says so plainly. The demo is labeled
"Concept preview" and "Example data", nothing claims customers or live
payments, and the waitlist never shows a success message unless the signup
was actually stored.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components), React 19, TypeScript
- Tailwind CSS v4 and shadcn/ui (Radix primitives)
- Supabase (Postgres) via a server-only service-role client
- zod for validation shared by the client and the server
- Vitest and Testing Library

## Project structure

```
app/
  layout.tsx              Fonts, global metadata, header/footer
  page.tsx                Landing page + JSON-LD (Organization, WebSite, FAQPage)
  api/waitlist/route.ts   POST: waitlist signup
  api/opt-out/route.ts    POST: outreach opt-out
  privacy/ terms/ opt-out/  Legal and opt-out pages
  opengraph-image.tsx     Generated 1200×630 OG image
  sitemap.ts robots.ts icon.svg not-found.tsx
components/
  demo/                   Interactive concept demo
    agent-demo.tsx          Window, prompt picker, conversation, composer
    use-demo-player.ts      Typing/steps timeline + reduced-motion handling
    scenarios.ts            The six scripted scenarios (all example data)
    match-prompt.ts         Routes typed text to a scenario, or admits it can't
    cards/                  One result card per scenario
  sections/               Hero + showcase strip, statement, how it works, features
                          (live demo + feature cards), vision, founder, waitlist,
                          FAQ, closing CTA
  site/                   Header, footer, logo, layout helpers
  waitlist/               Full-page waitlist (slides in from the right) + form,
                          the pill that opens it, opt-out form (client)
  ui/                     shadcn/ui primitives, a styled native <select>, and
                          Magic UI effects (marquee in use; shimmer button, shiny
                          text, border beam, shine border, spotlight card available)
lib/
  site.ts                 Site name, URL, contact email, privacy-notice version
  faq.ts                  FAQ copy (page + structured data)
  waitlist/schema.ts      zod schema + option lists (shared client/server)
  waitlist/service.ts     Core signup/opt-out logic (framework-free, tested)
  waitlist/repository.ts  Supabase insert/RPC calls (server-only)
  waitlist/deps.ts        Wires Supabase + rate limiters (server-only)
  waitlist/handle-post.ts Shared route guards (origin, content type, size)
  security/               IP extraction, hashing, origin check, rate limiters
  supabase/admin.ts       Service-role client (server-only)
supabase/migrations/      SQL: tables, RLS, functions, grants
tests/                    Vitest suites
```

## Getting started

Requires **Node.js 22.12+** (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command             | What it does                              |
| ------------------- | ----------------------------------------- |
| `npm run build`     | Production build                          |
| `npm start`         | Serve the production build                |
| `npm run lint`      | ESLint (flat config)                      |
| `npm run typecheck` | Generate route types, then `tsc --noEmit` |
| `npm test`          | Run the Vitest suites once                |

## Environment variables

| Variable                    | Where it's used | Notes |
| --------------------------- | --------------- | ----- |
| `NEXT_PUBLIC_SITE_URL`      | Browser + server | Canonical URL for metadata, OG, sitemap, robots, and the same-origin check. Set it to the production domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Browser + server | Shown in the footer, FAQ, legal pages, and error messages. Defaults to the placeholder `hello@resai.example`. |
| `SUPABASE_URL`              | **Server only** | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Service-role key or a new `sb_secret_…` key. Bypasses RLS, so it must never get a `NEXT_PUBLIC_` prefix. |
| `RATE_LIMIT_SALT`           | **Server only** | Random secret for hashing IPs/emails in rate-limit keys. `openssl rand -hex 32`. |

If the Supabase variables are missing, `POST /api/waitlist` returns **503**
and the form tells the visitor their details weren't saved. The site works
without them, but it doesn't collect signups.

## Database setup (Supabase)

There are two migrations. Apply them in order:

1. `supabase/migrations/20261118000000_waitlist.sql`: tables, RLS, functions, grants.
2. `supabase/migrations/20261119000000_waitlist_contact_fields.sql`: adds
   `phone`, `website` and `pos_problems` to `waitlist_leads` for the
   slide-in form.

Together they create:

- `waitlist_leads`: one row per email (unique, stored lowercase), with
  CHECK constraints that mirror the zod schema, plus the privacy-notice
  version and UTM tags. Phone is stored as `+1XXXXXXXXXX`, website with a
  scheme, and POS problems as a `text[]` of the ids in
  `lib/waitlist/schema.ts`. `contact_name`, `restaurant_type`, `current_pos`
  and `research_consent` are no longer asked for; they stay for older rows.
- `outreach_opt_outs`: emails that asked not to be contacted.
- `rate_limit_events`: hashed rate-limit keys only.
- `consume_rate_limit(bucket, limit, window_seconds)` and
  `record_outreach_opt_out(email)`: `security invoker`, pinned
  `search_path`, executable **only** by `service_role`.

**RLS is enabled on every table with no policies**, and all privileges are
revoked from `anon` and `authenticated`. The public anon key can't read or
write anything, even if it leaks. Only the Next.js server (service role)
touches these tables.

Apply it in either of two ways:

```bash
# Option A: Supabase CLI
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push

# Option B: paste each SQL file, in order, into Dashboard → SQL Editor → Run
```

Both migrations are safe to re-run.

Optional nightly cleanup of old rate-limit rows (enable the `pg_cron`
extension first). The rate-limit function already prunes on each call, so
this only matters if traffic is very low:

```sql
select cron.schedule(
  'prune-rate-limit-events', '17 3 * * *',
  $$delete from public.rate_limit_events where created_at < now() - interval '1 day'$$
);
```

### Reading leads

Use the Supabase dashboard (Table Editor) or SQL. Before any outreach,
exclude opt-outs:

```sql
select l.*
from public.waitlist_leads l
where not l.contact_opt_out
  and not exists (select 1 from public.outreach_opt_outs o where o.email = l.email)
order by l.created_at desc;
```

## How the waitlist is protected

1. **Same-origin check.** Cross-site browser POSTs get a 403.
2. **JSON only, 10 KB max.** Anything else gets a 415 or 413.
3. **Honeypot field and minimum fill time (2s).** Likely bots get a normal-looking
   200, and nothing is stored, so they learn nothing.
4. **Server-side zod validation.** Errors come back as a 400 with per-field messages.
   Links are rejected in name fields.
5. **Rate limits.** 5 signups per IP per 10 minutes and 3 per email per hour.
   An in-memory limiter runs first, then a Postgres limiter that holds across
   serverless instances. Keys are salted SHA-256 hashes, and if the limiter
   errors the request is allowed through (logged) rather than blocking real owners.
6. **Duplicates.** The unique index blocks them. A duplicate gets the *same*
   response as a new signup, so the form can't be used to check whether
   someone is on the list.

## Tests

`npm test` runs 98 tests:

- `schema.test.ts`: normalization, required fields, US phone formats,
  website normalization, POS problem chips, limits, enums, link spam.
- `service.test.ts`: success, duplicate, validation, honeypot, timing,
  not-configured (503), rate-limited (429), insert failure (500), hashed keys,
  opt-out.
- `route.test.ts`: the real route handlers. 503 without credentials, 400, 415,
  malformed JSON, 413, cross-origin 403, forwarded IP, opt-out.
- `security.test.ts`: IP parsing, hashing, origin checks, memory limiter,
  fail-open chaining.
- `demo-logic.test.ts`: prompt routing and price math.
- `waitlist-form.test.tsx`: client validation and focus, phone errors, the
  full payload (chips, locations, website), toggling chips and locations,
  loading, success, 400/429/503 handling, network failure.
- `agent-demo.test.tsx`: labeling, autoplay, scenario selection, approval
  copy, rounding toggle, free-text fallback.
- `waitlist-cta.test.tsx`: the pill opens the full-page form, focus moves in
  and returns on Escape, the draft survives close and reopen, and `#join`
  opens it.
- `showcase.test.tsx`: the scrolling tiles are inert and hidden from screen
  readers, and the pause control works.

## Before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` to real values.
- [ ] Create the Supabase project, apply both migrations, and set server env vars.
- [ ] Submit a real signup in production and confirm the row in Supabase.
- [ ] Have counsel review `/privacy` and `/terms` (add entity name and governing law).
- [ ] Optionally add the founder's name to `components/sections/founder.tsx`.
- [ ] Make sure every outreach email has an unsubscribe link (the Privacy Policy promises it).

## Accessibility and performance notes

- Semantic landmarks, a skip link, labeled form fields with `aria-describedby`
  errors, focus moves to the first invalid field and to the success heading,
  and live regions for form status.
- The demo plays one run when it scrolls into view (no loop). With
  `prefers-reduced-motion`, it skips typing and shows results immediately.
  All CSS animation is disabled under reduced motion.
- Design: Inter throughout on a warm off-white canvas, a left-aligned hero
  with a scrolling strip of example tiles, softly tinted rounded cards, the
  sunset gradient on the closing section, and a black footer.
- The showcase strip has a visible pause button and pauses on hover. Under
  reduced motion it becomes a single static row you can scroll sideways.
- Visual effects in `components/ui/` are adapted from [Magic UI](https://magicui.design)
  (MIT). They were rewritten to use CSS animation only, so the site has no
  animation library dependency.
- Every page is statically prerendered. Client JavaScript is limited to the
  header menu, demo, forms, and FAQ accordion. No images, no analytics, no
  third-party scripts.
