import type { Actor } from '../data/actors';
import type { Mark } from '../types';
import { workerAnchor } from './workerGeom';

/** 人物の当たり判定の枠（シーン座標） */
export function actorBox(a: Actor) {
  if (!a.worker) {
    const [x, y] = a.cab!;
    return { x0: x - 22, x1: x + 22, y0: y - 22, y1: y + 22, cx: x, cy: y, top: y - 14 };
  }
  const [hx, hy] = workerAnchor(a.worker, 'helmet');
  const [, fy] = workerAnchor(a.worker, 'feet');
  return { x0: hx - 14, x1: hx + 14, y0: hy - 4, y1: fy + 3, cx: hx, cy: (hy + fy) / 2, top: hy };
}

export function hitActor(actors: Actor[], x: number, y: number) {
  return (
    actors
      .map((a) => ({ a, b: actorBox(a) }))
      .filter(({ b }) => x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1)
      .sort((p, q) => Math.hypot(p.b.cx - x, p.b.cy - y) - Math.hypot(q.b.cx - x, q.b.cy - y))[0]?.a ?? null
  );
}

export function resolveMark(m: Mark, actors: Actor[]): [number, number] | null {
  if (m.actor) {
    const a = actors.find((x) => x.id === m.actor);
    if (!a) return null;
    if (!a.worker) return a.cab!;
    return workerAnchor(a.worker, m.at ?? 'chest');
  }
  if (m.x !== undefined && m.y !== undefined) return [m.x, m.y];
  return null;
}
