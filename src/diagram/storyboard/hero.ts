/**
 * Hero scene: the motif seen end-on like a dial, tipping over, coming apart so
 * each part can be named, then reassembling.
 *
 *   t 0.00–0.35  pitch drops from end-on to three-quarter view
 *   t 0.05–0.40  drawing tilts left
 *   t 0.15–0.45  parts separate along the shaft
 *   t 0.42–0.75  callouts draw in, one part at a time
 *   t 0.55–1.00  drawing swings right, pitch opens slightly
 *   t 0.80–0.88  callouts retract
 *   t 0.84–1.00  parts close back up
 *   t 0.00–1.00  the drive turns throughout
 */

import { PARTS } from '../motif/anchors';
import { lerp, partAnchors, ramp, type MotifParams, type Point } from '../motif/kinematics';
import { sample, type Segment } from './table';

const easeOut = (x: number): number => 1 - (1 - x) ** 3;

export const HERO_TABLE = {
  pitch: [
    { window: [0, 0.35], from: 0.92, to: 0.3 },
    { window: [0.55, 1], from: 0.3, to: 0.42 },
  ],
  tilt: [
    { window: [0.05, 0.4], from: 0, to: -34 },
    { window: [0.55, 1], from: -34, to: 26 },
  ],
  spread: [
    { window: [0.15, 0.45], from: 0, to: 72 },
    { window: [0.84, 1], from: 72, to: 0 },
  ],
  phase: [{ window: [0, 1], from: 0, to: Math.PI * 6, ease: (x: number) => x }],
} satisfies Record<keyof MotifParams, Segment[]>;

const CALLOUT_START = 0.42;
const CALLOUT_STAGGER = 0.05;
const CALLOUT_DURATION = 0.08;
const CALLOUT_RETRACT: readonly [number, number] = [0.8, 0.88];

/** The frame reduced motion shows: fully apart, every part named. */
export const STATIC_T = 0.78;

/* --- Callout layout (viewBox units) ---------------------------------------
   Even-index parts are labelled top-right, odd-index parts bottom-left, the
   way a drawing keeps its notes clear of the part. The note text sits on top
   of the leader's horizontal run, flush with its outer end. */
const ROW = 50;
const TEXT_RAISE = 10;
const RIGHT = { edge: 960, elbow: 700, firstRow: 96 };
const LEFT = { edge: 40, elbow: 300, lastRow: 944 };

export interface CalloutFrame {
  id: string;
  label: string;
  /** 0 hidden, 1 fully drawn. */
  progress: number;
  /** Leader line anchor → elbow → label, drawn up to `progress` of its length. */
  d: string;
  textX: number;
  textY: number;
  anchor: 'start' | 'end';
}

export interface HeroFrame {
  params: MotifParams;
  callouts: CalloutFrame[];
}

const f = (n: number): string => (Math.round(n * 10) / 10).toString();

/** The first `progress` (0–1) of a polyline, as a path. */
export function partialPolyline(points: readonly Point[], progress: number): string {
  const [first, ...rest] = points;
  if (!first) return '';
  const lengths = rest.map((p, i) => {
    const prev = points[i] as Point;
    return Math.hypot(p.x - prev.x, p.y - prev.y);
  });
  let remaining = lengths.reduce((a, b) => a + b, 0) * progress;
  let d = `M${f(first.x)} ${f(first.y)}`;
  for (let i = 0; i < rest.length && remaining > 0; i++) {
    const from = points[i] as Point;
    const to = rest[i] as Point;
    const len = lengths[i] ?? 0;
    const x = len === 0 ? 1 : Math.min(1, remaining / len);
    d += `L${f(lerp(from.x, to.x, x))} ${f(lerp(from.y, to.y, x))}`;
    remaining -= len;
  }
  return d;
}

export function evaluate(t: number): HeroFrame {
  const params: MotifParams = {
    pitch: sample(HERO_TABLE.pitch, t),
    tilt: sample(HERO_TABLE.tilt, t),
    spread: sample(HERO_TABLE.spread, t),
    phase: sample(HERO_TABLE.phase, t),
  };

  const anchors = partAnchors(params);
  const retract = 1 - ramp(t, CALLOUT_RETRACT[0], CALLOUT_RETRACT[1]);
  const rightCount = Math.ceil(PARTS.length / 2);

  const callouts = PARTS.map((part, i): CalloutFrame => {
    const start = CALLOUT_START + i * CALLOUT_STAGGER;
    const progress = easeOut(ramp(t, start, start + CALLOUT_DURATION)) * retract;
    const anchor = anchors[i] ?? { x: 0, y: 0 };
    const row = Math.floor(i / 2);

    const right = i % 2 === 0;
    const side = right ? RIGHT : LEFT;
    const y = right ? RIGHT.firstRow + row * ROW : LEFT.lastRow - (rightCount - 1 - row) * ROW;
    return {
      id: part.id,
      label: part.label,
      progress,
      d: partialPolyline([anchor, { x: side.elbow, y }, { x: side.edge, y }], progress),
      textX: side.edge,
      textY: y - TEXT_RAISE,
      anchor: right ? 'end' : 'start',
    };
  });

  return { params, callouts };
}
