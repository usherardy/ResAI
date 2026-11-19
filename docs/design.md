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

## Motion

| Curve | Value | Use |
| --- | --- | --- |
| Site ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | Pill knob slide, small fades (`animate-fade-up`) |
| Ease-out-expo | `cubic-bezier(0.16, 1, 0.3, 1)` | Join page slide-in and `stagger-rise` |
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
- **Magic UI effects** in `components/ui/` (marquee in use; shimmer button,
  shiny text, border beam, shine border and spotlight card available) are
  adapted from [Magic UI](https://magicui.design) (MIT), rewritten to use CSS
  animation only.

## Accessibility and performance

- Semantic landmarks, a skip link, labeled form fields with
  `aria-describedby` errors, focus moves to the first invalid field and to
  the success heading, and live regions for form status.
- Dialogs trap focus, close on Escape and return focus to the opener.
- The demo plays once when scrolled into view (no loop). With reduced motion
  it skips typing and shows results immediately.
- The showcase strip has a visible pause button and pauses on hover. Under
  reduced motion it becomes a single static row you can scroll sideways.
- Every page is statically prerendered. Client JavaScript is limited to the
  header menu, the demo, the forms, the join page and the FAQ accordion. No
  images, analytics or third-party scripts.
