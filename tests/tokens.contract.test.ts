import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const STYLES = new URL('../src/styles/', import.meta.url).pathname;

/** Reads the required token names out of the @theme-contract block. */
function requiredTokens(): string[] {
  const contract = readFileSync(join(STYLES, 'tokens.contract.css'), 'utf8');
  const block = contract.match(/@theme-contract([\s\S]*?)@end-theme-contract/);
  if (!block) throw new Error('tokens.contract.css has no @theme-contract block');
  return [...(block[1] ?? '').matchAll(/(--[a-z0-9-]+)/g)].map((m) => m[1] as string);
}

function themeFiles(): string[] {
  return readdirSync(join(STYLES, 'themes')).filter((f) => f.endsWith('.css'));
}

describe('theme contract (spec §6, R11)', () => {
  const required = requiredTokens();

  it('declares a non-empty required token list', () => {
    expect(required.length).toBeGreaterThan(0);
  });

  it.each(themeFiles())('%s defines every required token', (file) => {
    const css = readFileSync(join(STYLES, 'themes', file), 'utf8');
    const defined = new Set([...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map((m) => m[1] as string));
    const missing = required.filter((token) => !defined.has(token));
    expect(missing, `${file} is missing tokens`).toEqual([]);
  });

  it.each(themeFiles())('%s scopes every declaration under a [data-theme] selector', (file) => {
    const css = readFileSync(join(STYLES, 'themes', file), 'utf8');
    // A theme must not declare tokens on :root, or it would leak to other routes.
    expect(css).not.toMatch(/^\s*:root\s*[,{]/m);
    expect(css).toMatch(/\[data-theme=['"][a-z0-9-]+['"]\]/);
  });
});
