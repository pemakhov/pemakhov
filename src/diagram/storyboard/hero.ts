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

import { heroScene } from '../../content/home';
import { PARTS } from '../motif/anchors';
import { DEFAULT_PARAMS, easeOut, partPoint, ramp, type MotifParams } from '../motif/kinematics';
import { leader, partialPolyline, TAG_RAISE, type Scene, type SceneFrame } from './scene';
import { sample, type Segment } from './table';

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
} satisfies Partial<Record<keyof MotifParams, Segment[]>>;

const CALLOUT_START = 0.42;
const CALLOUT_STAGGER = 0.05;
const CALLOUT_DURATION = 0.08;
const CALLOUT_RETRACT: readonly [number, number] = [0.8, 0.88];

/* --- Callout layout (viewBox units) ---------------------------------------
   Even-index parts are labelled top-right, odd-index parts bottom-left, the
   way a drawing keeps its notes clear of the part. */
const ROW = 50;
const RIGHT = { edge: 960, elbow: 700, firstRow: 96 };
const LEFT = { edge: 40, elbow: 300, lastRow: 944 };

function evaluate(t: number): SceneFrame {
  const motif: MotifParams = {
    ...DEFAULT_PARAMS,
    pitch: sample(HERO_TABLE.pitch, t),
    tilt: sample(HERO_TABLE.tilt, t),
    spread: sample(HERO_TABLE.spread, t),
    phase: sample(HERO_TABLE.phase, t),
  };

  const retract = 1 - ramp(t, CALLOUT_RETRACT[0], CALLOUT_RETRACT[1]);
  const rightCount = Math.ceil(PARTS.length / 2);
  const frame: SceneFrame = { motif, partState: [], marks: [], tags: [], captions: [] };

  PARTS.forEach((part, i) => {
    const start = CALLOUT_START + i * CALLOUT_STAGGER;
    const progress = easeOut(ramp(t, start, start + CALLOUT_DURATION)) * retract;
    const right = i % 2 === 0;
    const side = right ? RIGHT : LEFT;
    const row = Math.floor(i / 2);
    const y = right ? RIGHT.firstRow + row * ROW : LEFT.lastRow - (rightCount - 1 - row) * ROW;
    const anchor = partPoint(motif, i, right ? 1 : -1, 0.5);

    frame.marks.push({
      key: `leader-${part.id}`,
      cls: 'dg-leader',
      d: partialPolyline(leader(anchor, side.elbow, y, side.edge), progress),
      opacity: progress > 0 ? 1 : 0,
    });
    frame.tags.push({
      key: `tag-${part.id}`,
      text: part.label,
      x: side.edge,
      y: y - TAG_RAISE,
      anchor: right ? 'end' : 'start',
      opacity: progress,
    });
  });

  return frame;
}

export const hero: Scene = {
  id: 'hero',
  description: heroScene.description,
  buildT: 0,
  // Fully apart, every part named.
  staticT: 0.78,
  evaluate,
};
