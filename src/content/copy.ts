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
    'I work with client on business requirements.',
    'I make research using AI.',
    'I select stack and create architecture.',
    'I create and improve proposal until it is approved.',
    'Then I work on implementation feature by feature.',
  ],
  note: 'Usually I use document driven development. It is when all features are well documented and up to date, so reading it one can have idea of how everything works without need to read the code.',
};

export const clients = {
  title: 'How I communicate with clients',
  languagesSentence: 'Languages I can communicate on are English, Ukrainian and Russian.',
  languages: ['English', 'Ukrainian', 'Russian'],
  rest: 'I can follow SCRUM technique, or keep it simpler with any regular meetings - up to client. If client prefers to keep me working autonomously most of time - I provide regular reports and record demos.',
};

export const job = {
  title: 'Where I work',
  body: 'Currently I am a fulltime developer at ONIX Systems. I am an AI enthusiast, so I spend a lot of time learning new trends or developing side projects among my main work in after work time.',
};

/** Chapter order and nav labels. Each chapter is its own route. */
export const chapters = [
  { slug: 'background', label: background.title, title: background.title, colour: 'yellow' },
  { slug: 'tools', label: tools.title, title: tools.title, colour: 'blue' },
  { slug: 'process', label: process.title, title: process.title, colour: 'pink' },
  { slug: 'clients', label: 'Clients', title: clients.title, colour: 'lime' },
  { slug: 'where', label: job.title, title: job.title, colour: 'orange' },
] as const;

export type ChapterSlug = (typeof chapters)[number]['slug'];

/** Home plus every chapter, in reading order. Home has no slug. */
export const screens = [
  { slug: undefined, label: 'Home', title: name, colour: 'paper' },
  ...chapters,
] as const;
