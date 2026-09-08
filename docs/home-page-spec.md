# Personal home page — main spec

Status: draft v0.2 · Owner: Serhii · Last updated: 2026-09-08

This is the top-level document. Everything else (per-page specs, design tokens, content files) hangs off it. Anything marked **[decide]** is an open decision; anything marked **[supply]** is content only Serhii can provide.

---

## 1. Purpose

A personal site that does two jobs at once:

1. Tells a coherent story: mechanical design engineer → full-stack Node.js/React developer → AI-first developer (agents, bots, RAG, harnesses, skills).
2. Converts a specific kind of visitor into a conversation.

The story is not decoration. It is the argument for why this person is the right one to hire: someone who has designed physical mechanisms, then software systems, and now builds systems that build software. Every section should make that argument tighter.

## 2. Audience

Primary visitor: a founder, product owner, or small-business operator who has a concrete need and is deciding whether to talk to you. Their four jobs-to-be-done:

| Visitor need | What they want to see immediately |
|---|---|
| Build a product from scratch | You can own the whole thing: backend, frontend, infra, product decisions |
| Improve an existing product | You can read someone else's system and make it better without a rewrite |
| Automate a process | You think in mechanisms; you have shipped bots and pipelines |
| Get a personal AI agent | You work AI-first daily and know the current toolchain (RAG, harnesses, skills, MCP) |

Secondary visitors: recruiters, other developers, people who found a post of yours. They get served by the same content; nothing is built specifically for them.

Explicit non-goals for v1: blog, newsletter, testimonial carousel, pricing page, multiple languages (see §10).

## 3. Story and messaging

### 3.1 Positioning line (hero) **[decide]**

One sentence, under 15 words, that names what you do for the audience — not a job title. Candidates:

- "I design mechanisms. These days they're made of code and models."
- "From gear trains to agent graphs: I build systems that do the work."
- "I help small teams ship products, automate processes, and put AI to work."

The first two carry the story; the third is clearer to a non-technical buyer. Pick one and put the other idea in the story section.

### 3.2 The three chapters, told as scenes

The story is told in three chapters, but each chapter is a *scene*, not a résumé entry: it has a small conflict, a visual that carries most of the weight, and a punchline that hands off to the next chapter. The copy is short — the diagram does the talking.

Each scene has: a period, one hook line, one diagram with a small story inside it, one short paragraph (60–90 words), one "what carried over" line.

**Chapter 1 — Mechanical design (until early 2022)**
Hook: "The first thing I ever shipped had a tolerance of ±0.02 mm and no undo button."
Scene: a real-looking assembly drawing of a mechanism (the motif — see §3.3). As the visitor scrolls, callouts appear one at a time like drawing notes, but the notes tell the story: NOTE 1 what the part does; NOTE 2 the constraint that nearly killed it; NOTE 3 the fix. The last note points at the whole drawing: "You cannot patch steel in production. You learn to think before you cut."
Paragraph: designed physical mechanisms and assemblies — tolerances, kinematics, drawings a machinist can build from.
Carried over: constraints are the design; the system must be buildable by someone who isn't you; drawings are communication, not art.

**Chapter 2 — Full-stack web (2022 → now)**
Hook: "Then I found a material you can fix at 2 a.m. from your phone."
Scene: the same mechanism redrawn as a system — the parts become services, the shaft becomes a request path, the bearing becomes the database. A request travels through it on scroll; at one box it stalls (a small red annotation: "here is where the client called"), then re-routes and completes. The stall is the conflict; the reroute is the punchline.
Paragraph: Node.js (NestJS), React (Next.js), PostgreSQL, Azure and AWS. Sole developer or small team on client products, owning product decisions and client communication.
Carried over: the whole-system view; being the only engineer in the room; shipping under real deadlines.

**Chapter 3 — AI-first development (now)**
Hook: "Now the drawing draws itself, and I review it."
Scene: the system diagram from Chapter 2 gets wrapped in a harness: an agent loop with tools around it — Claude Code, a skill, a Telegram bot, a RAG store. The same stall from Chapter 2 happens again; this time an agent node lights up, reads the failure, patches it, and a bot notifies a phone in the corner of the drawing. Punchline note: "Same engineer. The tools finally caught up."
Paragraph: builds with agents rather than only writing code — Claude Code as the workbench, custom harnesses and skills, bots, RAG, remote-controlled dev workflows.
Carried over (for the client): faster iteration, cheaper experiments, automation that actually gets maintained.

