# Waitlist data

Everything the site collects, where it's stored, and how to use it. All of it
lives in Supabase (Postgres) in the `public` schema.

## What visitors are asked

The [join page](waitlist.md) asks these questions. Each answer goes into a
column on `waitlist_leads`.

| Question | Required | Column | Rules and stored format |
| --- | --- | --- | --- |
| Restaurant or company name | Yes | `business_name` | 2–120 characters, trimmed. Links are rejected (spam). |
| Email | Yes | `email` | Trimmed and lowercased, up to 254 characters. One row per email (unique). |
| Phone | Yes | `phone` | US numbers only, any common format ("(415) 555-0134", "415.555.0134", "+1 415 555 0134"). Stored as E.164: `+14155550134`. |
| Website | No | `website` | Up to 200 characters. `https://` is added if missing and a bare trailing slash is dropped, so "CornerSlice.com/" is stored as `https://cornerslice.com`. Social profiles like `instagram.com/cornerslice` are fine. |
| How many locations? | No | `location_count` | One of `1`, `2-5`, `6-10`, `11+`. |
| What's not working with your POS? | No | `pos_problems` | A list (`text[]`) of the ids below. Empty list if none picked. |
| Anything else? | No | `pos_frustration` | Free text, up to 1,000 characters. |

### POS problem ids

| Id | What the visitor sees |
| --- | --- |
| `menu_updates` | Menu and price changes take too long |
| `hardware` | Printers or hardware keep failing |
| `reports` | Sales reports are hard to understand |
| `support` | Support is slow or unhelpful |
| `fees` | Fees are too high |
| `integrations` | Doesn't work with my other tools |
| `training` | Hard to train new staff |

The list lives in `lib/waitlist/schema.ts` (`posProblems`), and the database
only accepts these ids.

## Filled in automatically

| Column | What it holds |
| --- | --- |
| `id` | Random UUID |
| `created_at` | When they signed up |
| `source` | Always `landing_page` for now |
| `utm_source`, `utm_medium`, `utm_campaign` | Copied from the page URL (`?utm_source=…`) if present, up to 100 characters each |
| `privacy_notice_version` | Which privacy policy they saw. Currently `2026-11-19` (`PRIVACY_NOTICE_VERSION` in `lib/site.ts`) |
| `contact_opt_out`, `opted_out_at` | Set when they opt out (see below) |

### Retired columns

`contact_name`, `restaurant_type`, `current_pos` and `research_consent` were
asked by the first version of the form. Since 2026-11-19 they're no longer
asked, but the columns stay so older rows keep their answers. New rows leave
them empty (`research_consent` defaults to `false`).

## What we don't store

- **No raw IP addresses.** For rate limiting, the IP and the email are turned
  into salted one-way hashes, kept in `rate_limit_events`, and deleted after
  about a day.
- **No cookies, analytics or third-party tracking.**

## Other tables and functions

| Name | Purpose |
| --- | --- |
| `outreach_opt_outs` | Emails that asked not to be contacted (`email`, `created_at`). Kept separately so an opt-out is remembered even if the lead is deleted. |
| `rate_limit_events` | Hashed rate-limit keys only (`bucket`, `created_at`). |
| `consume_rate_limit(bucket, limit, window_seconds)` | Records a hit and says whether it's within the limit. Also prunes rows older than a day. |
| `record_outreach_opt_out(email)` | Adds the email to `outreach_opt_outs` and flags the matching lead. |

**Security model:** row-level security is on for every table with no
policies, and all access is revoked from the public `anon` and
`authenticated` roles. Only the Next.js server, using the secret key, can
read or write. The functions run as the caller and only `service_role` can
execute them. The full SQL is in `supabase/migrations/`.

## Duplicates

Submitting the same email again stores nothing new and shows the **same**
success message, so the form can't be used to check who's on the list. The
first signup wins: later answers from the same email are **not** merged in.

## Reading and exporting leads

Use **Table Editor → `waitlist_leads`** to browse, or the **SQL Editor** for
the queries below. To export, run a query and use **Download CSV**, or use
the Table Editor's export.

**Everyone you may contact** (always exclude opt-outs before outreach):

```sql
select l.*
from public.waitlist_leads l
where not l.contact_opt_out
  and not exists (select 1 from public.outreach_opt_outs o where o.email = l.email)
order by l.created_at desc;
```

**Most common POS problems:**

```sql
select problem, count(*) as owners
from public.waitlist_leads, unnest(pos_problems) as problem
group by problem
order by owners desc;
```

**Signups by number of locations:**

```sql
select coalesce(location_count, 'not answered') as locations, count(*)
from public.waitlist_leads
group by 1
order by 2 desc;
```

**Signups per day:**

```sql
select date_trunc('day', created_at)::date as day, count(*)
from public.waitlist_leads
group by 1
order by 1 desc;
```

**Where signups came from (UTM):**

```sql
select coalesce(utm_source, '(direct)') as source, coalesce(utm_campaign, '') as campaign, count(*)
from public.waitlist_leads
group by 1, 2
order by 3 desc;
```

## Opt-outs and deletion requests

- **Opt-out:** visitors use `/opt-out` (linked in the footer, the success
  message and the privacy policy). It adds their email to `outreach_opt_outs`,
  sets `contact_opt_out = true` and `research_consent = false` on their lead,
  and stamps `opted_out_at`. Treat it as covering **all** outreach, including
  phone.
- **Deletion request** (by email): delete the lead, and keep the opt-out so
  they aren't contacted if they're re-added somehow:

  ```sql
  delete from public.waitlist_leads where email = lower('person@example.com');
  insert into public.outreach_opt_outs (email) values (lower('person@example.com'))
    on conflict (email) do nothing;
  ```

## Changing the questions

Questions, rules and stored formats have to stay in sync in four places:

1. `lib/waitlist/schema.ts`: option lists, limits and validation (shared by
   the form and the API).
2. `components/waitlist/waitlist-form.tsx`: the fields on the page.
3. A **new** migration in `supabase/migrations/` with matching CHECK
   constraints. Don't edit migrations that have already been run.
4. `app/privacy/page.tsx` ("What we collect"). Then bump
   `PRIVACY_NOTICE_VERSION` and `PRIVACY_UPDATED_DATE` in `lib/site.ts`.

Then update this doc and the tests in `tests/schema.test.ts`.
