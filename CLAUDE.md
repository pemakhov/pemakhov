# Working rules for this repo

Personal site for Serhii Pemakhov. The full brief is `docs/home-page-spec.md` —
read it before changing anything visual. Section references below (§) point there.

## Stack

Astro 7 (static output), TypeScript, plain CSS with custom properties, MDX for
content. **No UI framework and no animation library.** Both were considered and
rejected against the §7 budget; see `docs/design-tokens.md` and the plan notes.
Do not add React, Tailwind, GSAP, Motion or anime.js without revisiting that
decision explicitly.

## The four rules that matter

### 1. Never hardcode a colour

Every colour comes from a token: `var(--ink)`, `var(--accent)`, and so on.
`src/styles/tokens.contract.css` is the list of required token names.
`src/styles/shell.css` and `reset.css` must contain **no colour literals at all** —
`npm test` enforces this.

### 2. Themes are per route, and never leak

A route sets `data-theme="…"` on its wrapper (via the `theme` prop on `Shell`)
**and** imports its own file from `src/styles/themes/`. A theme file scopes every
declaration under `[data-theme="x"]` and never writes to `:root`. Adding a token
to the contract means adding it to *every* theme; the test will tell you.

The shell (`src/layouts/Shell.astro`) must never import a theme.

### 3. SVG is styled by CSS class, not by attribute

SVG presentation attributes do not accept `var()`. This does **not** work:

```html
<circle fill="var(--dg-node-fill)" />   <!-- wrong: renders as no fill -->
```

Do this instead:

```html
<circle class="dg-node" />              <!-- .dg-node { fill: var(--dg-node-fill) } -->
```

All drawing primitives also set `vector-effect: non-scaling-stroke`, so line
weight stays identical across chapters regardless of viewBox (R4).

### 4. A new page reuses only through the shell, primitives, and content schema

§6: a new page may add anything, but may never import another page's components.
If two pages need the same thing, it moves into `src/diagram/primitives/` or
`src/components/` — it does not get imported across routes.

## Animation architecture

Diagrams are **parametric geometry**, not tweens.

- `src/diagram/motif/kinematics.ts` — pure math, `params → points`. No DOM. Unit-tested.
- `src/diagram/motif/anchors.ts` — the ordered anchor array shared by every chapter.
  This is the R12 contract: all frames render the same anchor IDs in the same order,
  which is what makes the silhouette recognisably the same and makes the hero morph a
  plain lerp between equal-length arrays.
- `src/diagram/storyboard/*.ts` — each scene is a **table** of elements with a
  `[startProgress, endProgress]` window and an `evaluate(t)`. Not an imperative timeline.
  This is what makes scrubbing backwards, reduced-motion static frames and the
  build-time OG still all fall out for free.
- `src/diagram/motion/driver.ts` — the only thing that touches scroll. Maps scroll
  position to `t` and calls `evaluate`.

Render the static frame at build time in the `.astro` component, then attach the
driver in a `<script>`. First paint must never depend on JS.

## Interactivity

Astro `<script>` blocks, no `client:*` directives (there are no framework islands).
`define:vars` does not work with bundled scripts — pass build-time data via `data-*`
attributes or a `<script type="application/json">` payload.

§3.3 caps Home at **three** interactive moments (R14). Adding a fourth means
removing one.

## Budgets — check before you claim done

- Home JS under 120 KB gzipped (currently 0 KB; expect ~10–15 KB once the driver lands)
- Hero SVG under 150 KB
- Lighthouse 95+, LCP under 2.0 s

`npm run build` then check `dist/`. `npm test` runs the architecture invariants.

## Content

Copy lives in `src/content/`, never inside components. A new case study is a new
MDX file, not a code change.

Anything marked `[decide]` or `[supply]` in the spec is genuinely undecided —
do not invent a value for it, and especially do not invent the true details in
§10.9 (the real tolerance, the real 2 a.m. incident). Invented ones will read
as invented.
