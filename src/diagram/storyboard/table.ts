/**
 * A storyboard is a table, not a timeline: each row owns a
 * [startProgress, endProgress] window and interpolates inside it. Evaluating
 * the table at any t is stateless, so scrubbing backwards, reduced-motion
 * static frames and build-time stills all come from the same function.
 */

import { easeInOut, lerp, ramp } from '../motif/kinematics';

export interface Segment {
  window: readonly [start: number, end: number];
  from: number;
  to: number;
  ease?: (x: number) => number;
}

/**
 * Value of a channel at t. Segments are listed in time order and must not
 * overlap; before the first window the channel holds its first `from`, and
 * between windows it holds the previous `to`.
 */
export function sample(segments: readonly Segment[], t: number): number {
  const first = segments[0];
  if (!first) return 0;
  let value = first.from;
  for (const seg of segments) {
    const [start, end] = seg.window;
    if (t < start) break;
    const x = ramp(t, start, end);
    value = lerp(seg.from, seg.to, (seg.ease ?? easeInOut)(x));
  }
  return value;
}
