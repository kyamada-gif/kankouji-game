import type { WorkerProps } from './Worker';

export type Pose = 'stand' | 'walk' | 'work' | 'reach' | 'signal' | 'carry' | 'crouch' | 'lean' | 'point';
export type Pt = [number, number];
type Limb = [number, number];

// 角度は「真下=0、画面右回り=+」。[上腕/大腿, 前腕/下腿]
export const POSES: Record<Pose, { aL: Limb; aR: Limb; lL: Limb; lR: Limb }> = {
  stand: { aL: [-7, -3], aR: [7, 3], lL: [-3, -1], lR: [3, 1] },
  walk: { aL: [-16, -4], aR: [14, 32], lL: [-12, -3], lR: [10, 20] },
  work: { aL: [-12, 45], aR: [12, -45], lL: [-6, -2], lR: [6, 2] },
  reach: { aL: [-162, -178], aR: [158, 175], lL: [-4, -1], lR: [4, 1] },
  signal: { aL: [-7, -3], aR: [128, 155], lL: [-4, -1], lR: [4, 1] },
  carry: { aL: [-150, -210], aR: [150, 210], lL: [-8, -2], lR: [8, 2] },
  crouch: { aL: [-25, 40], aR: [25, -40], lL: [-50, 20], lR: [50, -20] },
  lean: { aL: [-30, -15], aR: [30, 15], lL: [-5, -2], lR: [5, 2] },
  point: { aL: [-7, -3], aR: [95, 90], lL: [-4, -1], lR: [4, 1] },
};

export const rad = (d: number) => (d * Math.PI) / 180;
export const seg = (p: Pt, len: number, a: number): Pt => [p[0] + len * Math.sin(rad(a)), p[1] + len * Math.cos(rad(a))];
export const line = (...pts: Pt[]) => 'M' + pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' L');
export const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

export function skeleton(pose: Pose) {
  const P = POSES[pose];
  const hipL: Pt = [-8.5, -92];
  const hipR: Pt = [8.5, -92];
  const kneeL = seg(hipL, 44, P.lL[0]);
  const footL = seg(kneeL, 43, P.lL[1]);
  const kneeR = seg(hipR, 44, P.lR[0]);
  const footR = seg(kneeR, 43, P.lR[1]);
  const dy = -Math.max(footL[1], footR[1]);
  const shL: Pt = [-16.5, -140];
  const shR: Pt = [16.5, -140];
  const elL = seg(shL, 29, P.aL[0]);
  const hdL = seg(elL, 26, P.aL[1]);
  const elR = seg(shR, 29, P.aR[0]);
  const hdR = seg(elR, 26, P.aR[1]);
  return { hipL, hipR, kneeL, footL, kneeR, footR, dy, shL, shR, elL, hdL, elR, hdR };
}

export type Anchor = 'helmet' | 'chin' | 'eyes' | 'chest' | 'waist' | 'hook' | 'armband' | 'hand' | 'feet';

/** 人物の部位のシーン座標（拡大図の引き出し線に使う） */
export function workerAnchor(p: Pick<WorkerProps, 'x' | 'y' | 'pose' | 'flip' | 's' | 'harness'>, a: Anchor): [number, number] {
  const k = skeleton(p.pose ?? 'stand');
  const s = p.s ?? 0.25;
  const dir = p.flip ? -1 : 1;
  const local: Record<Anchor, Pt> = {
    helmet: [0, -172],
    chin: [0, -146],
    eyes: [0, -159],
    chest: [0, -122],
    waist: [0, -94],
    hook: p.harness === 'unhooked' ? [22, -96] : [0, -137],
    armband: lerp(k.shL, k.elL, 0.45),
    hand: k.hdR,
    feet: [0, -k.dy],
  };
  const [lx, ly] = local[a];
  return [p.x + lx * s * dir, p.y + (ly + k.dy) * s];
}
