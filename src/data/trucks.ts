import type { StageId } from '../types';
import type { Cargo, TruckKind } from '../scene/truckGeom';

export type Lift = 'crane-truck' | 'self' | 'mobile' | 'tower' | 'pump' | 'hoist' | 'ev' | 'direct';

export const LIFT_NAMES: Record<Lift, string> = {
  'crane-truck': 'トラックのクレーン（ユニック）',
  self: '自走（重機が自分で降りる）',
  mobile: '移動式クレーン',
  tower: 'タワークレーン',
  pump: 'コンクリートポンプ車',
  hoist: '工事用エレベーター',
  ev: '本設エレベーター（工事中の仮使用）',
  direct: '重機で直接積み込む',
};

export interface TruckDef {
  id: string;
  stage: StageId;
  x: number;
  kind: TruckKind;
  cargo: Cargo;
  dir: '搬入' | '搬出';
  /** 車種 */
  vehicle: string;
  /** 積み荷 */
  load: string;
  /** 行き先（搬出なら出どころ） */
  dest: string;
  lift: Lift;
  /** 運ばれる道筋（搬入：トラック→行き先、搬出：出どころ→トラック） */
  route: [number, number][];
  /** 荷を見分けるヒント */
  hint: string;
  /** 管工事との関わり */
  mech: string;
  /** 管工事の荷を積んでいる */
  mechLoad?: boolean;
}

