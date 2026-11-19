# ResAI docs

Everything about the ResAI landing page and early-access waitlist: how to run
it, what data it collects, how the signup works, and what's left before launch.

| Doc | Read it when you want to… |
| --- | --- |
| [Setup](setup.md) | Run the site locally, set environment variables, connect Supabase, deploy |
| [Waitlist data](data.md) | Know exactly what we collect, how it's stored, and how to read or export leads |
| [Join flow](waitlist.md) | Understand the "Join the waitlist" page: entry points, behavior, motion, API responses |
| [Architecture](architecture.md) | Find your way around the code, the request path, spam protection and tests |
| [Design](design.md) | Use the colors, type, gradient, motion and components consistently |
| [Launch checklist](launch-checklist.md) | See what's done, what's left, and the open decisions |
| [Recommendations](recommendations.md) | See what to improve next on the landing page, most important first |

## The short version

- **What it is:** a marketing site for ResAI, an AI assistant for independent US
  restaurants, cafés and bars. It has an interactive concept demo and a
  working waitlist.
- **Pre-launch, and honest about it:** the demo is labeled "Concept preview"
  and "Example data", nothing claims customers or live payments, and the
  waitlist only shows success once a signup is actually stored.
- **Signups go to Supabase** (Postgres). Until Supabase is connected the form
  says signups are "temporarily unavailable" and saves nothing.
- **Joining** opens a full page that slides in from the right and asks for
  restaurant name, email and phone (required), plus website, number of
  locations and POS problems (optional).
