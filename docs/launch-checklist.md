# Launch checklist

## Before launch

- [ ] Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` to real values
      (the contact email is still the placeholder `hello@resai.example`).
- [ ] Create the Supabase project, run **both** migrations in order, and set
      the three server variables. See [Setup](setup.md#connect-supabase).
- [ ] Submit a real signup in production and confirm the row (with `phone`,
      `website` and `pos_problems`) in Supabase.
- [ ] Have counsel review `/privacy` and `/terms` (add the entity name and
      governing law).
- [ ] Make sure every outreach email has an unsubscribe link (the privacy
      policy promises it).
- [ ] Optionally add the founder's name to `components/sections/founder.tsx`.

## Open decisions

- **Texting leads.** Phone is required, which is fine for calls. To send
  texts, US rules (TCPA) require explicit consent first: add a consent
  checkbox to the form before texting anyone. The privacy policy already
  says no marketing texts without separate agreement.
- **Which POS they use.** The form no longer asks, so you'll see their
  problems but not their system. One optional dropdown would bring it back
  (the old option list is in git history).
- **"How many locations?" is optional.** Making it required is a small change:
  the rule in `lib/waitlist/schema.ts` and the "Optional" label in
  `components/waitlist/waitlist-form.tsx`.
- **Duplicate signups don't update.** If someone joins again with new
  answers, the first answers are kept. Changing that means an upsert in
  `lib/waitlist/repository.ts`.

## Known follow-ups

- The opt-out page (`app/opt-out/page.tsx`) is titled "Opt out of emails" and
  mentions "research calls". Now that phone numbers are collected, it should
  say it stops all contact, including calls.
