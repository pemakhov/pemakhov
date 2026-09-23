- 👋 Hi, I’m Serhii Pemakhov
- 👀 I’m interested in Node.js, React.js, JS, TS, functional programming

<!---
pemakhov/pemakhov is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->

---

## This repo

Source for my personal site.

An engineering-drawing motif — one mechanism — is redrawn across three chapters:
a physical assembly, then a software system, then an agent-wrapped system. It is
the same silhouette each time, because it is literally the same array of anchor
points rendered three ways.

**Stack:** [Astro](https://astro.build) (static), TypeScript, plain CSS custom
properties, MDX. No UI framework, no animation library — the diagrams are
parametric geometry driven by a ~100-line scroll driver, which is both smaller
and a better fit than a timeline library would be.

```bash
npm install
npm run dev      # local dev server
npm run build    # static build to dist/
npm test         # architecture invariants
npm run check    # astro + TypeScript check
```

**Docs:** [`docs/home-page-spec.md`](docs/home-page-spec.md) is the brief ·
[`docs/design-tokens.md`](docs/design-tokens.md) is the palette, type scale and
theming convention · [`CLAUDE.md`](CLAUDE.md) is the working rules.
