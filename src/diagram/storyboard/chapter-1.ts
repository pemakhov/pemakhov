/**
 * Chapter 1 — mechanical design (§3.2). The motif as an assembly drawing.
 * Problem: a part slips off the axis and the drive jams. Fix: it is brought
 * back into line and the drive turns again. Narration is drawing notes (R13).
 *
 *   t 0.05–0.20  overall dimension draws in
 *   t 0.15–0.25  NOTE 1 → gear
 *   t 0.32–0.42  pinion slips off axis; drive stops
 *   t 0.36–0.66  pinion marked as the fault; NOTE 2 → pinion
 *   t 0.56–0.66  pinion brought back into line
 *   t 0.62–0.72  NOTE 3 → pinion; drive turns again
 *   t 0.80–0.90  closing note
 */

import { chapter1Scene as copy } from '../../content/home';
import { PARTS, SHAFT_OVERHANG } from '../motif/anchors';
import {
  DEFAULT_PARAMS,
  easeOut,
  f,
  partPoint,
  placeParts,
  project,
  ramp,
  type MotifParams,
  type Point,
} from '../motif/kinematics';
import {
  between,
  leader,
  partialPolyline,
  pulse,
  TAG_RAISE,
  type MarkState,
  type Scene,
  type SceneFrame,
} from './scene';
import { sample } from './table';

const PINION = PARTS.findIndex((p) => p.id === 'pinion');
const GEAR = PARTS.findIndex((p) => p.id === 'gear');
const SLIP = 72;

/** The pose this chapter holds, and that chapter 2 starts from. */
export const DRAWING_POSE: MotifParams = { ...DEFAULT_PARAMS, pitch: 0.28, spread: 40, scale: 1.12 };

const PHASE = [
  { window: [0, 0.34], from: 0, to: Math.PI, ease: (x: number) => x },
  // Jammed between 0.34 and 0.64: no segment, so the phase holds.
  { window: [0.64, 1], from: Math.PI, to: Math.PI * 2.2, ease: (x: number) => x },
] as const;

const SHIFT = [
  { window: [0.32, 0.42], from: 0, to: SLIP },
  { window: [0.56, 0.66], from: SLIP, to: 0 },
] as const;

function evaluate(t: number): SceneFrame {
  const shift = PARTS.map((_, i) => (i === PINION ? sample(SHIFT, t) : 0));
  const motif: MotifParams = { ...DRAWING_POSE, phase: sample(PHASE, t), shift };
  const partState: MarkState[] = PARTS.map((_, i) =>
    i === PINION && between(t, 0.36, 0.66) ? 'fault' : null,
  );
  const frame: SceneFrame = { motif, partState, marks: [], tags: [], captions: [] };

  /* Overall dimension, left of the widest part: extension lines, then the
     dimension line drawn from the middle outwards, then arrowheads. */
  const placed = placeParts(motif);
  const widest = Math.max(...placed.map((p) => p.r));
  const first = placed[0];
  const last = placed[placed.length - 1];
  if (first && last) {
    const top = first.top - SHAFT_OVERHANG;
    const bottom = last.top + last.h + SHAFT_OVERHANG;
    const dimX = -widest - 64;
    const p = (x: number, y: number): Point => project({ x, y }, motif);
    const a = p(dimX, top);
    const b = p(dimX, bottom);
    const mid = p(dimX, (top + bottom) / 2);
    const drawn = easeOut(ramp(t, 0.05, 0.2));
    const ext = `M${f(p(-24, top).x)} ${f(a.y)}H${f(a.x - 14)}M${f(p(-last.r - 8, bottom).x)} ${f(b.y)}H${f(b.x - 14)}`;
    const arrow = (tip: Point, dir: 1 | -1): string =>
      `M${f(tip.x - 7)} ${f(tip.y + dir * 16)}L${f(tip.x)} ${f(tip.y)}L${f(tip.x + 7)} ${f(tip.y + dir * 16)}`;

    frame.marks.push(
      { key: 'dim-ext', cls: 'dg-dim', d: ext, opacity: ramp(t, 0.05, 0.1) },
      { key: 'dim-up', cls: 'dg-dim', d: partialPolyline([mid, a], drawn), opacity: drawn > 0 ? 1 : 0 },
      { key: 'dim-down', cls: 'dg-dim', d: partialPolyline([mid, b], drawn), opacity: drawn > 0 ? 1 : 0 },
      { key: 'dim-arrows', cls: 'dg-dim', d: arrow(a, 1) + arrow(b, -1), opacity: ramp(t, 0.17, 0.2) },
    );
  }

  /* Notes. A note's leader follows its part as the part moves. */
  const note = (
    key: string,
    label: string,
    from: Point,
    side: 'left' | 'right',
    rowY: number,
    progress: number,
    tone: 'fault' | null = null,
  ): void => {
    const edge = side === 'right' ? 960 : 40;
    const elbow = side === 'right' ? 780 : 220;
    frame.marks.push({
      key: `leader-${key}`,
      cls: 'dg-leader',
      d: partialPolyline(leader(from, elbow, rowY, edge), progress),
      opacity: progress > 0 ? 1 : 0,
    });
    frame.tags.push({
      key: `tag-${key}`,
      text: label,
      x: edge,
      y: rowY - TAG_RAISE,
      anchor: side === 'right' ? 'end' : 'start',
      opacity: progress,
      tone,
    });
  };

  note('note1', 'Note 1', partPoint(motif, GEAR, 1, 0.5), 'right', 150, easeOut(ramp(t, 0.15, 0.25)));
  note('note2', 'Note 2', partPoint(motif, PINION, -1, 0.5), 'left', 860, easeOut(ramp(t, 0.36, 0.46)), 'fault');
  note('note3', 'Note 3', partPoint(motif, PINION, 1, 0.5), 'right', 860, easeOut(ramp(t, 0.62, 0.72)));

  frame.captions.push(
    { key: 'note1', text: copy.captions.note1, opacity: pulse(t, 0.15, 0.25) },
    { key: 'note2', text: copy.captions.note2, opacity: pulse(t, 0.36, 0.46), tone: 'fault' },
    { key: 'note3', text: copy.captions.note3, opacity: pulse(t, 0.62, 0.72) },
    { key: 'closing', text: copy.captions.closing, opacity: pulse(t, 0.8, 0.9) },
  );

  return frame;
}

export const chapter1: Scene = {
  id: 'chapter-1',
  description: copy.description,
  buildT: 1,
  staticT: 1,
  evaluate,
};
