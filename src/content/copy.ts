/** The owner's copy, shared by every page variant. Do not rewrite it. */

export const name = 'Serhii Pemakhov';

export const description =
  'I build software using modern and effective AI tools: websites, AI assistant agents, Telegram bots, desktop and mobile apps.';

/** HTML: may carry <mark>s for highlighted words. */
export const lede =
  'I\'m a fullstack developer building websites and other software with modern AI tools, backed by strong experience writing code by hand and close attention to architecture and design.';

export const background = {
  title: 'My background',
  body: [
    'I started my career as a mechanical design engineer, creating 3D models and design documentation for a wide range of products. LED lights I designed still shine on many streets and buildings, and equipment I designed runs at many plants, including nuclear power stations.',
    'In early 2022 I moved into IT for good. I started as a backend developer with Node.js, TypeScript, NestJS and Express, then grew into a fullstack role, adding React and Next.js on the frontend. Working in small and mid-sized teams on Scrum and other Agile practices, I helped launch many products successfully.',
    'As AI matured, I adopted it to work faster and take on more. These days I usually build projects solo and talk to clients directly, with no middle layer, covering architecture, DevOps, design and QA myself.',
  ],
};

export const tools = {
  title: 'What I use',
  body: 'I use claude code with Max subscription, VS Code, pen.dev.',
  items: ['Claude Code Max', 'VS Code', 'pen.dev'],
};

export const process = {
  title: 'How I work',
  steps: [
    'I work with the client on the business requirements.',
    'I do the research, using AI.',
    'I choose the stack and outline the architecture.',
    'I write a proposal and refine it until it is approved.',
    'I set up the project and build out its architecture.',
    'I set up the agentic workflow: skills, hooks and the rest.',
    'Then I implement it feature by feature.',
  ],
  note: 'I usually follow documentation-driven development: every feature is documented and the docs are kept up to date, so anyone can see how the whole system works without reading the code.',
};

export const clients = {
  title: 'How I communicate with clients',
  languagesSentence: 'I can communicate in English, Ukrainian and Russian.',
  languages: ['English', 'Ukrainian', 'Russian'],
  rest: 'I can follow Scrum or keep it simpler with regular meetings, whichever the client prefers. If the client would rather I work autonomously most of the time, I send regular reports and record demos.',
};

export const job = {
  title: 'What I do now',
  body: 'I work full-time as a developer at ONIX Systems. I\'m also an AI enthusiast, so I spend much of my free time keeping up with new trends and building side projects.',
};

export const contact = {
  title: 'How to reach me',
  body: 'If you\'d like to get in touch, please send me an email.',
  email: 'serhiy.pemakhov@gmail.com',
};

/** Chapter order and nav labels. Each chapter is its own route. */
export const chapters = [
  { slug: 'background', label: background.title, title: background.title, colour: 'yellow' },
  { slug: 'tools', label: tools.title, title: tools.title, colour: 'blue' },
  { slug: 'process', label: process.title, title: process.title, colour: 'pink' },
  { slug: 'clients', label: 'Clients', title: clients.title, colour: 'lime' },
  { slug: 'where', label: job.title, title: job.title, colour: 'orange' },
  { slug: 'contact', label: 'Contact', title: contact.title, colour: 'violet' },
] as const;

export type ChapterSlug = (typeof chapters)[number]['slug'];

/** Home plus every chapter, in reading order. Home has no slug. */
export const screens = [
  { slug: undefined, label: 'Home', title: name, colour: 'paper' },
  ...chapters,
] as const;
