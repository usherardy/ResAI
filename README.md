# ResAI: landing page and early-access waitlist

Marketing site for ResAI, an AI assistant for independent US restaurants,
cafés, and bars. It has an interactive concept demo and a working waitlist
backed by Supabase.

ResAI is pre-launch, and the site says so plainly: the demo is labeled
"Concept preview" and "Example data", nothing claims customers or live
payments, and the waitlist never shows success unless the signup was stored.

## Quick start

Requires **Node.js 22.12+**.

```bash
npm install
cp .env.example .env.local   # fill in the values (see docs/setup.md)
npm run dev                  # http://localhost:3000
npm test                     # 98 tests
```

## Docs

Everything else lives in [`docs/`](docs/README.md):

- [Setup](docs/setup.md): environment variables, connecting Supabase, deploying, troubleshooting
- [Waitlist data](docs/data.md): every field we collect, how it's stored, queries to read and export leads
- [Join flow](docs/waitlist.md): the full-page "Join the waitlist" form, its motion, API responses
- [Architecture](docs/architecture.md): code layout, request path, spam protection, tests
- [Design](docs/design.md): colors, type, gradient, motion, components, accessibility
- [Launch checklist](docs/launch-checklist.md): what's left and the open decisions

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn/ui,
Supabase (Postgres), zod, Vitest.
