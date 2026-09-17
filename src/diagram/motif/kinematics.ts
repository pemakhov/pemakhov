/**
 * Pure geometry: params → drawable paths and points. No DOM.
 *
 * The motif is a stack of coaxial cylinders seen from slightly above. A circle
 * of radius r perpendicular to the axis projects to an ellipse with rx = r and
 * ry = r · pitch, so "pitch" is the only camera parameter: 0 is side-on, 1 is
 * looking straight down the axis. The whole drawing is then rotated by `tilt`.
 *
 * Draw order is fixed and returned in order. Parts are filled with the node
 * fill, so painting bottom-to-top gives correct occlusion for a camera above
 * the stack without any depth sorting.
 */

import { PARTS, SHAFT_OVERHANG, SHAFT_RADIUS, type Part } from './anchors';

export const VIEWBOX = 1000;
const CENTER = VIEWBOX / 2;
const TAU = Math.PI * 2;

export interface MotifParams {
  /** 0 = side-on, 1 = end-on. */
  pitch: number;
  /** Rotation of the whole drawing, degrees. */
  tilt: number;
  /** Extra axial gap inserted between neighbouring parts. */
  spread: number;
  /** Drive rotation, radians. */
  phase: number;
}

export type DrawClass = 'dg-body' | 'dg-detail' | 'dg-shaft';

export interface DrawItem {
  /** Stable across every frame — the renderer keys DOM nodes by it. */
  key: string;
  cls: DrawClass;
  d: string;
}

export interface Point {
  x: number;
  y: number;
}

/* --- Formatting ----------------------------------------------------------- */

/** One decimal is sub-pixel at any realistic size and keeps paths short. */
const f = (n: number): string => (Math.round(n * 10) / 10).toString();

/* --- Primitive shapes, in the stack's local frame (axis = y) --------------- */

/** Outline of a solid cylinder: back half of the top rim, sides, front half of the bottom rim. */
function cylinderBody(r: number, ry: number, top: number, h: number): string {
  const bottom = top + h;
  return (
    `M${f(-r)} ${f(top)}A${f(r)} ${f(ry)} 0 0 1 ${f(r)} ${f(top)}` +
    `L${f(r)} ${f(bottom)}A${f(r)} ${f(ry)} 0 0 1 ${f(-r)} ${f(bottom)}Z`
  );
}

/** Full ellipse centred on the axis at height y. */
function ring(r: number, ry: number, y: number, cx = 0): string {
  return (
    `M${f(cx - r)} ${f(y)}A${f(r)} ${f(ry)} 0 1 0 ${f(cx + r)} ${f(y)}` +
    `A${f(r)} ${f(ry)} 0 1 0 ${f(cx - r)} ${f(y)}`
  );
}

/** Front (visible) half of a rim at height y. */
function frontArc(r: number, ry: number, y: number): string {
  return `M${f(-r)} ${f(y)}A${f(r)} ${f(ry)} 0 0 0 ${f(r)} ${f(y)}`;
}

function partDetail(part: Part, pitch: number, top: number, phase: number): string {
  const { r, h } = part;
  const ry = r * pitch;
  const count = part.count ?? 0;
  const angle = phase * (part.spin ?? 0);
  let d = ring(r, ry, top);

  switch (part.kind) {
    case 'disc':
      d += ring(r * 0.36, r * 0.36 * pitch, top);
      break;

    case 'bearing': {
      const inner = r * 0.52;
      const mid = (r * 0.86 + inner) / 2;
      const ball = (r * 0.86 - inner) / 2 - 3;
      d += ring(r * 0.86, r * 0.86 * pitch, top) + ring(inner, inner * pitch, top);
      for (let i = 0; i < count; i++) {
        const a = angle + (i * TAU) / count;
        d += ring(ball, ball * pitch, top + Math.sin(a) * mid * pitch, Math.cos(a) * mid);
      }
      break;
    }

    case 'gear': {
      // Teeth: radial ticks on the top face (all visible) and vertical ticks
      // on the side (front half only). Rotating `angle` slides them round.
      const root = r * 0.9;
      for (let i = 0; i < count; i++) {
        const a = angle + (i * TAU) / count;
        const c = Math.cos(a);
        const s = Math.sin(a);
        d += `M${f(c * root)} ${f(top + s * root * pitch)}L${f(c * r)} ${f(top + s * ry)}`;
        if (s > 0) d += `M${f(c * r)} ${f(top + s * ry)}L${f(c * r)} ${f(top + h + s * ry)}`;
      }
      d += ring(root, root * pitch, top) + ring(r * 0.3, r * 0.3 * pitch, top);
      break;
    }

    case 'ribbed':
      for (let i = 1; i <= count; i++) d += frontArc(r, ry, top + (h * i) / (count + 1));
      d += ring(r * 0.62, r * 0.62 * pitch, top);
      break;

    case 'flange': {
      const pcd = r * 0.74;
      const hole = r * 0.07;
      for (let i = 0; i < count; i++) {
        const a = (i * TAU) / count + Math.PI / count;
        d += ring(hole, hole * pitch, top + Math.sin(a) * pcd * pitch, Math.cos(a) * pcd);
      }
      d += ring(r * 0.4, r * 0.4 * pitch, top);
      break;
    }
  }
  return d;
}

