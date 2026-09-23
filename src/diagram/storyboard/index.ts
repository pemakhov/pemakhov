/** Every Home scene, by the id the markup carries in `data-scene`. */

import { chapter1 } from './chapter-1';
import { chapter2 } from './chapter-2';
import { chapter3 } from './chapter-3';
import { hero } from './hero';
import type { Scene } from './scene';

export const SCENES: Readonly<Record<string, Scene>> = Object.fromEntries(
  [hero, chapter1, chapter2, chapter3].map((scene) => [scene.id, scene]),
);
