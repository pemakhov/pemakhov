/**
 * Applies a SceneFrame to markup that MotifFigure.astro rendered at build
 * time. Elements are looked up once; each frame only writes attributes,
 * inline opacity and state classes — the frame's structure never changes.
 */

import { drawList, groupTransform } from '../motif/kinematics';
import type { MarkState, Scene } from '../storyboard/scene';

const STATE_CLASSES = { fault: 'is-fault', active: 'is-active' } as const;

function setState(el: Element, state: MarkState | undefined): void {
  el.classList.toggle(STATE_CLASSES.fault, state === 'fault');
  el.classList.toggle(STATE_CLASSES.active, state === 'active');
}

function byData<T extends Element>(root: ParentNode, attr: string): Map<string, T> {
  const map = new Map<string, T>();
  for (const el of root.querySelectorAll<T>(`[data-${attr}]`)) {
    const key = el.getAttribute(`data-${attr}`);
    if (key !== null) map.set(key, el);
  }
  return map;
}

export function mountScene(figure: HTMLElement, scene: Scene): (t: number) => void {
  const group = figure.querySelector<SVGGElement>('[data-motif]');
  const paths = byData<SVGPathElement>(figure, 'key');
  const marks = byData<SVGPathElement>(figure, 'mark');
  const tags = byData<SVGTextElement>(figure, 'tag');
  const captions = byData<HTMLElement>(figure, 'caption');

  return (t: number): void => {
    const frame = scene.evaluate(t);

    if (group) {
      group.setAttribute('transform', groupTransform(frame.motif));
      group.style.setProperty('--dg-detail-opacity', frame.motif.detail.toFixed(3));
    }
    for (const item of drawList(frame.motif)) {
      const el = paths.get(item.key);
      if (!el) continue;
      el.setAttribute('d', item.d);
      if (item.part !== undefined) setState(el, frame.partState[item.part]);
    }
    for (const mark of frame.marks) {
      const el = marks.get(mark.key);
      if (!el) continue;
      el.setAttribute('d', mark.d);
      el.style.opacity = mark.opacity.toFixed(3);
      setState(el, mark.state);
    }
    for (const tag of frame.tags) {
      const el = tags.get(tag.key);
      if (!el) continue;
      el.setAttribute('x', String(tag.x));
      el.setAttribute('y', String(tag.y));
      el.style.opacity = tag.opacity.toFixed(3);
    }
    for (const caption of frame.captions) {
      const el = captions.get(caption.key);
      if (el) el.style.opacity = caption.opacity.toFixed(3);
    }
  };
}
