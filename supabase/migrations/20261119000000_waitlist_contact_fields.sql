-- ResAI waitlist: phone, website and POS problems
--
-- Adds the fields asked in the slide-in "Join the waitlist" panel. Additive
-- and safe to re-run. Apply after 20261118000000_waitlist.sql.
--
-- `phone` is nullable here only because earlier rows don't have one. The API
-- requires it for every new signup and stores it as E.164 (+1XXXXXXXXXX).
--
-- The form no longer asks for contact_name, restaurant_type, current_pos or
-- research_consent. Those columns stay so existing rows keep their data.
--
-- Keep the CHECK constraints in sync with lib/waitlist/schema.ts.

alter table public.waitlist_leads
  add column if not exists phone text
    constraint waitlist_leads_phone_format
      check (phone is null or phone ~ '^\+1[2-9][0-9]{9}$'),
  add column if not exists website text
    constraint waitlist_leads_website_format
      check (
        website is null
        or (char_length(website) <= 200 and website ~* '^https?://')
      ),
  add column if not exists pos_problems text[] not null default '{}'
    constraint waitlist_leads_pos_problems_allowed
      check (
        cardinality(pos_problems) <= 7
        and pos_problems <@ array[
          'menu_updates', 'hardware', 'reports', 'support',
          'fees', 'integrations', 'training'
        ]::text[]
      );

comment on column public.waitlist_leads.phone is
  'US phone number in E.164 (+1XXXXXXXXXX). Required by the API for new signups.';
comment on column public.waitlist_leads.pos_problems is
  'POS problems picked in the form. Values match posProblems in lib/waitlist/schema.ts.';
