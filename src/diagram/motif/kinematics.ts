/**
 * Pure geometry: params → drawable paths and points. No DOM.
 *
 * The motif is a stack of coaxial cylinders seen from slightly above. A circle
 * of radius r perpendicular to the axis projects to an ellipse with rx = r and
 * ry = r · pitch, so "pitch" is the only camera parameter: 0 is side-on, 1 is
 * looking straight down the axis. The whole drawing is then scaled, rotated by
 * `tilt` and placed at (cx, cy).
 *
 * At pitch 0 every ellipse collapses to a line (SVG draws a zero-radius arc as
 * a straight segment), so the same paths become flat boxes on a line. With
 * `uniform` at 1 the boxes share one size. That is how the mechanism turns into
 * a system diagram without swapping drawings: it is the same anchors, seen
 * side-on (R12).
 *
 * Draw order is fixed and returned in order. Parts are filled with the node
 * fill, so painting bottom-to-top gives correct occlusion for a camera above
 * the stack without any depth sorting.
 */

import { PARTS, SHAFT_OVERHANG, SHAFT_RADIUS, UNIFORM_H, UNIFORM_R, type Part } from './anchors';

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
  /** 0 = true part sizes, 1 = every part the same box. */
  uniform: number;
  /** Visibility of part detail (teeth, rings, holes), 0–1. */
  detail: number;
  /** Where the axis centre sits in the viewBox, and the drawing's scale. */
  cx: number;
  cy: number;
  scale: number;
  /** Per-part lateral offset off the axis, in PARTS order. */
  shift: readonly number[];
}

export const DEFAULT_PARAMS: Readonly<MotifParams> = {
  pitch: 0.3,
  tilt: 0,
  spread: 0,
  phase: 0,
  uniform: 0,
  detail: 1,
  cx: CENTER,
  cy: CENTER,
  scale: 1,
  shift: [],
};

export type DrawClass = 'dg-body' | 'dg-detail' | 'dg-shaft';

export interface DrawItem {
  /** Stable across every frame — the renderer keys DOM nodes by it. */
  key: string;
  cls: DrawClass;
  d: string;
  /** Index into PARTS for bodies, so a scene can mark a part fault/active. */
  part?: number;
}

export interface Point {
  x: number;
  y: number;
}

/** A part as placed for one frame, in the stack's local frame (axis = y). */
export interface PlacedPart {
  part: Part;
  r: number;
  h: number;
  top: number;
  x: number;
}

/* --- Numbers ---------------------------------------------------------------- */

/** One decimal is sub-pixel at any realistic size and keeps paths short. */
export const f = (n: number): string => (Math.round(n * 10) / 10).toString();

export const clamp01 = (n: number): number => Math.min(1, Math.max(0, n));

/** 0 before `start`, 1 after `end`, linear between. */
export const ramp = (t: number, start: number, end: number): number =>
  clamp01((t - start) / (end - start));

export const easeInOut = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;

export const easeOut = (x: number): number => 1 - (1 - x) ** 3;

export const lerp = (a: number, b: number, x: number): number => a + (b - a) * x;

/* --- Primitive shapes, in the stack's local frame --------------------------- */

/** Outline of a solid cylinder: back half of the top rim, sides, front half of the bottom rim. */
function cylinderBody(cx: number, r: number, ry: number, top: number, h: number): string {
  const bottom = top + h;
  return (
    `M${f(cx - r)} ${f(top)}A${f(r)} ${f(ry)} 0 0 1 ${f(cx + r)} ${f(top)}` +
    `L${f(cx + r)} ${f(bottom)}A${f(r)} ${f(ry)} 0 0 1 ${f(cx - r)} ${f(bottom)}Z`
  );
}

/** Full ellipse centred at (cx, y). */
function ring(r: number, ry: number, y: number, cx: number): string {
  return (
    `M${f(cx - r)} ${f(y)}A${f(r)} ${f(ry)} 0 1 0 ${f(cx + r)} ${f(y)}` +
    `A${f(r)} ${f(ry)} 0 1 0 ${f(cx - r)} ${f(y)}`
  );
}

/** Front (visible) half of a rim at height y. */
function frontArc(cx: number, r: number, ry: number, y: number): string {
  return `M${f(cx - r)} ${f(y)}A${f(r)} ${f(ry)} 0 0 0 ${f(cx + r)} ${f(y)}`;
}

