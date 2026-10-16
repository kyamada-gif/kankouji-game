import type { StageId } from '../types';
import type { RoleId } from './roles';
import type { WorkerProps } from '../scene/Worker';
import { B1_FLOOR, EXC_BOTTOM, GROUND, floorY, liftY } from '../scene/geometry';
import { LOOK } from '../scene/looks';

export interface Actor {
  id: string;
  stage: StageId;
  role: RoleId;
  /** この場面でしていること */
  doing: string;
  /** 人物の描画（運転席の人は省略） */
  worker?: WorkerProps;
  /** 運転席にいる人の位置（名札と当たり判定） */
  cab?: [number, number];
}

const FOREMAN = LOOK.foremanBand;
const guard = (stage: StageId): Actor => ({
  id: `s${stage}-guard`,
  stage,
  role: 'guard',
  doing: 'ゲートで工事車両と歩行者を誘導している',
  worker: { x: 305, y: GROUND, ...LOOK.guard, pose: 'signal', tool: 'baton' },
});
const towerOp = (stage: StageId): Actor => ({
  id: `s${stage}-crane`,
  stage,
  role: 'craneOp',
  doing: 'タワークレーンの運転席で、合図に合わせて荷を吊っている',
  cab: [1473, 58],
});

export const ACTORS: Actor[] = [
  /* 1. 着工・仮設 */
  guard(1),
  { id: 's1-doko-swing', stage: 1, role: 'doko', doing: 'バックホウのそばで整地の手元作業をしている', worker: { x: 950, y: GROUND, ...LOOK.doko, pose: 'lean', flip: true } },
  { id: 's1-doko-stakes', stage: 1, role: 'doko', doing: '建物の位置を示す丁張り用の杭を運んでいる', worker: { x: 640, y: GROUND, ...LOOK.doko, pose: 'carry', tool: 'stakes', chinstrap: false } },
  { id: 's1-arch', stage: 1, role: 'gcArch', doing: '測量機で地面の高さを確認している', worker: { x: 1200, y: GROUND, ...LOOK.gc, pose: 'work', tool: 'tablet' } },
  { id: 's1-op', stage: 1, role: 'operator', doing: 'バックホウで敷地を整地している', cab: [863, 1128] },
  { id: 's1-me', stage: 1, role: 'me', doing: '仮設の水道（散水・トイレ用）の配管ルートを確認している', worker: { x: 1560, y: GROUND, ...LOOK.mech, pose: 'work', tool: 'tablet' } },
  { id: 's1-plumber', stage: 1, role: 'plumber', doing: '仮設の給水管をつないでいる', worker: { x: 1600, y: GROUND, ...LOOK.plumber, pose: 'crouch', tool: 'wrench', belt: 'pouch' } },
  { id: 's1-director', stage: 1, role: 'gcDirector', doing: '工程表を見ながら段取りを確認している', worker: { x: 1690, y: GROUND, ...LOOK.gc, pose: 'work', tool: 'clipboard' } },
  { id: 's1-safety', stage: 1, role: 'gcSafety', doing: '新しく入った作業員に安全ルールを説明している', worker: { x: 1730, y: GROUND, ...LOOK.gcSafety, pose: 'point', flip: true } },
  { id: 's1-elec', stage: 1, role: 'electrician', doing: '仮設電気を電柱から引き込んでいる', worker: { x: 1928, y: GROUND, ...LOOK.elec, pose: 'reach', tool: 'pliers', belt: 'holster' } },

  /* 2. 土工・山留め・杭 */
  guard(2),
  { id: 's2-arch', stage: 2, role: 'gcArch', doing: '掘削の深さと山留めの状態を記録している', worker: { x: 350, y: GROUND, ...LOOK.gc, pose: 'work', tool: 'tablet' } },
  { id: 's2-doko-shovel', stage: 2, role: 'doko', doing: '掘削の底をスコップで整えている', worker: { x: 530, y: EXC_BOTTOM, ...LOOK.doko, pose: 'work', tool: 'shovel' } },
  { id: 's2-op', stage: 2, role: 'operator', doing: '掘削の底でバックホウを動かし、土を掘っている', cab: [657, 1320] },
  { id: 's2-doko-staff', stage: 2, role: 'doko', doing: '標尺（目盛り付きの棒）を立てて、掘った深さを測っている', worker: { x: 792, y: EXC_BOTTOM, ...LOOK.doko, pose: 'stand', tool: 'staff', flip: true } },
  { id: 's2-doko-load', stage: 2, role: 'doko', doing: '掘削の底を移動している', worker: { x: 1172, y: EXC_BOTTOM, ...LOOK.doko, pose: 'walk' } },
  { id: 's2-slinger', stage: 2, role: 'slinger', doing: 'クレーンのオペレーターに、鋼材を降ろす合図を出している', worker: { x: 1322, y: EXC_BOTTOM, ...LOOK.tobi, harness: 'none', armband: FOREMAN, pose: 'signal' } },
  { id: 's2-doko-edge', stage: 2, role: 'doko', doing: '掘削の縁から下の様子をのぞき込んでいる', worker: { x: 1390, y: GROUND, ...LOOK.doko, pose: 'lean', flip: true } },
  { id: 's2-crane', stage: 2, role: 'craneOp', doing: '移動式クレーンで、山留め用の鋼材を掘削の中へ降ろしている', cab: [1555, 1100] },

  /* 3. 基礎・地下躯体 */
  guard(3),
  towerOp(3),
  { id: 's3-rebar', stage: 3, role: 'rebar', doing: '地下の壁の鉄筋を組んでいる', worker: { x: 566, y: B1_FLOOR, ...LOOK.rebar, pose: 'work', tool: 'hacker', belt: 'wire' } },
  { id: 's3-plumber-pit', stage: 3, role: 'plumber', doing: 'ピット（地下の水槽）の中の配管を確認しようとしている', worker: { x: 633, y: 1350, ...LOOK.plumber, pose: 'reach' } },
  { id: 's3-me', stage: 3, role: 'me', doing: 'ピットまわりの埋設配管とスリーブの位置を図面と照らし合わせている', worker: { x: 760, y: B1_FLOOR, ...LOOK.mech, pose: 'work', tool: 'tablet' } },
  { id: 's3-rebar-load', stage: 3, role: 'rebar', doing: '鉄筋の置き場へ歩いている', worker: { x: 905, y: B1_FLOOR, ...LOOK.rebar, pose: 'walk', belt: 'wire' } },
  { id: 's3-slinger', stage: 3, role: 'slinger', doing: 'タワークレーンに荷を降ろす合図を出している', worker: { x: 1010, y: B1_FLOOR, ...LOOK.tobi, harness: 'none', armband: FOREMAN, pose: 'signal', flip: true } },
  { id: 's3-formwork', stage: 3, role: 'formwork', doing: '地下の壁の型枠を電動ドリルで留めている', worker: { x: 1262, y: B1_FLOOR, ...LOOK.carpenter, pose: 'work', tool: 'impact', belt: 'pouch', flip: true } },

  /* 4. 地上躯体 */
  guard(4),
  towerOp(4),
  { id: 's4-safety', stage: 4, role: 'gcSafety', doing: '1階で安全巡回をしている', worker: { x: 700, y: GROUND, ...LOOK.gcSafety, pose: 'point' } },
  { id: 's4-form-rail', stage: 4, role: 'formwork', doing: '外部足場を歩いて上の階へ向かっている', worker: { x: 500, y: liftY(7), ...LOOK.carpenter, pose: 'walk', belt: 'pouch' } },
  { id: 's4-form-open', stage: 4, role: 'formwork', doing: '5階で型枠用の合板を運んでいる', worker: { x: 1070, y: floorY(5), ...LOOK.carpenter, pose: 'carry', tool: 'board', belt: 'pouch', flip: true } },
  { id: 's4-rebar', stage: 4, role: 'rebar', doing: '7階の床の鉄筋を結束している', worker: { x: 620, y: floorY(7) + 2, ...LOOK.rebar, pose: 'crouch', tool: 'hacker', belt: 'wire' } },
  { id: 's4-me', stage: 4, role: 'me', doing: 'コンクリートを打つ前に、スリーブとインサートの位置を確認している', worker: { x: 790, y: floorY(7) + 2, ...LOOK.mech, pose: 'work', tool: 'tablet' } },
  { id: 's4-form', stage: 4, role: 'formwork', doing: '7階の型枠を組んでいる', worker: { x: 900, y: floorY(7) + 2, ...LOOK.carpenter, pose: 'work', tool: 'saw', belt: 'pouch' } },
  { id: 's4-slinger', stage: 4, role: 'slinger', doing: 'タワークレーンで型枠材を荷揚げする合図を出している', worker: { x: 1100, y: floorY(7) + 2, ...LOOK.tobi, armband: FOREMAN, pose: 'signal' } },
  { id: 's4-tobi', stage: 4, role: 'tobi', doing: '外部足場の一番上で、次の段を組み立てている', worker: { x: 1340, y: liftY(15), ...LOOK.tobi, harness: 'unhooked', pose: 'reach', tool: 'ratchet' } },

  /* 5. 外装・設備前半 */
  guard(5),
  towerOp(5),
  { id: 's5-plumber-lift', stage: 5, role: 'plumber', doing: '配管材を工事用エレベーターに積み込んでいる', worker: { x: 350, y: GROUND, ...LOOK.plumber, pose: 'work' } },
  { id: 's5-safety', stage: 5, role: 'gcSafety', doing: '1階で搬入の動線を確認している', worker: { x: 650, y: GROUND, ...LOOK.gcSafety, pose: 'point' } },
  { id: 's5-plumber-tower', stage: 5, role: 'plumber', doing: 'ローリングタワーに乗って、天井裏の冷温水管をつないでいる', worker: { x: 610, y: floorY(2) - 31, ...LOOK.plumber, pose: 'reach', glasses: true, tool: 'wrench', belt: 'pouch' } },
  { id: 's5-me', stage: 5, role: 'me', doing: '天井裏の配管・ダクト・ケーブルラックの高さが施工図どおりか確認している', worker: { x: 880, y: floorY(2), ...LOOK.mech, pose: 'work', tool: 'tablet' } },
  { id: 's5-plumber-grinder', stage: 5, role: 'plumber', doing: '配管を吊る吊りボルトをグラインダーで切っている', worker: { x: 760, y: floorY(3), ...LOOK.plumber, pose: 'work', tool: 'grinder' } },
  { id: 's5-duct', stage: 5, role: 'duct', doing: '脚立に乗って、天井裏にダクトを吊っている', worker: { x: 990, y: floorY(4) - 14, ...LOOK.duct, pose: 'reach', tool: 'duct' } },
  { id: 's5-elec', stage: 5, role: 'electrician', doing: 'ケーブルラックにケーブルを通している', worker: { x: 680, y: floorY(6), ...LOOK.elec, pose: 'reach', tool: 'pliers', belt: 'holster' } },
  { id: 's5-elecsv', stage: 5, role: 'elecSv', doing: '天井裏のケーブルラックの位置を確認している', worker: { x: 740, y: floorY(6), ...LOOK.elecSv, pose: 'work', tool: 'tablet' } },
  { id: 's5-sash', stage: 5, role: 'sash', doing: '8階の窓にサッシを取り付けている', worker: { x: 566, y: floorY(8), ...LOOK.sash, pose: 'work', tool: 'sealant' } },
  { id: 's5-slinger', stage: 5, role: 'slinger', doing: '屋上で、冷凍機を吊り込む合図を出している', worker: { x: 850, y: floorY(11), ...LOOK.tobi, armband: FOREMAN, pose: 'signal' } },
  { id: 's5-waterproof', stage: 5, role: 'waterproof', doing: '屋上の防水層を塗っている', worker: { x: 960, y: floorY(11), ...LOOK.waterproof, pose: 'work', tool: 'roller' } },

  /* 6. 内装・設備後半 */
  guard(6),
  { id: 's6-gcmep', stage: 6, role: 'gcMep', doing: '設備の中間検査の段取りを確認している', worker: { x: 760, y: GROUND, ...LOOK.gc, pose: 'work', tool: 'flashlight' } },
  { id: 's6-plasterer', stage: 6, role: 'plasterer', doing: '1階の床をモルタルで仕上げている', worker: { x: 950, y: GROUND, ...LOOK.plasterer, pose: 'crouch', tool: 'trowel' } },
  { id: 's6-ev', stage: 6, role: 'ev', doing: 'エレベーターの調整の記録をつけている', worker: { x: 1100, y: GROUND, ...LOOK.ev, pose: 'work', tool: 'laptop' } },
  { id: 's6-interior-board', stage: 6, role: 'interior', doing: '石膏ボードを担いで運んでいる', worker: { x: 640, y: floorY(2), ...LOOK.interior, pose: 'carry', tool: 'board', chinstrap: false, belt: 'pouch' } },
  { id: 's6-me', stage: 6, role: 'me', doing: '天井を張る前に、天井裏の配管・保温が終わっているか確認している', worker: { x: 880, y: floorY(2), ...LOOK.mech, pose: 'work', tool: 'tablet' } },
  { id: 's6-plumber-toilet', stage: 6, role: 'plumber', doing: '便所に便器を取り付けている', worker: { x: 1145, y: floorY(3), ...LOOK.plumber, pose: 'crouch', tool: 'wrench', belt: 'pouch' } },
  { id: 's6-plumber-torch', stage: 6, role: 'plumber', doing: '消火配管を溶接している', worker: { x: 990, y: floorY(4), ...LOOK.plumber, pose: 'crouch', tool: 'torch' } },
  { id: 's6-insulation', stage: 6, role: 'insulation', doing: 'ローリングタワーに乗って、冷温水管に保温材を巻いている', worker: { x: 700, y: floorY(5) - 31, ...LOOK.insulation, pose: 'reach', tool: 'wrap' } },
  { id: 's6-painter', stage: 6, role: 'painter', doing: '7階の壁を塗装している', worker: { x: 900, y: floorY(7), ...LOOK.paint, pose: 'work', tool: 'roller' } },
  { id: 's6-interior-ladder', stage: 6, role: 'interior', doing: '脚立に乗って天井の下地を組んでいる', worker: { x: 700, y: floorY(8) - 24, ...LOOK.interior, pose: 'reach', tool: 'impact', belt: 'pouch' } },
  { id: 's6-fire', stage: 6, role: 'fire', doing: 'スプリンクラーのヘッドを取り付けている', worker: { x: 900, y: floorY(9) - 7, ...LOOK.fire, pose: 'reach', tool: 'headWrench' } },
  { id: 's6-elec', stage: 6, role: 'electrician', doing: 'ローリングタワーに乗って照明器具を取り付けている', worker: { x: 620, y: floorY(10) - 31, ...LOOK.elec, pose: 'reach', tool: 'pliers', belt: 'holster' } },

  /* 7. 仕上げ・検査・引渡し */
  guard(7),
  { id: 's7-landscaper', stage: 7, role: 'landscaper', doing: '植栽のまわりを整えている', worker: { x: 420, y: GROUND, ...LOOK.doko, pose: 'crouch', tool: 'trowel' } },
  { id: 's7-director', stage: 7, role: 'gcDirector', doing: '検査に立ち会い、指摘事項を記録している', worker: { x: 640, y: floorY(2), ...LOOK.gc, pose: 'work', tool: 'clipboard' } },
  { id: 's7-gcmep', stage: 7, role: 'gcMep', doing: '検査で設備の説明をしている', worker: { x: 690, y: floorY(2), ...LOOK.gc, pose: 'work', tool: 'clipboard' } },
  { id: 's7-inspector', stage: 7, role: 'inspector', doing: '天井の点検口や器具を指さして確認している', worker: { x: 740, y: floorY(2), ...LOOK.inspector, pose: 'point', tool: 'flashlight', flip: true } },
  { id: 's7-cleaner', stage: 7, role: 'cleaner', doing: '床洗浄機で床を洗っている', worker: { x: 958, y: floorY(3), ...LOOK.cleaner, pose: 'work', flip: true } },
  { id: 's7-furniture', stage: 7, role: 'furniture', doing: '机の天板を運んでいる', worker: { x: 560, y: floorY(5), ...LOOK.furniture, pose: 'carry', tool: 'board' } },
  { id: 's7-me', stage: 7, role: 'me', doing: '屋上の冷凍機を動かし、温度・圧力を測って試運転調整をしている', worker: { x: 860, y: floorY(11), ...LOOK.mech, pose: 'work', tool: 'tablet' } },
];
