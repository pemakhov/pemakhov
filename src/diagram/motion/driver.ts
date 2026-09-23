/**
 * The only module that touches scroll.
 *
 * Maps the scroll position through a tall "track" element to t ∈ [0, 1]:
 * t = 0 when the track's top reaches the viewport top, t = 1 when its bottom
 * reaches the viewport bottom. The sticky stage inside the track stays pinned
 * for exactly that distance. At most one `render` per animation frame.
 */

import { clamp01 } from '../motif/kinematics';

export function trackProgress(track: HTMLElement): number {
  const rect = track.getBoundingClientRect();
  const distance = rect.height - window.innerHeight;
  return distance > 0 ? clamp01(-rect.top / distance) : 0;
}

/** Subscribes `render` to scroll and resize. Returns an unsubscribe function. */
export function attachScrollDriver(track: HTMLElement, render: (t: number) => void): () => void {
  let queued = false;
  let last = -1;

  const tick = (): void => {
    queued = false;
    const t = trackProgress(track);
    if (t === last) return;
    last = t;
    render(t);
  };

  const queue = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(tick);
  };

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue, { passive: true });
  tick();

  return () => {
    window.removeEventListener('scroll', queue);
    window.removeEventListener('resize', queue);
  };
}
