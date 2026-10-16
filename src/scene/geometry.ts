// 断面図の座標系（1m = 25px）。画像に差し替える場合も同じ 2000x1500（4:3）を前提にする。
export const W = 2000;
export const H = 1500;
export const GROUND = 1180; // GL（1F床）
export const FLOOR_H = 100; // 階高 4m
export const SLAB_T = 8;
export const BX0 = 520; // 建物の左外面
export const BX1 = 1320; // 建物の右外面
export const B1_FLOOR = 1305;
export const PIT_BOTTOM = 1362;
export const EXC_BOTTOM = 1374;
export const EXC_X0 = 472;
export const EXC_X1 = 1368;
export const COL_W = 24;
export const COLS = [520, 708, 908, 1108, 1296];
export const BAYS: [number, number][] = [
  [544, 708],
  [732, 908],
  [932, 1108],
];
// コア：便所 1132-1180 / PS 1182-1206 / EVシャフト 1214-1288
export const SHAFT: [number, number] = [1214, 1288];
export const PS: [number, number] = [1182, 1206];
export const SCAFFOLD_L: [number, number] = [488, 512];
export const SCAFFOLD_R: [number, number] = [1328, 1352];

/** n階の床（スラブ上面）の y。n=11 は屋上。 */
export const floorY = (n: number) => GROUND - (n - 1) * FLOOR_H;
/** n階の天井面の y（天井高 2.8m） */
export const ceilingY = (n: number) => floorY(n) - 70;
/** n階の天井裏の上端（上階スラブ下面） */
export const plenumTop = (n: number) => floorY(n + 1) + SLAB_T;
/** 外部足場の k 段目の作業床の y（1段 1.8m） */
export const liftY = (k: number) => GROUND - 45 * k;
