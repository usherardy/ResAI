# ResAI

**An AI agent for independent restaurants, cafés, bars, bakeries, and food
trucks.** Instead of digging through POS settings, calling support, or
learning another back-office dashboard, an owner types what they need in plain
words and ResAI does the work. Nothing changes without the owner's OK.

This repository holds ResAI's public website: the landing page, a concept
demo, and the early-access waitlist.

## The problem

Running a small restaurant means running its technology too. Adding a lunch
special, raising burger prices, or finding out why the kitchen printer stopped
can mean a dozen clicks across settings screens, a support ticket, or time on
hold. That usually happens mid-rush or late at night. Most independent owners
don't have an IT person.

ResAI started from the founder's years in restaurant POS technical support,
and one question: what if managing restaurant technology were as easy as
having a conversation?

## How it works

1. **Ask.** Type a request the way you'd tell a manager: "Add a lunch special:
   soup and half sandwich, $12, weekdays 11 to 2."
2. **Review.** ResAI drafts the change and shows exactly what it understood:
   the item, the price, the days and times.
3. **Approve.** One tap and it goes live. Nothing changes without your OK.

The same agent covers:

- **Menus and prices:** items, sizes, add-ons, price changes.
- **Sales questions:** best sellers, slow hours, today versus last week.
- **Fixes:** a printer or card reader acting up, walked through step by step.
- **Setup:** how orders, tabs, and tickets work.

## Where it stands

ResAI is **pre-launch**, and the site says so plainly:

- The demo on the site is a **concept preview with scripted, example data**. It
  isn't connected to a real restaurant.
- There are **no POS integrations yet**. Owners on the waitlist help decide
  which systems come first.
- ResAI **doesn't process payments**. Next on the roadmap is a phone and
  tablet POS (Tap to Pay on supported devices, handled by certified payment
  providers). The site labels it "planned".
- Nothing on the site claims customers, logos, or numbers that don't exist.
  The waitlist only shows success once a signup is actually saved.

## What's in this repo

The marketing site, live on Vercel from the `main` branch:

- **Home page.** It opens with "Run, fix, and grow your restaurant with
  agents." The business word rotates through café, bar, bakery and food truck.
  Then, in order:
  - four example requests played like short videos
  - an animated Ask → Review → Approve walkthrough
  - a tabbed "One assistant for the whole back office" demo
  - the founder's story
  - the Vision section
  - the FAQ
- **The join page.** "Join the waitlist" opens a full-page form. It asks for
  the business name, email, phone, website, number of locations, and the POS
  problems that slow you down. Signups are stored in Supabase.
- **Opt-out, privacy, and terms pages.**

## Quick start

Requires **Node.js 22.12+**.

```bash
npm install
cp .env.example .env.local   # fill in the values (see docs/setup.md)
npm run dev                  # http://localhost:3000
npm test                     # run the test suite
```

Without Supabase credentials the site runs normally, but the form says
signups are temporarily unavailable and saves nothing.

## Docs

Everything else lives in [`docs/`](docs/README.md):

- [Setup](docs/setup.md): environment variables, connecting Supabase, deploying, troubleshooting
- [Waitlist data](docs/data.md): every field we collect, how it's stored, queries to read and export leads
- [Join flow](docs/waitlist.md): the full-page "Join the waitlist" form, its motion, API responses
- [Architecture](docs/architecture.md): code layout, request path, spam protection, tests
- [Design](docs/design.md): colors, type, motion, components, accessibility
- [Launch checklist](docs/launch-checklist.md): what's left and the open decisions
- [Recommendations](docs/recommendations.md): what to improve next on the landing page

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui,
Supabase (Postgres), zod, and Vitest. It's hosted on Vercel, with the database
in Supabase's US East region.
