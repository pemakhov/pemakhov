import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const STYLES = new URL('../src/styles/', import.meta.url).pathname;

/** Colour literals: hex, rgb()/rgba(), hsl()/hsla(), and named colours we care about. */
const COLOUR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(|\bhsla?\(|\boklch\(/;

describe('the shell is unthemed (spec §6)', () => {
  it.each(['shell.css', 'reset.css'])('%s contains no colour literals', (file) => {
    const css = readFileSync(new URL(file, `file://${STYLES}`), 'utf8');
    const offenders = css
      .split('\n')
      .map((line, i) => [i + 1, line] as const)
      // Strip comments before testing, so prose may mention a colour.
      .filter(([, line]) => !line.trim().startsWith('*') && !line.trim().startsWith('/*'))
      .filter(([, line]) => COLOUR_LITERAL.test(line));

    expect(
      offenders.map(([n, line]) => `${file}:${n} ${line.trim()}`),
      'the shell must take every colour from a token',
    ).toEqual([]);
  });

  it('shell.css does not hardcode a theme selector', () => {
    const css = readFileSync(new URL('shell.css', `file://${STYLES}`), 'utf8');
    expect(css).not.toMatch(/\[data-theme=/);
  });
});

describe('the theme scope is the body element', () => {
  it('Shell.astro puts data-theme on <body>, not an inner wrapper', () => {
    const shell = readFileSync(new URL('../src/layouts/Shell.astro', import.meta.url).pathname, 'utf8');
    // body carries background, colour and font-family (shell.css). If the theme
    // scope sits on an inner element, those three resolve outside it and silently
    // fall back to browser defaults — a serif page on a white ground.
    expect(shell).toMatch(/<body[^>]*data-theme=\{theme\}/);
  });

  it('Shell.astro imports no theme file (R11)', () => {
    const shell = readFileSync(new URL('../src/layouts/Shell.astro', import.meta.url).pathname, 'utf8');
    expect(shell).not.toMatch(/styles\/themes\//);
  });
});
