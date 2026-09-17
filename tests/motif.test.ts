import { describe, expect, it } from 'vitest';
import { PARTS } from '../src/diagram/motif/anchors';
import { drawList, partTops } from '../src/diagram/motif/kinematics';
import { evaluate, partialPolyline, STATIC_T } from '../src/diagram/storyboard/hero';

const SAMPLES = Array.from({ length: 41 }, (_, i) => i / 40);

describe('motif geometry (R12)', () => {
  it('renders the same keys in the same order at every t', () => {
    const keys = (t: number) => drawList(evaluate(t).params).map((item) => item.key);
    const reference = keys(0);
    for (const t of SAMPLES) expect(keys(t)).toEqual(reference);
  });

  it('never emits NaN or Infinity into a path', () => {
    for (const t of SAMPLES) {
      const frame = evaluate(t);
      for (const item of drawList(frame.params)) expect(item.d).not.toMatch(/NaN|Infinity/);
      for (const c of frame.callouts) expect(c.d).not.toMatch(/NaN|Infinity/);
    }
  });

  it('keeps parts in axial order with no overlap', () => {
    for (const spread of [0, 30, 72]) {
      const tops = partTops(spread);
      PARTS.forEach((part, i) => {
        const next = tops[i + 1];
        if (next !== undefined) expect(next).toBeCloseTo((tops[i] ?? 0) + part.h + spread);
      });
    }
  });
});

describe('hero storyboard', () => {
  it('starts and ends assembled, with no callouts showing', () => {
    for (const t of [0, 1]) {
      const frame = evaluate(t);
      expect(frame.params.spread).toBe(0);
      expect(frame.callouts.every((c) => c.progress === 0)).toBe(true);
    }
  });

  it('is stateless: scrubbing backwards gives the same frame', () => {
    const forward = evaluate(0.6);
    evaluate(0.9);
    evaluate(0.1);
    expect(evaluate(0.6)).toEqual(forward);
  });

  it('shows the reduced-motion frame fully apart with every part named (R16)', () => {
    const frame = evaluate(STATIC_T);
    expect(frame.params.spread).toBeGreaterThan(0);
    expect(frame.callouts.every((c) => c.progress === 1)).toBe(true);
  });

  it('has one callout per part', () => {
    expect(evaluate(0.5).callouts.map((c) => c.id)).toEqual(PARTS.map((p) => p.id));
  });
});

describe('partialPolyline', () => {
  const line = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];

  it('stops at the right point along the length', () => {
    expect(partialPolyline(line, 0)).toBe('M0 0');
    expect(partialPolyline(line, 0.25)).toBe('M0 0L5 0');
    expect(partialPolyline(line, 0.75)).toBe('M0 0L10 0L10 5');
    expect(partialPolyline(line, 1)).toBe('M0 0L10 0L10 10');
  });
});
