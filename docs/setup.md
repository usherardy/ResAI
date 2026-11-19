# Setup

## Run it locally

Requires **Node.js 22.12+** (see `.nvmrc`).

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000 (add -- -p 3100 for another port)
```

| Command             | What it does                                         |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Dev server. Picks up code changes as you save        |
| `npm run build`     | Production build                                     |
| `npm start`         | Serves the last production build                     |
| `npm run lint`      | ESLint                                               |
| `npm run typecheck` | Generates route types, then `tsc --noEmit`           |
| `npm test`          | Runs the Vitest suites once                          |

> `npm start` serves whatever was built last. If changes don't show up, you're
> probably on an old build: use `npm run dev`, or run `npm run build` again.

## Environment variables

Put these in `.env.local` (never commit it). `.env.example` lists them all.

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Browser + server | Canonical URL for metadata, Open Graph, sitemap and robots. Set it to the production domain. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Browser + server | Shown in the footer, FAQ, legal pages and error messages. Defaults to the placeholder `hello@resai.example`. |
| `SUPABASE_URL` | **Server only** | Supabase → Project Settings → API → Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server only** | Supabase → Project Settings → API Keys → the **secret** key (`sb_secret_…`) or the legacy `service_role` key. It bypasses database security, so never give it a `NEXT_PUBLIC_` prefix. |
| `RATE_LIMIT_SALT` | **Server only** | Random secret for hashing IPs and emails in rate-limit keys. Generate with `openssl rand -hex 32`. If missing, a built-in fallback is used and a warning is logged. |

`NEXT_PUBLIC_*` values are built into the page, so changing them needs a
rebuild. Server-only values need a restart.

## Connect Supabase

Without Supabase the site works, but `POST /api/waitlist` returns **503** and
the form tells visitors their details weren't saved.

1. **Create a project** at supabase.com. Pick a US region near your hosting.
   Leave the **Data API** on (the default); the server talks to the tables
   through it. You don't need Auth, Storage, the anon key or any policies.
2. **Run both migrations, in order.** Dashboard → **SQL Editor** → paste the
   file → **Run**:
   1. `supabase/migrations/20261118000000_waitlist.sql`
   2. `supabase/migrations/20261119000000_waitlist_contact_fields.sql`

   Both are safe to run again. Or with the CLI:

   ```bash
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```
3. **Add the three server variables** (`SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_SALT`) to `.env.local` and restart.
4. **Test it.** Submit the form, check **Table Editor → `waitlist_leads`** for
   the row, then delete the test row.

What the migrations create is described in [Waitlist data](data.md).

### Optional: nightly cleanup

The rate-limit function already prunes old rows on every call, so this only
matters with very little traffic. Enable the `pg_cron` extension first:

```sql
select cron.schedule(
  'prune-rate-limit-events', '17 3 * * *',
  $$delete from public.rate_limit_events where created_at < now() - interval '1 day'$$
);
```

## Deploy

On your host (e.g. Vercel), set all five environment variables:
`NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` with real values, plus
the three server-only ones. Apply both migrations to the production database
**before** deploying the code, then submit one real signup and confirm the row.

## Troubleshooting

| You see | Likely cause |
| --- | --- |
| Form says "Signups are temporarily unavailable" (503) | `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` missing, or the server wasn't restarted after adding them |
| Form says "Something went wrong on our end" (500), logs mention a missing column | The second migration (`…_waitlist_contact_fields.sql`) hasn't been run |
| "Too many attempts" (429) while testing | Rate limit: 5 signups per IP per 10 minutes, 3 per email per hour. Wait, or use another email |
| Changes don't appear in the browser | You're on `npm start` with an old build. Use `npm run dev` |
