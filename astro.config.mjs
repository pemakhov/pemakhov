// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// `site` is a placeholder until the custom domain is supplied (spec §9).
// Deploy target is Cloudflare Pages / Vercel, NOT GitHub Pages: this repo is
// `pemakhov/pemakhov`, so Pages would serve under a `/pemakhov` base path and
// every internal link would need `base` config. Revisit only if that changes.
export default defineConfig({
  site: 'https://example.com',
  integrations: [mdx()],
  build: {
    // One stylesheet per page keeps a page's theme out of every other page's
    // payload — the §6 "no leakage" rule, enforced by the bundler.
    inlineStylesheets: 'auto',
  },
});
