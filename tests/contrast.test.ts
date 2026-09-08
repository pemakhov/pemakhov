import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const THEMES = new URL('../src/styles/themes/', import.meta.url).pathname;

/**
 * Spec §7: "contrast AA on body text with both token sets."
 * AA for normal-size text is 4.5:1. These pairs are the ones that actually
 * carry text in the shell — see src/styles/shell.css.
 */
const PAIRS: Array<[fg: string, bg: string, what: string]> = [
  ['--ink', '--bg', 'body text on the page ground'],
  ['--ink', '--surface', 'body text on a raised surface'],
  ['--ink-secondary', '--bg', 'de-emphasised text'],
  ['--accent', '--bg', 'the accent used as annotation text'],
  ['--accent-contrast', '--accent', 'the CTA label on its accent fill'],
];

const AA_NORMAL = 4.5;

function tokens(css: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const m of css.matchAll(/^\s*(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/gm)) {
    map.set(m[1] as string, m[2] as string);
  }
  return map;
}

function channels(hex: string): [number, number, number] {
  const h = hex.slice(1);
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = Number.parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex).map((c) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const x = relativeLuminance(a);
  const y = relativeLuminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const themeFiles = readdirSync(THEMES).filter((f) => f.endsWith('.css'));

describe('WCAG AA contrast for every theme (spec §7)', () => {
  it.each(themeFiles)('%s meets AA on every text pair', (file) => {
    const declared = tokens(readFileSync(join(THEMES, file), 'utf8'));
    const failures: string[] = [];

    for (const [fgToken, bgToken, what] of PAIRS) {
      const fg = declared.get(fgToken);
      const bg = declared.get(bgToken);
      // Tokens defined as var() aliases are covered by their source token.
      if (!fg || !bg) continue;
      const ratio = contrast(fg, bg);
      if (ratio < AA_NORMAL) {
        failures.push(`${what}: ${fgToken} ${fg} on ${bgToken} ${bg} = ${ratio.toFixed(2)}:1`);
      }
    }

    expect(failures, `${file} below ${AA_NORMAL}:1`).toEqual([]);
  });

  it('resolves at least four literal pairs per theme (the parser still works)', () => {
    for (const file of themeFiles) {
      const declared = tokens(readFileSync(join(THEMES, file), 'utf8'));
      const resolved = PAIRS.filter(([f, b]) => declared.has(f) && declared.has(b));
      expect(resolved.length, `${file} resolved too few pairs`).toBeGreaterThanOrEqual(4);
    }
  });
});