Tone: first person, plain, specific, dry. Humor comes from true details (the tolerance, the 2 a.m. fix), never from jokes added on top. No "passionate", no "journey", no "leveraging". Nouns over adjectives. Facts a reader could check.

### 3.3 Storytelling devices

Entertaining here means: the visitor keeps scrolling because something is unfolding, and they arrive at the offer already convinced. Rules:

- **One recurring motif.** A single mechanism appears in every chapter, transformed to match the era: physical assembly → software system → agent-wrapped system. Same silhouette each time, so the visitor recognises it. **[decide]** which mechanism (see §10.7); it should be something you actually designed, or close to it, so the drawing notes can be true.
- **Conflict in every scene.** Each diagram contains one thing going wrong and one thing fixing it. That is the whole narrative engine: constraint → problem → solution, three times, with the solution getting more automated each time.
- **Notes are the narration.** Story text inside diagrams is written as drawing notes, tickets, or log lines — the native annotation form of that era — not as speech bubbles or captions. Chapter 1: "NOTE 2". Chapter 2: a short issue title. Chapter 3: a one-line agent log entry.
- **Scroll is the timeline.** Scenes progress with scroll position, so the visitor controls the pace and can scrub back. Nothing autoplays except the hero. Every scene also works as a static frame for reduced-motion and for screenshots/sharing.
- **A few interactive moments, not many.** Budget: three on the whole page. Candidates: click the hero to replay; drag a tolerance slider in Chapter 1 and watch the fit go from loose to jammed; hover/tap the agent node in Chapter 3 to see the log it produced. Interaction must reveal something true about how you work, not just be fun.
- **The buyer can skip.** A visitor who already knows what they want must reach services within one scroll. Nav links to "What I can do" and the hero CTA both bypass the story. The story never gates the offer.
- **Payoff at the end.** The contact section reuses the motif one last time, at rest, with a single note: the CTA. The visitor has watched the mechanism get fixed three times; the fourth fix is their project.

What this is not: a scrolljacking site, a "choose your adventure", or a page full of mascots and easter eggs. One motif, three scenes, three interactions, done.

### 3.4 Offer

Four services mapped 1:1 to the audience table. Each service is two sentences: what you do, what the client gets. No "packages", no prices in v1.

### 3.5 Proof **[supply]**

Two to four case studies in a fixed format: problem → what you built → result (one measurable thing if possible) → stack. Candidates: the AI learning platform built solo for a client team; an automation/bot project; anything with a number attached. Client names only where permitted; otherwise describe the domain.

### 3.6 Call to action

One primary action across the whole site: start a conversation. **[decide]** channel — email link, Telegram, or a short form. Recommendation: email + Telegram links, no form (nothing to maintain, no spam handling). The CTA text states what happens: "Email me about your project", not "Get in touch".

## 4. Information architecture

```
/                 Home — the story + offer + proof + CTA (this spec)
/work             Case studies (own visual style, later)
/ai               How I work AI-first: harness, skills, agents (own style, later)
/notes            Optional — short writeups (later, only if there is content)
/contact          Can be a section on Home in v1; page only if a form is added
```

Home is a single long page. Sections in order:

1. Hero — name, positioning line, the signature animation, primary CTA
2. Story — three chapters, scroll-driven
3. What I can do for you — four services
4. Selected work — 2–4 cases
5. How I work — one process diagram (AI-first loop)
6. Contact — CTA, links, location/time zone

Navigation: name (links home), Work, AI, Contact. Nothing else. Footer: links, year, "built with" line (optional).

## 5. Visual direction

### 5.1 Concept: a drawing set that comes to life

The whole site borrows the vernacular of engineering documentation — technical drawings, schematics, system diagrams — and lets it evolve across the story:

