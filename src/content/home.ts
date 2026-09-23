/**
 * Home copy. Components and storyboards read from here; no copy lives inside
 * them.
 *
 * Status of every line: drafted from docs/home-page-spec.md, NOT final.
 * Anything marked [supply] must come from Serhii — especially the true details
 * in §10.9 (the real tolerance, the real incident). Do not fill those in.
 */

// [decide §3.1 / §10.1] — candidate 1 of three. The other two are in the spec.
export const positioning = 'I design mechanisms. These days they’re made of code and models.';

// §3.6 [decide §10.4] — recommendation is email + Telegram links, no form.
export const cta = { label: 'Email me about your project', href: 'mailto:[supply]' };

/* --- Scene narration -------------------------------------------------------
   Tags are short labels drawn inside the SVG. Captions are the sentences in
   the notes list under each drawing. */

export const heroScene = {
  // §10.7: the mechanism is a stand-in until decided.
  description:
    'A mechanism drawn like an engineering drawing. As you scroll it tips over, ' +
    'comes apart along its shaft so each part can be named, and goes back together.',
};

export const chapter1Scene = {
  description:
    'The mechanism as an assembly drawing. One part slips off its axis and jams the ' +
    'drive; a note records the constraint, the part is brought back into line, and the ' +
    'drive turns again.',
  captions: {
    note1: 'NOTE 1 — [supply §10.9] What the part does.',
    note2: 'NOTE 2 — [supply §10.9] The constraint that nearly killed it.',
    note3: 'NOTE 3 — [supply §10.9] The fix.',
    // §3.2, verbatim.
    closing: 'You cannot patch steel in production. You learn to think before you cut.',
  },
};

export const chapter2Scene = {
  description:
    'The same mechanism redrawn side-on as a software system: each part becomes a ' +
    'service and the shaft becomes the request path. A request stalls at one service, ' +
    'is re-routed around it, and completes.',
  // §3.2: "the parts become services, the shaft becomes a request path, the
  // bearing becomes the database". Other names are drafts; keep each ≤ 12
  // characters so it fits its box.
  services: {
    cap: 'Web app',
    bearing: 'Database',
    gear: 'API',
    housing: 'Integrations',
    pinion: 'Queue',
    flange: 'Hosting',
  } satisfies Record<string, string>,
  issueTag: 'Issue',
  captions: {
    // §3.2, verbatim.
    issue: 'Issue: here is where the client called.',
  },
};

export const chapter3Scene = {
  description:
    'The same system wrapped in a harness: an agent with its tools. The same service ' +
    'stalls again; this time the agent reads the failure and patches it, the request ' +
    'completes, and a bot sends a notification to a phone.',
  tags: {
    harness: 'Harness',
    agent: 'Agent',
    // §3.2 names these four.
    tools: ['Claude Code', 'Skill', 'RAG', 'Telegram bot'],
  },
  captions: {
    log: 'agent › [supply §10.9] One-line log entry for the patch.',
    // §3.2, verbatim.
    closing: 'Same engineer. The tools finally caught up.',
  },
};

/* --- Story (§3.2) ----------------------------------------------------------
   Paragraphs are [supply]: 60–90 words each, in Serhii's own words. */

export const chapters = [
  {
    scene: 'chapter-1',
    period: 'until early 2022',
    title: 'Mechanical design',
    hook: 'The first thing I ever shipped had a tolerance of ±0.02 mm and no undo button.',
    body:
      'Designed physical mechanisms and assemblies — tolerances, kinematics, ' +
      'drawings a machinist can build from.',
    carried: 'Constraints are the design. The system must be buildable by someone who isn’t you.',
  },
  {
    scene: 'chapter-2',
    period: '2022 → now',
    title: 'Full-stack web',
    hook: 'Then I found a material you can fix at 2 a.m. from your phone.',
    body:
      'Node.js (NestJS), React (Next.js), PostgreSQL, Azure and AWS. Sole developer or ' +
      'small team on client products, owning product decisions and client communication.',
    carried: 'The whole-system view. Being the only engineer in the room. Shipping under real deadlines.',
  },
  {
    scene: 'chapter-3',
    period: 'now',
    title: 'AI-first development',
    hook: 'Now the drawing draws itself, and I review it.',
    body:
      'I build with agents rather than only writing code — Claude Code as the workbench, ' +
      'custom harnesses and skills, bots, RAG, remote-controlled dev workflows.',
    carried: 'For you: faster iteration, cheaper experiments, automation that actually gets maintained.',
  },
] as const;

// §3.4 — four services mapped 1:1 to the audience table in §2. [supply]
export const services = [
  { need: 'Build a product from scratch', title: 'Ship a product end to end' },
  { need: 'Improve an existing product', title: 'Work inside a system you already have' },
  { need: 'Automate a process', title: 'Automate the work nobody wants to do' },
  { need: 'Get a personal AI agent', title: 'Put an agent to work for you' },
];
