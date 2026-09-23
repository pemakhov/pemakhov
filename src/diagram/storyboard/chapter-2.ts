/**
 * Chapter 2 — full-stack web (§3.2). The same mechanism turned side-on until
 * each part is a box and the shaft is a line: a system diagram. A request
 * travels the path, stalls at one service, is re-routed round it, completes.
 * Narration is an issue title (R13).
 *
 *   t 0.00–0.25  mechanism → system: pitch to 0, parts to one box size
 *   t 0.18–0.30  service names appear
 *   t 0.30–0.48  request travels down to the integrations box
 *   t 0.48–1.00  that box is the fault (it stays broken — chapter 3 fixes it)
 *   t 0.50–0.60  issue tag and caption
 *   t 0.58–0.72  re-route draws round the stalled box
 *   t 0.70–0.90  request continues along the re-route to the end
 *   t 0.90–1.00  last box lights: done
 */

import { chapter2Scene as copy } from '../../content/home';
import { PARTS } from '../motif/anchors';
import { axisPoint, easeInOut, easeOut, partPoint, ramp, type MotifParams, type Point } from '../motif/kinematics';
import { DRAWING_POSE } from './chapter-1';
import {
  circlePath,
  leader,
  partialPolyline,
  pointAlong,
  pulse,
  TAG_RAISE,
  type MarkState,
  type Scene,
  type SceneFrame,
  type Tag,
} from './scene';
import { sample } from './table';

const index = (id: string): number => PARTS.findIndex((p) => p.id === id);
const STALL = index('housing');
const BEFORE = index('gear');
const AFTER = index('pinion');
const LAST = PARTS.length - 1;

/** The pose this chapter settles into, and that chapter 3 starts from. */
export const SYSTEM_POSE: MotifParams = {
  ...DRAWING_POSE,
  pitch: 0,
  uniform: 1,
  detail: 0,
  spread: 44,
};

/** Service names, centred in each box of a side-on pose. */
export function serviceTags(pose: MotifParams, opacity: number): Tag[] {
  return PARTS.map((part, i) => {
    const c = partPoint(pose, i, 0, 0.5);
    return {
      key: `service-${part.id}`,
      text: copy.services[part.id as keyof typeof copy.services] ?? part.label,
      x: c.x,
      y: c.y + 8,
      anchor: 'middle',
      opacity,
    };
  });
}

const DETOUR = 70;
const DOT_R = 11;

function evaluate(t: number): SceneFrame {
  const morph = easeInOut(ramp(t, 0, 0.25));
  const motif: MotifParams = {
    ...DRAWING_POSE,
    pitch: sample([{ window: [0, 0.25], from: DRAWING_POSE.pitch, to: 0 }], t),
    uniform: morph,
    detail: 1 - ramp(t, 0, 0.14),
    spread: sample([{ window: [0, 0.25], from: DRAWING_POSE.spread, to: SYSTEM_POSE.spread }], t),
    phase: DRAWING_POSE.phase,
  };

  const partState: MarkState[] = PARTS.map((_, i) => {
    if (i === STALL && t >= 0.48) return 'fault';
    if (i === LAST && t >= 0.9) return 'active';
    return null;
  });
  const frame: SceneFrame = { motif, partState, marks: [], tags: [], captions: [] };

  // Placed against the final pose so the names land where the boxes end up.
  frame.tags.push(...serviceTags(SYSTEM_POSE, ramp(t, 0.18, 0.3)));

  /* The request. Leg 1 runs down the axis to the stalled box; leg 2 backs up
     to the box above, goes round the stall and rejoins below. It travels on
     the axis between boxes, so it never rests on a service name. */
  const stallTop = partPoint(motif, STALL, 0, 0);
  const leg1: Point[] = [axisPoint(motif, 0), stallTop];
  const beforeBottom = partPoint(motif, BEFORE, 0, 1);
  const beforeEdge = partPoint(motif, BEFORE, 1, 0.5);
  const afterEdge = partPoint(motif, AFTER, 1, 0.5);
  const detour: Point[] = [
    beforeEdge,
    { x: beforeEdge.x + DETOUR, y: beforeEdge.y },
    { x: afterEdge.x + DETOUR, y: afterEdge.y },
    afterEdge,
  ];
  const leg2: Point[] = [
    stallTop,
    beforeBottom,
    ...detour,
    partPoint(motif, AFTER, 0, 1),
    axisPoint(motif, 1),
  ];

  const travel1 = easeInOut(ramp(t, 0.3, 0.48));
  const travel2 = easeInOut(ramp(t, 0.7, 0.9));
  const dot = t < 0.7 ? pointAlong(leg1, travel1) : pointAlong(leg2, travel2);

  frame.marks.push(
    {
      key: 'reroute',
      cls: 'dg-flow',
      d: partialPolyline(detour, easeOut(ramp(t, 0.58, 0.72))),
      opacity: t >= 0.58 ? 1 : 0,
    },
    {
      key: 'request',
      cls: 'dg-dot',
      d: circlePath(dot, DOT_R),
      opacity: pulse(t, 0.28, 0.3),
      state: t >= 0.48 && t < 0.7 ? 'fault' : null,
    },
  );

  /* The issue: a short red tag on the left, the sentence in the notes list. */
  const issue = easeOut(ramp(t, 0.5, 0.6));
  const tagY = partPoint(motif, STALL, 0, 0.5).y - 70;
  frame.marks.push({
    key: 'leader-issue',
    cls: 'dg-leader',
    d: partialPolyline(leader(partPoint(motif, STALL, -1, 0.5), 220, tagY, 60), issue),
    opacity: issue > 0 ? 1 : 0,
    state: 'fault',
  });
  frame.tags.push({
    key: 'tag-issue',
    text: copy.issueTag,
    x: 60,
    y: tagY - TAG_RAISE,
    anchor: 'start',
    opacity: issue,
    tone: 'fault',
  });
  frame.captions.push({ key: 'issue', text: copy.captions.issue, opacity: issue, tone: 'fault' });

  return frame;
}

export const chapter2: Scene = {
  id: 'chapter-2',
  description: copy.description,
  buildT: 1,
  staticT: 1,
  evaluate,
};
