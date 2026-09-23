import { describe, expect, it } from 'vitest';
import { PARTS } from '../src/diagram/motif/anchors';
import { DEFAULT_PARAMS, drawList, placeParts } from '../src/diagram/motif/kinematics';
import { SCENES } from '../src/diagram/storyboard';
import { hero } from '../src/diagram/storyboard/hero';
import { partialPolyline, pointAlong, type SceneFrame } from '../src/diagram/storyboard/scene';

const SAMPLES = Array.from({ length: 81 }, (_, i) => i / 80);
const scenes = Object.values(SCENES);

/** Everything about a frame that must NOT change with t. */
function structure(frame: SceneFrame) {
  return {
    motif: drawList(frame.motif).map((item) => [item.key, item.cls]),
    marks: frame.marks.map((m) => [m.key, m.cls]),
    tags: frame.tags.map((tag) => [tag.key, tag.text, tag.tone ?? null]),
    captions: frame.captions.map((c) => [c.key, c.text, c.tone ?? null]),
  };
}

describe('motif geometry (R12)', () => {
  it('keeps parts in axial order with no overlap, at any size', () => {
    for (const uniform of [0, 0.5, 1]) {
      for (const spread of [0, 30, 72]) {
        const placed = placeParts({ spread, uniform, shift: [] });
        placed.forEach((p, i) => {
          const next = placed[i + 1];
          if (next) expect(next.top).toBeCloseTo(p.top + p.h + spread);
        });
      }
    }
  });

  it('flattens to boxes side-on: no NaN when every ellipse collapses', () => {
    const d = drawList({ ...DEFAULT_PARAMS, pitch: 0, uniform: 1 }).map((i) => i.d).join('');
    expect(d).not.toMatch(/NaN|Infinity/);
  });
});

describe.each(scenes.map((s) => [s.id, s] as const))('scene %s', (_, scene) => {
  it('has the same structure at every t (the renderer only updates attributes)', () => {
    const reference = structure(scene.evaluate(0));
    for (const t of SAMPLES) expect(structure(scene.evaluate(t))).toEqual(reference);
  });

  it('draws every part of the motif, in order (R12)', () => {
    const bodies = drawList(scene.evaluate(0.5).motif)
      .filter((item) => item.part !== undefined)
      .map((item) => item.part);
    expect(bodies).toEqual([...PARTS.keys()].reverse());
  });

  it('never emits NaN or Infinity', () => {
    for (const t of SAMPLES) {
      const frame = scene.evaluate(t);
      const paths = [...drawList(frame.motif), ...frame.marks].map((i) => i.d).join('');
      expect(paths).not.toMatch(/NaN|Infinity/);
      const numbers = [
        ...Object.values(frame.motif).filter((v) => typeof v === 'number'),
        ...frame.tags.flatMap((tag) => [tag.x, tag.y, tag.opacity]),
        ...frame.marks.map((m) => m.opacity),
        ...frame.captions.map((c) => c.opacity),
      ];
      expect(numbers.every(Number.isFinite), `t=${t}`).toBe(true);
    }
  });

  it('keeps every opacity within 0–1', () => {
    for (const t of SAMPLES) {
      const frame = scene.evaluate(t);
      for (const item of [...frame.marks, ...frame.tags, ...frame.captions]) {
        expect(item.opacity).toBeGreaterThanOrEqual(0);
        expect(item.opacity).toBeLessThanOrEqual(1);
      }
    }
  });

  it('is stateless: scrubbing backwards gives the same frame', () => {
    const forward = scene.evaluate(0.6);
    scene.evaluate(0.95);
    scene.evaluate(0.05);
    expect(scene.evaluate(0.6)).toEqual(forward);
  });

  it('has a static frame that shows all its narration (R16)', () => {
    const frame = scene.evaluate(scene.staticT);
    for (const tag of frame.tags) expect(tag.opacity, tag.key).toBe(1);
    for (const caption of frame.captions) expect(caption.opacity, caption.key).toBe(1);
  });
});

describe('chapters: one problem and one fix each (R13)', () => {
  const chapters = scenes.filter((s) => s.id.startsWith('chapter-'));

  it('there are three', () => {
    expect(chapters.map((s) => s.id)).toEqual(['chapter-1', 'chapter-2', 'chapter-3']);
  });

  it.each(chapters.map((s) => [s.id, s] as const))('%s shows a fault at some point', (_, scene) => {
    const faults = SAMPLES.filter((t) => scene.evaluate(t).partState.includes('fault'));
    expect(faults.length).toBeGreaterThan(0);
  });

  it('chapter 1 and 3 resolve their fault; chapter 2 only routes round it', () => {
    const endsFaulted = (id: string) => SCENES[id]?.evaluate(1).partState.includes('fault');
    expect(endsFaulted('chapter-1')).toBe(false);
    expect(endsFaulted('chapter-2')).toBe(true);
    expect(endsFaulted('chapter-3')).toBe(false);
  });
});

describe('hero', () => {
  it('starts and ends assembled, with no callouts showing', () => {
    for (const t of [0, 1]) {
      const frame = hero.evaluate(t);
      expect(frame.motif.spread).toBe(0);
      expect(frame.tags.every((tag) => tag.opacity === 0)).toBe(true);
    }
  });

  it('is apart in its static frame', () => {
    expect(hero.evaluate(hero.staticT).motif.spread).toBeGreaterThan(0);
  });
});

describe('polyline helpers', () => {
  const line = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];

  it('partialPolyline stops at the right point along the length', () => {
    expect(partialPolyline(line, 0)).toBe('M0 0');
    expect(partialPolyline(line, 0.25)).toBe('M0 0L5 0');
    expect(partialPolyline(line, 0.75)).toBe('M0 0L10 0L10 5');
    expect(partialPolyline(line, 1)).toBe('M0 0L10 0L10 10');
  });

  it('pointAlong agrees with partialPolyline', () => {
    expect(pointAlong(line, 0.25)).toEqual({ x: 5, y: 0 });
    expect(pointAlong(line, 0.75)).toEqual({ x: 10, y: 5 });
    expect(pointAlong(line, 1)).toEqual({ x: 10, y: 10 });
  });
});
