/**
 * What every storyboard returns, and the small helpers they share.
 *
 * A frame is data, not DOM. Its *structure* — which marks, tags and captions
 * exist, their keys, classes and text — must be identical at every t; only
 * geometry, opacity and state change. The renderer builds the elements once
 * at build time and afterwards only updates attributes.
 */

import { f, lerp, ramp, type MotifParams, type Point } from '../motif/kinematics';

/** A drawn element's narrative state. Styled by class, never by attribute. */
export type MarkState = 'fault' | 'active' | null;

/** An SVG path drawn above the motif, in viewBox coordinates. */
export interface Mark {
  key: string;
  cls: string;
  d: string;
  opacity: number;
  state?: MarkState;
}

/** A short SVG label (a part name, "NOTE 2"). Keep it short: it scales with the drawing. */
export interface Tag {
  key: string;
  text: string;
  x: number;
  y: number;
  anchor: 'start' | 'middle' | 'end';
  opacity: number;
  tone?: 'fault' | null;
}

/**
 * A sentence of narration shown in the notes list under the drawing, the way a
 * drawing's general notes sit under its views. HTML, so it stays readable when
 * the drawing is scaled down on a phone.
 */
export interface Caption {
  key: string;
  text: string;
  opacity: number;
  tone?: 'fault' | 'log' | null;
}

export interface SceneFrame {
  motif: MotifParams;
  /** Narrative state per part, in PARTS order. */
  partState: readonly MarkState[];
  marks: Mark[];
  tags: Tag[];
  captions: Caption[];
}

export interface Scene {
  id: string;
  /** Text alternative that states the scene's point (§7). */
  description: string;
  /** The frame rendered into the HTML at build time — what no-JS visitors see. */
  buildT: number;
  /** The frame reduced motion shows: it must tell the whole scene on its own (R16). */
  staticT: number;
  evaluate(t: number): SceneFrame;
}

/* --- Timing helpers --------------------------------------------------------- */

/** Rises over [a, b], holds, falls over [c, d]. Omit c/d to hold to the end. */
export function pulse(t: number, a: number, b: number, c = Infinity, d = Infinity): number {
  return ramp(t, a, b) * (1 - (Number.isFinite(c) ? ramp(t, c, d) : 0));
}

/** True inside [a, b). */
export const between = (t: number, a: number, b: number): boolean => t >= a && t < b;

/* --- Path helpers ------------------------------------------------------------ */

export function polylineLength(points: readonly Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1] as Point;
    const b = points[i] as Point;
    total += Math.hypot(b.x - a.x, b.y - a.y);
  }
  return total;
}

/** The point `progress` (0–1) of the way along a polyline. */
export function pointAlong(points: readonly Point[], progress: number): Point {
  const first = points[0];
  if (!first) return { x: 0, y: 0 };
  let remaining = polylineLength(points) * progress;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1] as Point;
    const b = points[i] as Point;
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (remaining <= len) {
      const x = len === 0 ? 1 : remaining / len;
      return { x: lerp(a.x, b.x, x), y: lerp(a.y, b.y, x) };
    }
    remaining -= len;
  }
  return points[points.length - 1] as Point;
}

/** The first `progress` (0–1) of a polyline, as a path. */
export function partialPolyline(points: readonly Point[], progress: number): string {
  const [first, ...rest] = points;
  if (!first) return '';
  let remaining = polylineLength(points) * progress;
  let d = `M${f(first.x)} ${f(first.y)}`;
  for (let i = 0; i < rest.length && remaining > 0; i++) {
    const from = points[i] as Point;
    const to = rest[i] as Point;
    const len = Math.hypot(to.x - from.x, to.y - from.y);
    const x = len === 0 ? 1 : Math.min(1, remaining / len);
    d += `L${f(lerp(from.x, to.x, x))} ${f(lerp(from.y, to.y, x))}`;
    remaining -= len;
  }
  return d;
}

export function circlePath(c: Point, r: number): string {
  return `M${f(c.x - r)} ${f(c.y)}a${f(r)} ${f(r)} 0 1 0 ${f(r * 2)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-r * 2)} 0`;
}

export function rectPath(x: number, y: number, w: number, h: number): string {
  return `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
}

/** A leader: part point → elbow → horizontal run to the note's outer edge. */
export function leader(from: Point, elbowX: number, rowY: number, edgeX: number): Point[] {
  return [from, { x: elbowX, y: rowY }, { x: edgeX, y: rowY }];
}

/** Text sits this far above its leader's horizontal run. */
export const TAG_RAISE = 10;