/* --- Layout ---------------------------------------------------------------- */

/** Axial top position of every part, with the stack centred on the origin. */
export function partTops(spread: number): number[] {
  const length = PARTS.reduce((sum, p) => sum + p.h, 0) + spread * (PARTS.length - 1);
  const tops: number[] = [];
  let y = -length / 2;
  for (const p of PARTS) {
    tops.push(y);
    y += p.h + spread;
  }
  return tops;
}

/**
 * The full drawing for one set of params, in paint order.
 * Shaft segments are interleaved so each one sits in front of the part below
 * it and behind the part above it.
 */
export function drawList(params: MotifParams): DrawItem[] {
  const { pitch, spread, phase } = params;
  const tops = partTops(spread);
  const shaft = (key: string, from: number, to: number): DrawItem => ({
    key,
    cls: 'dg-shaft',
    d: cylinderBody(SHAFT_RADIUS, SHAFT_RADIUS * pitch, from, Math.max(0, to - from)),
  });

  const last = PARTS.length - 1;
  const lastTop = tops[last] ?? 0;
  const lastPart = PARTS[last] as Part;
  const items: DrawItem[] = [
    shaft('shaft-bottom', lastTop, lastTop + lastPart.h + SHAFT_OVERHANG),
  ];

  for (let i = last; i >= 0; i--) {
    const part = PARTS[i] as Part;
    const top = tops[i] ?? 0;
    items.push(
      { key: `${part.id}-body`, cls: 'dg-body', d: cylinderBody(part.r, part.r * pitch, top, part.h) },
      { key: `${part.id}-detail`, cls: 'dg-detail', d: partDetail(part, pitch, top, phase) },
    );
    if (i > 0) {
      const above = PARTS[i - 1] as Part;
      items.push(shaft(`shaft-${i}`, (tops[i - 1] ?? 0) + above.h, top));
    }
  }

  items.push(shaft('shaft-top', (tops[0] ?? 0) - SHAFT_OVERHANG, tops[0] ?? 0));
  return items;
}

/** The SVG transform that places the local frame in the viewBox. */
export function groupTransform(params: MotifParams): string {
  return `translate(${CENTER} ${CENTER}) rotate(${f(params.tilt)})`;
}

/** Local point → viewBox point, using the same transform as the group. */
export function project(local: Point, tilt: number): Point {
  const a = (tilt * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: CENTER + local.x * c - local.y * s, y: CENTER + local.x * s + local.y * c };
}

/** Where a callout's leader line touches each part: mid-height on its side. */
export function partAnchors(params: MotifParams): Point[] {
  const tops = partTops(params.spread);
  return PARTS.map((part, i) => {
    const side = i % 2 === 0 ? 1 : -1;
    return project({ x: side * part.r, y: (tops[i] ?? 0) + part.h / 2 }, params.tilt);
  });
}

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** 0 before `start`, 1 after `end`, linear between. */
export const ramp = (t: number, start: number, end: number): number =>
  clamp01((t - start) / (end - start));

export const easeInOut = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;

export const lerp = (a: number, b: number, x: number): number => a + (b - a) * x;
