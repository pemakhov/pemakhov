# Design tokens

Companion to `home-page-spec.md` §5.4 and §6. This is the working reference for
the palette, type scale, grid and the per-page theming convention.

Status: Phase 1 · palette settled · **typefaces still open**

## How theming works

Spec §6 requires that a new page can look completely different without touching
Home, and without styles leaking either way. Three mechanisms enforce that:

1. **The shell is unthemed.** `src/styles/shell.css` and `reset.css` contain no
   colour literals at all — every colour is `var(--token)`. A test fails the
   build if a hex ever appears there.
2. **A theme is scoped to its route.** Each file in `src/styles/themes/` puts
   every declaration under `[data-theme="x"]` and never writes to `:root`. The
   page sets the attribute (via `Shell`'s `theme` prop) *and* imports its own
   theme file, so Astro only ships that theme's CSS on that route. Home's built
   stylesheet provably contains none of `/ai`'s tokens.
3. **The contract is a list, not a convention.** `tokens.contract.css` carries a
   machine-read `@theme-contract` block naming every token a theme must define.
   Adding a token there without adding it to every theme fails `npm test`.

Structural tokens — spacing, type scale, measure, stroke weights, motion — have
defaults on `:root` in the contract file. A theme may override them but does not
have to.

## Palette

### Home — direction A, "drafting paper"

| Token | Value | Role |
|---|---|---|
| `--bg` | `#edeff1` | page ground, cool grey like vellum |
| `--surface` | `#f6f7f8` | the drawing ground |
| `--ink` | `#1c2129` | body text, main drawing stroke |
| `--ink-secondary` | `#5b6470` | de-emphasised text, drawing notes |
| `--rule` / `--grid` | `#d8dce1` | hairline rules, drawing grid |
| `--accent` | `#be342b` | red pencil — the "current" state and the CTA, nothing else |
| `--dg-hatch` | `#c3c9d1` | section hatching |

**One deviation from the spec.** §5.4 proposes `#d6452b` for the accent. Measured
against §7's "contrast AA on body text with both token sets", that value fails
twice: 4.13:1 for the CTA label on the accent fill, and 3.84:1 for the accent used
as annotation text — both under the 4.5:1 AA threshold for normal-size text.
`#be342b` is the same red pencil deepened until it clears 4.5:1 in both
directions. Worst case 4.90:1. If the original hue is wanted back, the CTA has to
become large text (≥18.66px bold or ≥24px, where the bar drops to 3:1) and the
accent can never carry body-size text.

`--dg-active` is `--ink`, not the accent: §5.4 keeps the accent scarce, so
"this element is live" is carried by stroke weight and a solid dash rather than
by a second hue. `--dg-fault` is the accent — the one thing going wrong in each
scene is exactly what a red pencil is for.

### /ai — direction B, "blueprint negative"

| Token | Value | Role |
|---|---|---|
| `--bg` | `#10243f` | ground |
| `--surface` | `#163055` | raised surface |
| `--ink` | `#e8eef5` | text and stroke |
| `--ink-secondary` | `#8fa3bd` | notes |
| `--rule` / `--grid` | `#1e3a61` | rules and grid |
| `--accent` | `#ffb454` | amber — annotation highlights and CTA |
| `--dg-fault` | `#ff8a6b` | the fault state |

Direction B has contrast headroom the paper theme does not: accent on ground is
8.85:1, so on `/ai` the accent *can* carry body text and `--dg-active` uses it
directly. This theme exists from day one specifically so that per-page styling is
provably real rather than aspirational (§5.4).

### Measured contrast (all AA for normal text)

| Pair | Home | /ai |
|---|---|---|
| ink on bg | 14.03:1 | 13.36:1 |
| ink on surface | 15.07:1 | — |
| ink-secondary on bg | 5.20:1 | 6.05:1 |
| accent on bg | 4.90:1 | 8.85:1 |
| CTA label on accent | 5.27:1 | 8.85:1 |

`tests/contrast.test.ts` recomputes these on every run, for every theme file in
the directory. A new theme is checked automatically.

## Type scale

Ratio 1.25 (§5.4), base 17px mobile / 18px at 48em and up. Steps are `calc()`
chains off `--type-base`, so changing the base moves the whole scale.

| Token | Multiple |
|---|---|
| `--type--1` | base ÷ 1.25 |
| `--type-base` | 1.0625rem → 1.125rem |
| `--type-1` … `--type-4` | ×1.25 each step |

`--measure: 68ch` keeps line length under §5.3's 75-character limit.

### Typefaces — **open**

Currently system stacks, so nothing is blocked, but this is not the design. §5.4
asks for:

- one family with a wide weight range **and a condensed cut for headings**, so
  headings and body differ without a second face;
- a drafting-style face for diagram annotations — single-stroke, DIN-like. This
  is a deliberate reference to technical drawings, explicitly *not* a generic
  monospace label habit.

Whatever is chosen has to be self-hosted and subset, because the §7 budget has no
room for a font-service round trip. Three tokens change and nothing else:
`--font-body`, `--font-heading`, `--font-annotation`.

## Grid and spacing

`--grid-unit: 0.5rem` is the drawing pitch. Every spacing token is a multiple of
it, so text and diagrams sit on the same grid — which is what makes the three
chapters read as one continuous drawing (R4).

Steps follow 1, 2, 3, 5, 8, 13, 21 units. `--radius: 0` is declared explicitly
because §5.3 rules out a rounded-card grid, and a stated zero is harder to drift
from than an omission.

## Drawing strokes

`--dg-stroke-heavy: 1.6`, `--dg-stroke: 1`, `--dg-stroke-thin: 0.6`, applied with
`vector-effect: non-scaling-stroke`. That last part is what actually delivers R4:
line weight stays identical whether a diagram is drawn in a 400-unit viewBox or a
1200-unit one, so the chapters cannot drift apart visually.

## Motion

`--motion-fast/base/slow` and two easings, `--ease-draw` and `--ease-settle`.
Reduced motion is handled in one place (`shell.css`), and the JS driver reads the
same signal to render a scene's static frame instead of subscribing to scroll.