function partDetail(placed: PlacedPart, pitch: number, phase: number): string {
  const { part, r, h, top, x: cx } = placed;
  const ry = r * pitch;
  const count = part.count ?? 0;
  const angle = phase * (part.spin ?? 0);
  const circle = (radius: number, y: number, x = cx): string => ring(radius, radius * pitch, y, x);
  let d = ring(r, ry, top, cx);

  switch (part.kind) {
    case 'disc':
      d += circle(r * 0.36, top);
      break;

    case 'bearing': {
      const inner = r * 0.52;
      const mid = (r * 0.86 + inner) / 2;
      const ball = (r * 0.86 - inner) / 2 - 3;
      d += circle(r * 0.86, top) + circle(inner, top);
      for (let i = 0; i < count; i++) {
        const a = angle + (i * TAU) / count;
        d += circle(ball, top + Math.sin(a) * mid * pitch, cx + Math.cos(a) * mid);
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
        d += `M${f(cx + c * root)} ${f(top + s * root * pitch)}L${f(cx + c * r)} ${f(top + s * ry)}`;
        if (s > 0) d += `M${f(cx + c * r)} ${f(top + s * ry)}L${f(cx + c * r)} ${f(top + h + s * ry)}`;
      }
      d += circle(root, top) + circle(r * 0.3, top);
      break;
    }

    case 'ribbed':
      for (let i = 1; i <= count; i++) d += frontArc(cx, r, ry, top + (h * i) / (count + 1));
      d += circle(r * 0.62, top);
      break;

    case 'flange': {
      const pcd = r * 0.74;
      const hole = r * 0.07;
      for (let i = 0; i < count; i++) {
        const a = (i * TAU) / count + Math.PI / count;
        d += circle(hole, top + Math.sin(a) * pcd * pitch, cx + Math.cos(a) * pcd);
      }
      d += circle(r * 0.4, top);
      break;
    }
  }
  return d;
}

/* --- Layout ------------------------------------------------------------------ */

/** Every part's size and position for one frame, with the stack centred on the origin. */
export function placeParts(params: Pick<MotifParams, 'spread' | 'uniform' | 'shift'>): PlacedPart[] {
  const sized = PARTS.map((part) => ({
    part,
    r: lerp(part.r, UNIFORM_R, params.uniform),
    h: lerp(part.h, UNIFORM_H, params.uniform),
  }));
  const length = sized.reduce((sum, p) => sum + p.h, 0) + params.spread * (PARTS.length - 1);
  let y = -length / 2;
  return sized.map((p, i) => {
    const placed = { ...p, top: y, x: params.shift[i] ?? 0 };
    y += p.h + params.spread;
    return placed;
  });
}

/**
 * The full drawing for one set of params, in paint order.
 * Shaft segments are interleaved so each one sits in front of the part below
 * it and behind the part above it. The shaft stays on the axis even when a
 * part is shifted off it — that is what a misaligned part looks like.
 */
export function drawList(params: MotifParams): DrawItem[] {
  const { pitch, phase } = params;
  const placed = placeParts(params);
  const shaft = (key: string, from: number, to: number): DrawItem => ({
    key,
    cls: 'dg-shaft',
    d: cylinderBody(0, SHAFT_RADIUS, SHAFT_RADIUS * pitch, from, Math.max(0, to - from)),
  });

  const last = placed.length - 1;
  const bottom = placed[last] as PlacedPart;
  const items: DrawItem[] = [shaft('shaft-bottom', bottom.top, bottom.top + bottom.h + SHAFT_OVERHANG)];

  for (let i = last; i >= 0; i--) {
    const p = placed[i] as PlacedPart;
    items.push(
      { key: `${p.part.id}-body`, cls: 'dg-body', d: cylinderBody(p.x, p.r, p.r * pitch, p.top, p.h), part: i },
      { key: `${p.part.id}-detail`, cls: 'dg-detail', d: partDetail(p, pitch, phase) },
    );
    const above = placed[i - 1];
    if (above) items.push(shaft(`shaft-${i}`, above.top + above.h, p.top));
  }

  const first = placed[0] as PlacedPart;
  items.push(shaft('shaft-top', first.top - SHAFT_OVERHANG, first.top));
  return items;
}

/** The SVG transform that places the local frame in the viewBox. */
export function groupTransform(params: MotifParams): string {
  const scale = params.scale === 1 ? '' : ` scale(${f(params.scale)})`;
  return `translate(${f(params.cx)} ${f(params.cy)}) rotate(${f(params.tilt)})${scale}`;
}

/** Local point → viewBox point, using the same transform as the group. */
export function project(local: Point, params: MotifParams): Point {
  const a = (params.tilt * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const x = local.x * params.scale;
  const y = local.y * params.scale;
  return { x: params.cx + x * c - y * s, y: params.cy + x * s + y * c };
}

/**
 * A point on a part, in viewBox coordinates.
 * `across` runs −1 (left edge) to 1 (right edge); `along` runs 0 (top) to 1 (bottom).
 */
export function partPoint(params: MotifParams, index: number, across: number, along: number): Point {
  const p = placeParts(params)[index];
  if (!p) return { x: params.cx, y: params.cy };
  return project({ x: p.x + across * p.r, y: p.top + along * p.h }, params);
}

/** A point on the shaft axis, `along` from the shaft's top end (0) to bottom end (1). */
export function axisPoint(params: MotifParams, along: number): Point {
  const placed = placeParts(params);
  const first = placed[0] as PlacedPart;
  const last = placed[placed.length - 1] as PlacedPart;
  const top = first.top - SHAFT_OVERHANG;
  const bottom = last.top + last.h + SHAFT_OVERHANG;
  return project({ x: 0, y: lerp(top, bottom, along) }, params);
}