- Chapter 1 uses drafting language: dimension lines, section hatching, part callouts, a title block.
- Chapter 2 uses software diagrams: request flow, boxes and arrows, a database schema fragment.
- Chapter 3 uses agent graphs: nodes, tool calls, loops, a harness wrapping a model.

Same line weight, same grid, same annotation style throughout, so the three chapters read as one continuous drawing that changes subject. That continuity *is* the message: the same engineer, different materials.

### 5.2 The one bold element

The hero animation. One mechanism — a gear train or a four-bar linkage — drawn in the drafting style, running. As the visitor scrolls (or after one page-load sequence), the mechanism reorganises: links become edges, joints become nodes, and it settles into an agent graph. This is the memorable thing on the site. Everything else stays quiet.

Constraints:
- Vector (SVG), not video or raster. Must look crisp at any size and weigh under ~150 KB.
- Plays once on load; can be replayed by clicking it. Not looping forever in the background.
- With `prefers-reduced-motion`, it renders the final state (the graph) as a static image with the mechanism shown faintly behind it.
- Mobile gets a simplified version (fewer parts), not a hidden one.

### 5.3 Everything else: minimal

- Lots of whitespace, one column of text, line length under 75 characters.
- Diagrams are inline with the text they explain, left-aligned with the copy, never in cards.
- No decorative gradients, no drop shadows, no rounded-card grid. Structure comes from rules, grid, and annotation — the things that mean something on a drawing.
- Motion outside the hero: only scroll-driven progression inside the story diagrams (a dimension line draws in, a request travels through the flow, a node lights up) and state changes that answer a click. No fade-up-on-scroll for text blocks.

### 5.4 Tokens (proposal) **[decide]**

Two candidate directions. Both avoid the "cream paper + terracotta" and "black + acid green" defaults.

**A. Drafting paper**
- Background `#EDEFF1` (cool grey, like vellum), surface `#F6F7F8`
- Ink `#1C2129`, secondary ink `#5B6470`
- Grid `#D8DCE1`
- Accent `#D6452B` (red pencil — used only for the "current" state and the CTA)

**B. Blueprint negative**
- Background `#10243F`, surface `#163055`
- Ink `#E8EEF5`, secondary `#8FA3BD`
- Grid `#1E3A61`
- Accent `#FFB454` (amber — annotation highlights and CTA)

Recommendation: A for Home (reads calmer, better for long text), and keep B available as the theme for `/ai` so the per-page styling is visible from day one.

Typography: one family with a wide weight range and a condensed cut for headings, so headings and body clearly differ without a second face. Annotation labels on diagrams may use a drafting-style face (single-stroke / DIN-like) — that is a deliberate reference to drawings, not a generic mono label habit. Type scale: 1.25 ratio, base 18px on desktop, 17px on mobile.

## 6. Extensibility: each page owns its style

Requirement: adding a new page with a completely different look must not require touching Home, and must not leak styles either way.

Architecture:

- **Shared shell**: nav, footer, layout container, content width, focus styles, reduced-motion handling. Unthemed — it inherits whatever tokens the page sets.
- **Per-page theme scope**: every route defines its own token set (colors, type, spacing, grid) as CSS custom properties on a wrapper element. Components read tokens; they never hardcode colors. Home's theme is one file; `/ai`'s theme is another.
- **Diagram primitives**: a small library of SVG building blocks (node, edge, dimension line, callout, hatch, title block) styled entirely through tokens, so the same primitive looks like a drawing on Home and like a dark schematic on `/ai`.
- **Content separate from layout**: page copy, case studies, and services live in MDX or structured files, not inside components.
- **Motion primitives**: a shared `draw-in`, `travel`, `highlight` set with a single reduced-motion switch.

Rule of thumb: a new page may add anything, but may only *reuse* through the shell, primitives, and content schema — never by importing another page's components.

## 7. Technical requirements

**Stack [decide]** — recommendation: Next.js (App Router), static export, TypeScript, MDX for content, plain CSS with custom properties (or CSS modules). Reasons: it is your daily stack, interactive SVG in React is straightforward, and static export keeps hosting free. Astro is the alternative if the site stays mostly static; it would cost you some familiarity for slightly better default performance. Not a big enough gain to switch.

