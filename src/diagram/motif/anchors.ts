/**
 * The motif's ordered part list — the R12 contract.
 *
 * Every frame renders exactly these parts, in exactly this order, so the
 * silhouette stays recognisable and any two frames are equal-length arrays
 * (a morph between them is a plain lerp).
 *
 * STAND-IN MECHANISM. §10.7 is still [decide]: this is a generic shaft stack
 * (cap, bearing, gear, housing, pinion, flange) so the scroll animation can be
 * built now. Swap the geometry here when the real mechanism is chosen; nothing
 * downstream depends on which parts these are, only on the shape of the array.
 *
 * Units are SVG user units in a 1000 × 1000 viewBox. `h` is axial length;
 * parts are listed from the top of the axis to the bottom.
 */

export type PartKind = 'disc' | 'bearing' | 'gear' | 'ribbed' | 'flange';

export interface Part {
  readonly id: string;
  /** Drawing-note label shown on the callout. */
  readonly label: string;
  readonly kind: PartKind;
  /** Outer radius. */
  readonly r: number;
  /** Axial length. */
  readonly h: number;
  /** Gear teeth, bearing balls, flange bolts or housing ribs. */
  readonly count?: number;
  /** Spin direction and ratio relative to the drive; meshing gears alternate. */
  readonly spin?: number;
}

/** Box size every part converges to when the motif is drawn as a system (uniform = 1). */
export const UNIFORM_R = 150;
export const UNIFORM_H = 56;

export const SHAFT_RADIUS = 16;
/** How far the shaft sticks out past the first and last part. */
export const SHAFT_OVERHANG = 44;

export const PARTS: readonly Part[] = [
  { id: 'cap', label: 'Cap', kind: 'disc', r: 84, h: 22 },
  { id: 'bearing', label: 'Bearing', kind: 'bearing', r: 118, h: 34, count: 12, spin: 0.5 },
  { id: 'gear', label: 'Gear', kind: 'gear', r: 172, h: 40, count: 40, spin: 1 },
  { id: 'housing', label: 'Housing', kind: 'ribbed', r: 148, h: 140, count: 7 },
  { id: 'pinion', label: 'Pinion', kind: 'gear', r: 108, h: 30, count: 24, spin: -1.6 },
  { id: 'flange', label: 'Flange', kind: 'flange', r: 190, h: 22, count: 6 },
];
