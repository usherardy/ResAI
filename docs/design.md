# Design

The look in one line: Inter on a warm off-white canvas, black ink, white
rounded cards, one ember-orange accent, and the sunset gradient for big
moments.

## Color tokens

Defined in `app/globals.css` (`:root`) and used as Tailwind colors
(`bg-brand`, `text-muted-foreground`, …). Use the tokens, not raw values.

| Token | Value | Use |
| --- | --- | --- |
| `background` | `oklch(0.975 0.004 95)` | Warm off-white page canvas |
| `foreground` | `oklch(0.145 0.003 60)` | Body text, black buttons |
| `card` | white | Cards and inputs on the canvas |
| `surface` | `oklch(0.945 0.012 70)` | Warm tinted panels (e.g. "Help shape ResAI", segmented controls) |
| `ink` | `oklch(0.13 0.004 60)` | Near-black full-bleed sections (footer), dialog backdrop |
| `muted-foreground` | `oklch(0.47 0.01 60)` | Secondary text (about 5.4:1 on the canvas, passes AA) |
| `brand` | `oklch(0.64 0.19 38)` | The single ember/tomato accent: pill knob, dots, focus ring, chip borders |
| `brand-strong` | `oklch(0.5 0.16 38)` | Accent **text** on light backgrounds (AA), required asterisks |
| `brand-soft` | `oklch(0.965 0.025 50)` | Selected chip fill, soft notices |
| `success` / `destructive` | green / red | Success check, errors |

**Sunset gradient** (`bg-hero-gradient`): orange rising from the bottom edge
through peach and pink into lavender and sky blue. Used on the hero, the
closing section and the join page. `bg-dot-grid` adds a faint dot texture.

## Type

- **Inter** for everything (`font-sans`, and `font-display` for headlines,
  set semibold with tight tracking, around -0.03em to -0.04em).
- **Geist Mono** for small uppercase eyebrows like "EARLY ACCESS"
  (`font-mono`, 11px, wide tracking), usually with a small orange dot.
- **Instrument Serif italic** (`lib/fonts.ts`) only as an accent for one
  emphasized phrase in a headline, at about 1.12em so it matches Inter's
  size. Currently just "*a dozen clicks.*" Use it sparingly.

## Motion

| Curve | Value | Use |
| --- | --- | --- |
| Site ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | Pill knob slide, small fades (`animate-fade-up`) |
| Ease-out-expo | `cubic-bezier(0.16, 1, 0.3, 1)` | Join page slide-in, `stagger-rise`, hero words gliding apart, feature boxes rising in |
| Overshoot | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hero tiles popping in, request bubbles and chips popping in the feature boxes |
| Ease-in | `cubic-bezier(0.7, 0, 0.84, 0)` | Join page exit |

`stagger-rise` (in `globals.css`) makes a container's children rise in one
after another. Tune it with `[--stagger-delay:…]` and `[--stagger-step:…]`.
The join page's full timing table is in [Join flow](waitlist.md#motion).

**Reduced motion:** a global rule makes every animation and transition
instant for visitors who ask for less motion. `stagger-rise` also drops its
delays. Keep new motion in CSS so it inherits this.

## Components worth knowing

- **Waitlist pill** (`components/waitlist/waitlist-cta.tsx`): black pill (or
  white on dark), 48px tall, ember knob with an arrow. On hover/focus the
  knob slides to the left and the arrow turns to point right.
- **Choice pills** in the form: segmented control for locations (selected =
  black) and toggle chips for POS problems (selected = ember border, soft
  fill, check icon).
- **Sheet** (`components/ui/sheet.tsx`): shadcn/Radix dialog used for the
  join page. Override size and motion through `className`; `cn` merges
  Tailwind classes, so later classes win.
- **Hero headline** (`components/sections/hero.tsx`): centered "Build, run,
  and grow your restaurant with agents." on fixed lines (three from 640px
  wide, four on phones, where the first line splits after "run,") with
  rounded gradient icon tiles (growth chart, chef hat, chat; `PopTile` in
  `components/ui/pop-tile.tsx`).
  It first reads as a plain sentence. On load (`RevealOnView` in
  `components/ui/reveal-on-view.tsx`) each tile's slot widens so the words
  glide apart (900ms) and the tile pops in with a small overshoot and turn
  (650ms), one line after another (150 / 290 / 430ms), then bobs slowly
  (`animate-float`, 6s). The description and buttons fade up after it (450 /
  600ms). Under reduced motion it shows the finished state, without the bob.
- **"One sentence instead of *a dozen clicks.*"**
  (`components/sections/features.tsx`): four example boxes (menus, sales,
  fixes, setup). Each box rises in the first time it scrolls into view, then
  plays like a short screen recording (`FeatureVideo` in
  `feature-video.tsx`, about 5s): the request types into an "Ask ResAI…"
  message box and is sent, ResAI shows thinking dots and two "working" lines
  (spinner, then check), then the reply and result build (oat-milk chips
  pop, sales bars grow, fix steps land, the bar-tabs switch flips on). A
  status caption (You type → ResAI is working → Ready) and a thin progress
  bar narrate it. It plays once (the right-hand box 450ms later), then shows
  Replay. Under reduced motion the boxes show finished.
- **How it works stepper** (`components/sections/how-it-works.tsx`): "Ask.
  Review. *Approve.*" as Step 1 / 2 / 3, following one example (a lunch
  special) from request to live. From 1024px wide, numbered badges sit
  centered over three cards and a line joins them; each card has a tinted
  panel holding a small white screen and centered text. The badge turns
  ember, the screen plays (the request appears word by word; the draft and
  tags appear; Approve turns into a green "Live on your menu"), and the line
  runs on to the next step, 1.1s per step (`--step` × 1.1s plus each piece's
  `--d`). Narrower, the steps stack as a vertical timeline and each plays
  when it scrolls into view. Reduced motion shows the end state.
- **One assistant tabs** (`components/sections/demo.tsx` +
  `assistant-tabs.tsx`, `#demo`): "One assistant for the *whole back
  office.*" on a surface panel, with Menus / Prices / Sales / Fixes tabs
  (from `/v2`). Each tab plays like a video: the request types out as a big
  quote, a "ResAI is working…" panel ticks through the scenario's three
  steps (placeholder bars → spinner → check), and a loading placeholder
  gives way to the result card and reply. The first tab plays when the
  section scrolls into view; choosing a tab plays it; Replay repeats it.
  Scenarios and cards come from `components/demo/`. (The free-typing
  `AgentDemo` is no longer on the page.)
- **Magic UI effects** in `components/ui/` (marquee in use; shimmer button,
  shiny text, border beam, shine border and spotlight card available) are
  adapted from [Magic UI](https://magicui.design) (MIT), rewritten to use CSS
  animation only.

## Accessibility and performance

- Semantic landmarks, a skip link, labeled form fields with
  `aria-describedby` errors, focus moves to the first invalid field and to
  the success heading, and live regions for form status.
- Dialogs trap focus, close on Escape and return focus to the opener.
- The feature boxes and the assistant tabs play once when scrolled into view
  (no loop) and offer Replay. With reduced motion they skip typing and show
  results immediately.
- The showcase strip has a visible pause button and pauses on hover. Under
  reduced motion it becomes a single static row you can scroll sideways.
- Every page is statically prerendered. Client JavaScript is limited to the
  header menu, the demo, the forms, the join page, the scroll reveals and
  the FAQ accordion. No images, analytics or third-party scripts.
