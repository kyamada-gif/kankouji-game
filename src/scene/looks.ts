import type { WorkerLook } from './Worker';

// 職種ごとの見た目（色はおおよその傾向。実際の現場・会社で異なる）
const WHITE = '#f2f1ec';
const YELLOW = '#e3bf3a';

export const LOOK = {
  gc: { jacket: '#6c7b88', helmet: WHITE, helmetLine: '#2f8a4a', sticker: '#2f8a4a' },
  gcSafety: { jacket: '#6c7b88', helmet: WHITE, helmetLine: '#2f8a4a', sticker: '#2f8a4a', armband: '#2f8a4a' },
  mech: { jacket: '#2f3f5a', helmet: WHITE, helmetLine: '#2e63c8', sticker: '#2e63c8' },
  tobi: { jacket: '#2a2c31', pants: '#6a6452', nikka: true, helmet: WHITE, sticker: '#b23a33', harness: 'hooked' },
  rebar: { jacket: '#77704f', helmet: YELLOW, sticker: '#3b3b3b' },
  carpenter: { jacket: '#4c4f55', pants: '#3e4045', helmet: WHITE, sticker: '#c27b2a' },
  doko: { jacket: '#6b5d48', pants: '#5a4e3d', helmet: YELLOW, sticker: '#3b6ea8' },
  plumber: { jacket: '#33485e', helmet: YELLOW, sticker: '#2e63c8' },
  duct: { jacket: '#5b636b', helmet: YELLOW, sticker: '#7a7f84' },
  insulation: { jacket: '#6b6f5b', helmet: YELLOW, sticker: '#9a8b4a' },
  elec: { jacket: '#4f6f8f', helmet: YELLOW, sticker: '#e3bf3a' },
  interior: { jacket: '#8a7f69', helmet: WHITE, sticker: '#8a5a3a' },
  paint: { jacket: '#cfccc2', pants: '#bdb9ae', helmet: WHITE, sticker: '#5a8a5a' },
  waterproof: { jacket: '#4d5a4a', helmet: YELLOW, sticker: '#2f2f2f' },
  fire: { jacket: '#5a3a3a', helmet: WHITE, sticker: '#c62f2a' },
  ev: { jacket: '#3d4652', helmet: WHITE, sticker: '#6a8fb0' },
  guard: { jacket: '#22304d', pants: '#22304d', helmet: WHITE, helmetLine: '#2e63c8', vest: true, gloves: true },
  inspector: { jacket: '#3c3f45', helmet: WHITE, helmetLine: '#b23a33' },
  elecSv: { jacket: '#3f5368', helmet: WHITE, sticker: '#e3bf3a' },
  sash: { jacket: '#5a6470', helmet: YELLOW, sticker: '#7a8a9a' },
  plasterer: { jacket: '#7d7a70', helmet: YELLOW, sticker: '#6a5a4a' },
  cleaner: { jacket: '#4c6a7a', helmet: WHITE, sticker: '#4c9a8a' },
  furniture: { jacket: '#6a6a72', helmet: WHITE, sticker: '#8a6a9a' },
  foremanBand: '#c8322b',
} satisfies Record<string, WorkerLook | string>;
