-- ResAI early-access waitlist
--
-- Security model:
--   * Only the Next.js server talks to these tables, using the service-role
--     (or sb_secret_…) key. That role bypasses RLS.
--   * RLS is enabled on every table with NO policies, and privileges are
--     revoked from `anon` and `authenticated`. The public anon key can't
--     read or write anything here, even if someone extracts it.
--   * Functions run as the caller (security invoker), pin search_path, and
--     are executable only by `service_role`.
--
-- Keep the CHECK constraints in sync with lib/waitlist/schema.ts.

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.waitlist_leads (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),

  email                   text not null
    constraint waitlist_leads_email_format
      check (
        char_length(email) <= 254
        and email = lower(btrim(email))
        and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
      ),
  business_name           text not null
    constraint waitlist_leads_business_name_length
      check (char_length(btrim(business_name)) between 2 and 120),

  contact_name            text
    check (contact_name is null or char_length(contact_name) <= 100),
  restaurant_type         text
    check (restaurant_type is null or restaurant_type in (
      'full_service', 'quick_service', 'cafe', 'bar', 'food_truck', 'bakery', 'other'
    )),
  current_pos             text
    check (current_pos is null or current_pos in (
      'toast', 'square', 'clover', 'revel', 'spoton', 'other'
    )),
  location_count          text
    check (location_count is null or location_count in ('1', '2-5', '6-10', '11+')),
  pos_frustration         text
    check (pos_frustration is null or char_length(pos_frustration) <= 1000),

  research_consent        boolean not null default false,
  contact_opt_out         boolean not null default false,
  opted_out_at            timestamptz,

  source                  text not null default 'landing_page'
    check (char_length(source) <= 50),
  utm_source              text check (utm_source is null or char_length(utm_source) <= 100),
  utm_medium              text check (utm_medium is null or char_length(utm_medium) <= 100),
  utm_campaign            text check (utm_campaign is null or char_length(utm_campaign) <= 100),
  privacy_notice_version  text not null check (char_length(privacy_notice_version) <= 20)
);

comment on table public.waitlist_leads is
  'Early-access waitlist signups. Server-only (service role); RLS on, no policies.';

-- One row per email. Emails are stored lowercase (enforced by the CHECK above).
create unique index if not exists waitlist_leads_email_key
  on public.waitlist_leads (email);

create index if not exists waitlist_leads_created_at_idx
  on public.waitlist_leads (created_at desc);

alter table public.waitlist_leads enable row level security;
revoke all on table public.waitlist_leads from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Outreach opt-outs (kept separately so an opt-out is remembered even for
-- emails that aren't, or are no longer, on the waitlist)
-- ---------------------------------------------------------------------------
create table if not exists public.outreach_opt_outs (
  email       text primary key
    check (char_length(email) <= 254 and email = lower(btrim(email))),
  created_at  timestamptz not null default now()
);

comment on table public.outreach_opt_outs is
  'Emails that asked not to be contacted. Check this before any outreach.';

alter table public.outreach_opt_outs enable row level security;
revoke all on table public.outreach_opt_outs from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Rate limiting (hashed keys only. No raw IPs or emails are stored here.)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limit_events (
  id          bigint generated always as identity primary key,
  bucket      text not null check (char_length(bucket) <= 200),
  created_at  timestamptz not null default now()
);

create index if not exists rate_limit_events_bucket_created_idx
  on public.rate_limit_events (bucket, created_at desc);
create index if not exists rate_limit_events_created_idx
  on public.rate_limit_events (created_at);

alter table public.rate_limit_events enable row level security;
revoke all on table public.rate_limit_events from anon, authenticated;

-- Records a hit for p_bucket and returns true if it's within p_limit hits
-- per p_window_seconds. Also prunes events older than a day.
create or replace function public.consume_rate_limit(
  p_bucket text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_count integer;
begin
  if p_bucket is null or p_limit < 1 or p_window_seconds < 1 then
    raise exception 'invalid rate limit arguments';
  end if;

  delete from public.rate_limit_events
  where created_at < now() - interval '1 day';

  select count(*) into v_count
  from public.rate_limit_events
  where bucket = p_bucket
    and created_at > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_limit then
    return false;
  end if;

  insert into public.rate_limit_events (bucket) values (p_bucket);
  return true;
end;
$$;

-- Records an opt-out and flags any matching lead.
create or replace function public.record_outreach_opt_out(p_email text)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_email text := lower(btrim(p_email));
begin
  if v_email is null or v_email = '' then
    raise exception 'email is required';
  end if;

  insert into public.outreach_opt_outs (email)
  values (v_email)
  on conflict (email) do nothing;

  update public.waitlist_leads
  set contact_opt_out = true,
      research_consent = false,
      opted_out_at = coalesce(opted_out_at, now())
  where email = v_email;
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
revoke all on function public.record_outreach_opt_out(text) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;
grant execute on function public.record_outreach_opt_out(text) to service_role;

-- Explicit grants for the server role. Supabase normally grants these by
-- default, but stating them keeps the migration self-contained.
grant select, insert, update, delete on table public.waitlist_leads to service_role;
grant select, insert, delete on table public.outreach_opt_outs to service_role;
grant select, insert, delete on table public.rate_limit_events to service_role;