// ※文言・数量は仮（一般的な例）
export const TRUCKS: TruckDef[] = [
  /* 1. 着工・仮設 */
  {
    id: 'c1-unic',
    stage: 1,
    x: 40,
    kind: 'unic',
    cargo: 'panels',
    dir: '搬入',
    vehicle: 'ユニック車（クレーン付きトラック）',
    load: '仮囲いのパネル、仮設事務所（ユニットハウス）の部材',
    dest: '敷地の外周（仮囲い）と、右奥の現場事務所の位置',
    lift: 'crane-truck',
    route: [
      [130, 1120],
      [1600, 1120],
      [1840, 1100],
    ],
    hint: '白っぽい薄いパネルの束と、窓のついた箱（ユニットハウス）。',
    mech: '仮設事務所のトイレ・流しには、仮設の給排水が必要になる。',
  },
  {
    id: 'c1-small',
    stage: 1,
    x: 330,
    kind: 'small',
    cargo: 'temp-pipes',
    dir: '搬入',
    vehicle: '2tトラック',
    load: '仮設の給水管・排水管、水栓、仮設トイレの部材',
    dest: '現場事務所のまわりと、散水用の水栓',
    lift: 'crane-truck',
    route: [
      [400, 1150],
      [1615, 1150],
      [1620, 1160],
    ],
    hint: '青い管（給水用の樹脂管など）の束と、段ボール。',
    mech: 'これがあなたの最初の仕事。仮設の水道を引き、仮設トイレや散水に使えるようにする。',
    mechLoad: true,
  },
  {
    id: 'c1-trailer',
    stage: 1,
    x: 1230,
    kind: 'trailer',
    cargo: 'excavator',
    dir: '搬入',
    vehicle: 'セルフローダー／トレーラー（重機運搬車）',
    load: 'バックホウ（重機）',
    dest: '敷地の中央（整地・掘削の場所）',
    lift: 'self',
    route: [
      [1340, 1140],
      [880, 1150],
    ],
    hint: '荷台に重機がそのまま載っている。',
    mech: '直接の関わりは少ない。重機が動く範囲には近づかない。',
  },

  /* 2. 土工・山留め・杭 */
  {
    id: 'c2-dump',
    stage: 2,
    x: 40,
    kind: 'dump',
    cargo: 'soil',
    dir: '搬出',
    vehicle: '10tダンプ',
    load: '残土（掘った土）。この時期は1日に何十台も出ていく',
    dest: '掘削の底から、場外の処分場へ',
    lift: 'direct',
    route: [
      [700, 1340],
      [700, 1200],
      [130, 1120],
    ],
    hint: '荷台に土が山盛り。シートをかけて走る。',
    mech: '管工事の動きはほぼない。この間に施工図を進める。',
  },
  {
    id: 'c2-unic',
    stage: 2,
    x: 288,
    kind: 'unic',
    cargo: 'hbeam',
    dir: '搬入',
    vehicle: 'ユニック車／トレーラー',
    load: '山留め用のH形鋼、杭の鉄筋かご',
    dest: '掘削の中（山留め・杭の位置）',
    lift: 'mobile',
    route: [
      [380, 1140],
      [1180, 900],
      [1180, 1260],
    ],
    hint: '断面がH形の、こげ茶色の長い鋼材。',
    mech: 'なし。',
  },

  /* 3. 基礎・地下躯体 */
  {
    id: 'c3-mixer',
    stage: 3,
    x: 40,
    kind: 'mixer',
    cargo: 'concrete',
    dir: '搬入',
    vehicle: 'コンクリートミキサー車（生コン車）',
    load: '生コンクリート',
    dest: '地下の基礎・床・壁',
    lift: 'pump',
    route: [
      [130, 1140],
      [400, 1100],
      [900, 1100],
      [900, 1300],
    ],
    hint: '回転するドラム。ポンプ車と2台セットで来る。',
    mech: '打設の前に、ピットまわりの埋設配管とスリーブが入っていることを確認しておく。打った後では直せない。',
  },
  {
    id: 'c3-unic',
    stage: 3,
    x: 288,
    kind: 'unic',
    cargo: 'rebar',
    dir: '搬入',
    vehicle: 'ユニック車',
    load: '加工済みの鉄筋',
    dest: '地下の壁・柱',
    lift: 'tower',
    route: [
      [380, 1140],
      [905, 60],
      [905, 1240],
    ],
    hint: '赤茶色の細い棒の束。荷台からはみ出している。',
    mech: '鉄筋とスリーブがぶつかる場所は、配筋の前に鉄筋工・建築担当と決めておく。',
  },
  {
    id: 'c3-small',
    stage: 3,
    x: 1520,
    kind: 'small',
    cargo: 'sleeves',
    dir: '搬入',
    vehicle: '2tトラック',
    load: '埋設配管の材料、スリーブ（配管を通す穴の型）',
    dest: 'ピットまわり・地下の壁',
    lift: 'tower',
    route: [
      [1590, 1150],
      [1473, 60],
      [760, 60],
      [760, 1300],
    ],
    hint: '灰色の短い筒（スリーブ）と管の束。',
    mech: 'あなたの段取りで入れる材料。打設日から逆算して、必要な日に届くよう手配する。',
    mechLoad: true,
  },

  /* 4. 地上躯体 */
  {
    id: 'c4-mixer',
    stage: 4,
    x: 40,
    kind: 'mixer',
    cargo: 'concrete',
    dir: '搬入',
    vehicle: 'コンクリートミキサー車（生コン車）',
    load: '生コンクリート',
    dest: '打設中の7階の床・柱',
    lift: 'pump',
    route: [
      [130, 1140],
      [440, 1100],
      [440, 560],
      [800, 575],
    ],
    hint: '回転するドラム。',
    mech: '打設の前日までに、その階のスリーブ・インサートの位置を全部確認する（打設前チェック）。',
  },
  {
    id: 'c4-unic',
    stage: 4,
    x: 288,
    kind: 'unic',
    cargo: 'formwork',
    dir: '搬入',
    vehicle: 'ユニック車',
    load: '型枠用の合板、外部足場の鋼管',
    dest: '7階（作業中の階）と外部足場',
    lift: 'tower',
    route: [
      [380, 1140],
      [1000, 60],
      [1000, 470],
    ],
    hint: 'オレンジがかった合板の束と、銀色の鋼管。',
    mech: '直接の関わりは少ない。帰りの便で、型枠の残材が搬出される。',
  },
  {
    id: 'c4-small',
    stage: 4,
    x: 1520,
    kind: 'small',
    cargo: 'sleeves',
    dir: '搬入',
    vehicle: '2tトラック',
    load: 'スリーブ、インサート（吊りボルトの受け）',
    dest: '各階の床・梁の型枠',
    lift: 'tower',
    route: [
      [1590, 1150],
      [1473, 60],
      [820, 60],
      [820, 570],
    ],
    hint: '灰色の短い筒と、小さな金物の箱。',
    mech: 'あなたの材料。1フロアごとに打設があるので、毎回の打設前に数と位置を確認する。',
    mechLoad: true,
  },

  /* 5. 外装・設備前半 */
  {
    id: 'c5-trailer',
    stage: 5,
    x: -40,
    kind: 'trailer',
    cargo: 'chiller',
    dir: '搬入',
    vehicle: 'トレーラー',
    load: '冷凍機（空冷ヒートポンプチラー）などの大型設備機器',
    dest: '屋上',
    lift: 'tower',
    route: [
      [110, 1110],
      [700, 60],
      [700, 170],
    ],
    hint: '箱形の大きな機械。上にファンがついている。',
    mech: 'あなたの段取りの山場。搬入日・揚重の時間・吊り方（ワイヤを掛ける位置）を、メーカー・鳶・元請と事前に決める。',
    mechLoad: true,
  },
  {
    id: 'c5-unic',
    stage: 5,
    x: 1500,
    kind: 'unic',
    cargo: 'pipes',
    dir: '搬入',
    vehicle: 'ユニック車',
    load: '配管材、ダクト、ケーブル',
    dest: '各階の天井裏',
    lift: 'hoist',
    route: [
      [1590, 1140],
      [430, 1150],
      [430, 700],
      [620, 700],
    ],
    hint: '銀色の長い管の束と、四角い筒（ダクト）。',
    mech: 'この時期は配管・ダクトの大量搬入が続く。工事用エレベーターの予約を取り、置き場をふさがないように階ごとに分けて上げる。',
    mechLoad: true,
  },

  /* 6. 内装・設備後半 */
  {
    id: 'c6-flat',
    stage: 6,
    x: 40,
    kind: 'flat',
    cargo: 'board',
    dir: '搬入',
    vehicle: '平ボディ車',
    load: '石膏ボード、軽鉄（天井・壁の下地）、天井材',
    dest: '各階の室内',
    lift: 'ev',
    route: [
      [130, 1140],
      [1250, 1160],
      [1250, 400],
      [760, 380],
    ],
    hint: '白い板が平らに積み重なっている。',
    mech: '天井を張り始めたら、天井裏の配管は直しにくくなる。ボードの搬入が始まる前に、天井裏の試験・保温を終わらせる。',
  },
  {
    id: 'c6-small',
    stage: 6,
    x: 1520,
    kind: 'small',
    cargo: 'fixtures',
    dir: '搬入',
    vehicle: '2tトラック',
    load: '衛生器具（便器・洗面器）、吹出口、ファンコイル、保温材',
    dest: '便所と各階の天井',
    lift: 'ev',
    route: [
      [1590, 1150],
      [1250, 1160],
      [1250, 900],
      [1155, 975],
    ],
    hint: '段ボール箱と、黄色い保温材のロール。',
    mech: 'あなたの材料。器具は傷がつきやすいので、取り付ける直前に搬入し、養生して置く。',
    mechLoad: true,
  },
  {
    id: 'c6-small-out',
    stage: 6,
    x: 330,
    kind: 'small',
    cargo: 'scrap',
    dir: '搬出',
    vehicle: '2tトラック（産廃）',
    load: '端材・梱包材（段ボール・発泡スチロール）',
    dest: '各階から集めて、場外の処分場へ',
    lift: 'ev',
    route: [
      [900, 770],
      [1250, 770],
      [1250, 1160],
      [400, 1140],
    ],
    hint: 'いろいろな物が混ざって積まれている。',
    mech: '保温材や器具の梱包材も多い。自分たちの出したごみは分別して決められた場所へ。',
  },

  /* 7. 仕上げ・検査・引渡し */
  {
    id: 'c7-flat',
    stage: 7,
    x: 40,
    kind: 'flat',
    cargo: 'scrap',
    dir: '搬出',
    vehicle: '平ボディ車',
    load: '足場・仮囲い・仮設事務所の解体材',
    dest: '仮設事務所・仮囲いから、リース会社へ返却',
    lift: 'crane-truck',
    route: [
      [1840, 1110],
      [400, 1140],
      [130, 1120],
    ],
    hint: '銀色の鋼管やパネルがまとめて積まれている。',
    mech: '仮設の給排水も撤去する。本設への切り替え日を元請と決めておく。',
  },
  {
    id: 'c7-unic',
    stage: 7,
    x: 1500,
    kind: 'unic',
    cargo: 'furniture',
    dir: '搬入',
    vehicle: 'ユニック車',
    load: '家具、サイン（案内表示）、外構の材料',
    dest: '各階の室内と、建物の外まわり',
    lift: 'ev',
    route: [
      [1590, 1140],
      [1250, 1160],
      [1250, 780],
      [800, 770],
    ],
    hint: '段ボール箱がぎっしり。',
    mech: 'あなたは屋上や機械室で試運転調整・検査の真っ最中。家具の段ボールで点検口や吹出口がふさがれないよう注意する。',
  },
];

