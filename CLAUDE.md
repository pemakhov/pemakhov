# Working rules for this repo

Personal site for Serhii Pemakhov. Neobrutalism style, one fixed screen:
an intro on the home page, and six chapters reached by folder tabs (plus a
Home tab) along
the bottom edge.

## Stack

Astro 7 (static output), plain CSS with custom properties. No UI framework,
no animation library, no CSS framework. The only client JS is the copy
button on the contact page. Fonts come from Google
Fonts (Archivo Black for headings, Space Grotesk for body).

## Layout of the code

- `src/content/copy.ts` — all copy, plus the chapter list (order, nav label,
  colour, slug).
- `src/layouts/Screen.astro` — the screen and its navigation: contents on the
  intro; Back under the text on chapters. Navigation
  is type only: a highlighter stroke in the chapter's colour, no boxes.
- `src/layouts/Base.astro` — `<head>`, fonts, meta.
- `src/pages/index.astro` — the intro.
- `src/pages/{background,tools,process,clients,where,contact}.astro` — one chapter each.
- `src/components/chapters/` — the content of each screen.
- `src/components/Arrow.astro` — the drawn arrow used by navigation.
- `src/styles/global.css` — tokens and shared styles. Variant layouts carry
  their own scoped styles.

## Rules

1. **Colours are tokens.** Everything comes from `:root` in `global.css`
   (`--paper`, `--ink`, `--yellow`, `--pink`, `--blue`, `--lime`, `--orange`, `--violet`).
   No colour literals outside that block.
2. **Neobrutalism, kept quiet.** True black, heavy rules, flat colour. No
   shadows, gradients or rounded corners. Do not wrap content in frames; the
   page got cluttered that way.
3. **One screen.** The page never scrolls; a chapter taller than the screen
   scrolls inside `.stage`. Pages stay paper; a chapter's colour appears
   only as the highlighter stroke behind its title and under Back. A new
   chapter is a new entry in `chapters`, a component in
   `src/components/chapters/`, and a page.
4. **Lists look like lists.** Short lists (tools, languages) are big words
   (`.words`); the process is a timeline (`.timeline`). Prose stays prose.
5. **Copy is the owner's words.** Do not rewrite or "improve" the copy in
   `src/content/copy.ts`; change it only when asked. Never invent contact
   details, clients, or project facts.

## Commands

```bash
npm run dev      # local dev server
npm run build    # static build to dist/
npm run check    # astro + TypeScript check
```