**Animation** — SVG manipulated via Motion (`motion/react`) or hand-rolled `requestAnimationFrame`; scroll progression via `IntersectionObserver` or scroll-driven animations where supported. Avoid GSAP/Lottie unless the hero proves too hard without them. No canvas/WebGL in v1.

**Hosting** — static on Vercel, Cloudflare Pages, or GitHub Pages. Custom domain **[supply]**.

**Performance budget** — LCP under 2.0 s on a mid-range phone, total JS under 120 KB gzipped on Home, hero SVG under 150 KB, Lighthouse 95+ across the board.

**Accessibility** — every diagram has a text alternative that states its point (not "diagram of a mechanism"); keyboard-reachable everything; visible focus; contrast AA on body text with both token sets; `prefers-reduced-motion` respected everywhere.

**SEO / sharing** — proper title/description per page, Open Graph image (a still frame of the hero graph), structured data for Person, sitemap, canonical URLs.

**Analytics** — privacy-friendly, cookie-free (Plausible/Umami or none). No consent banner needed.

**Content workflow** — Markdown/MDX in the repo; a new case study is a new file, not a code change. Built and edited with Claude Code; the repo should include a `CLAUDE.md` describing the token/primitive rules from §6 so agents respect them.

## 8. Home page requirements (checklist)

- R1. Positioning line and name visible without scrolling on any device.
- R2. Hero animation plays once, is replayable, degrades to static under reduced motion, simplified on mobile.
- R3. Three story chapters, each with exactly one diagram and one "what carried over" line.
- R4. Diagram styling is continuous across chapters (same grid, line weight, annotation style).
- R5. Four services, each mapped to a visitor need from §2, two sentences each.
- R6. 2–4 case studies in the fixed problem/built/result/stack format.
- R7. One process diagram for the AI-first workflow.
- R8. Single primary CTA repeated in hero and contact section, same wording both times.
- R9. All copy in first person, no marketing adjectives (see §3.2 tone).
- R10. Meets the performance and accessibility budgets in §7.
- R11. Home's theme lives in one token file; nothing in Home depends on other pages.
- R12. One recurring mechanism motif appears in all three chapters and in the contact section, recognisably the same silhouette.
- R13. Each chapter diagram contains one problem and one fix; narration lives in era-appropriate annotations (drawing note / issue / log line).
- R14. At most three interactive moments on Home; each reveals something true about the work.
- R15. Services are reachable within one scroll from the top via nav or CTA; the story never gates the offer.
- R16. Every scene has a static frame that stands alone under reduced motion.

## 9. Content inventory **[supply]**

- Final positioning line (§3.1)
- Chapter paragraphs, approx. 60–90 words each, plus dates
- Four service descriptions
- Case studies (2–4): problem, what was built, result, stack, permission to name client
- Photo — yes/no; if yes, one, small, not in the hero
- Contact channels and preferred one; location/time zone line
- Domain name
- Links: GitHub, LinkedIn, anything else worth showing

## 10. Open decisions

1. Positioning line — §3.1
2. Token direction A or B for Home — §5.4
3. Stack: Next.js vs Astro — §7
4. Contact: links only vs form — §3.6
5. Language: English only in v1 is the recommendation. A Ukrainian version is a later addition; the content-in-files structure (§6) makes it a translation task, not a rebuild.
6. Whether to mention current employer by name, or describe the work generically.
7. The motif mechanism: gear train (simpler, reads instantly) vs four-bar linkage (more elegant transformation into a graph) vs something you actually designed. It is used in the hero and all three chapters, so pick once.
8. Which three interactions make the cut (§3.3).
9. True details for the drawing notes — the real tolerance, the real 2 a.m. incident. These need to be yours; invented ones will read as invented.

## 11. Next documents

- `design-tokens.md` — final palette, type scale, spacing, grid, per-page theme convention
- `storyboard.md` — frame-by-frame for the hero and all three scenes: motif states, annotation text, scroll ranges, interaction points, reduced-motion frames
- `content/home.mdx` — the actual copy
- `pages/ai.md`, `pages/work.md` — per-page specs, each with its own visual direction