/** 依頼文の表（時期ごとの搬入・搬出・管工事の動き） */
export const LOGISTICS: Record<StageId, { in: string; out: string; mech: string; lift: string }> = {
  1: { in: '仮囲い、仮設事務所、仮設電気・水道、重機', out: 'なし', mech: '仮設の給排水', lift: 'ユニック・自走' },
  2: { in: '山留め材、杭、重機', out: '残土（大量）', mech: 'なし', lift: '移動式クレーン' },
  3: { in: '鉄筋、型枠材、生コン', out: '型枠の残材', mech: '埋設配管、ピットまわり', lift: 'タワークレーン' },
  4: { in: '鉄筋、型枠、生コン、外部足場', out: '型枠の残材', mech: 'スリーブ・インサート', lift: 'タワークレーン' },
  5: { in: 'サッシ、外壁材、防水材、大型設備機器、配管材、ダクト、ケーブル', out: '梱包材', mech: '大型機器の搬入、配管・ダクトの大量搬入', lift: 'クレーン＋工事用EV' },
  6: { in: '軽鉄、石膏ボード、天井材、建具、照明、エレベーター', out: '端材、梱包材', mech: '吹出口、ファンコイル、衛生器具、保温材', lift: '本設EV' },
  7: { in: '家具、サイン、外構材', out: '足場・仮囲い・仮設事務所の解体材、産廃', mech: '試運転調整、検査', lift: '本設EV' },
};

export const KEY_POINTS = [
  '序盤は重くて量が多い資材、中盤は設備と外装、終盤は軽く細かい仕上げ品',
  '搬出は、序盤が残土、終盤が仮設材の解体',
  '揚重の手段は、クレーン中心 → 工事用エレベーター → 本設のエレベーター、と移っていく',
  '管工事は、序盤から終盤まで関わり続ける',
];
