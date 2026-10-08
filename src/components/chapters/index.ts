import Intro from './Intro.astro';
import Background from './Background.astro';
import Tools from './Tools.astro';
import Process from './Process.astro';
import Clients from './Clients.astro';
import Where from './Where.astro';
import Contact from './Contact.astro';

/** The content of each screen, keyed by slug ('' is home). */
export const views = {
  '': Intro,
  background: Background,
  tools: Tools,
  process: Process,
  clients: Clients,
  where: Where,
  contact: Contact,
};
