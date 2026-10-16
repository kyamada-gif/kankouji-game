// 多重下請け構造図の箱・配置・矢印
export type LayerId = 'owner' | 'designer' | 'gc' | 'first' | 'second' | 'crafts' | 'supplier' | 'dispatch';
export type Method = 'lump' | 'separate' | 'designBuild' | 'jv';
export type FlowType = 'none' | 'money' | 'contract' | 'order' | 'goods' | 'people';
export type DispatchTo = 'gc' | 'mech';
export type NodeId =
  | 'owner'
  | 'designer'
  | 'gc'
  | 'gc2'
  | 'arch'
  | 'mech'
  | 'elec'
  | 'archSub'
  | 'piping'
  | 'ductco'
  | 'elecSub'
  | 'crArch'
  | 'crPipe'
  | 'crDuct'
  | 'crElec'
  | 'maker'
  | 'trader'
  | 'dispatch';

export const VIEW_W = 1400;
export const VIEW_H = 900;
export const NODE_W = 170;
export const NODE_H = 56;

/** 層の帯（上から） */
export const BANDS: { id: LayerId; label: string; y0: number; y1: number }[] = [
  { id: 'owner', label: '発注者', y0: 40, y1: 170 },
  { id: 'designer', label: '設計者・監理者', y0: 170, y1: 300 },
  { id: 'gc', label: '元請（ゼネコン）', y0: 300, y1: 440 },
  { id: 'first', label: '一次下請（サブコン）', y0: 440, y1: 580 },
  { id: 'second', label: '二次・三次下請', y0: 580, y1: 720 },
  { id: 'crafts', label: '職人', y0: 720, y1: 870 },
];

export const SIDE = { x0: 1120, x1: 1390 };

export const METHODS: { id: Method; label: string; note: string }[] = [
  { id: 'lump', label: '一括発注', note: '設備工事もゼネコンの下に入る。民間に多い。' },
  { id: 'separate', label: '分離発注', note: '設備工事を発注者がサブコンに直接発注する。公共に多い。' },
  { id: 'designBuild', label: '設計施工一括', note: 'ゼネコンが設計も施工も行う。' },
  { id: 'jv', label: 'JV（共同企業体）', note: '複数のゼネコンが組んで1つの工事を受注する。' },
];

export const FLOWS: { id: FlowType; label: string; color: string }[] = [
  { id: 'none', label: 'なし', color: '#888' },
  { id: 'money', label: 'お金', color: '#c9a227' },
  { id: 'contract', label: '契約', color: '#5b6770' },
  { id: 'order', label: '指示', color: '#2e7d4f' },
  { id: 'goods', label: '物', color: '#9a6a32' },
  { id: 'people', label: '人', color: '#2e63c8' },
];

export const NODE_LAYER: Record<NodeId, LayerId> = {
  owner: 'owner',
  designer: 'designer',
  gc: 'gc',
  gc2: 'gc',
  arch: 'first',
  mech: 'first',
  elec: 'first',
  archSub: 'second',
  piping: 'second',
  ductco: 'second',
  elecSub: 'second',
  crArch: 'crafts',
  crPipe: 'crafts',
  crDuct: 'crafts',
  crElec: 'crafts',
  maker: 'supplier',
  trader: 'supplier',
  dispatch: 'dispatch',
};

export function nodeLabel(id: NodeId, m: Method): { title: string; sub?: string } {
  switch (id) {
    case 'owner':
      return { title: '発注者', sub: 'デベロッパー・国・自治体など' };
    case 'designer':
      return m === 'designBuild' ? { title: 'ゼネコンの設計部門', sub: '設計も元請が行う' } : { title: '設計事務所', sub: '設計・監理' };
    case 'gc':
      return m === 'jv' ? { title: 'ゼネコンA', sub: 'JVの代表者' } : m === 'separate' ? { title: 'ゼネコン', sub: '建築工事の元請' } : { title: 'ゼネコン', sub: '元請' };
    case 'gc2':
      return { title: 'ゼネコンB', sub: 'JVの構成員' };
    case 'arch':
      return { title: '建築の専門工事会社', sub: '鳶・鉄筋・型枠・内装など' };
    case 'mech':
      return m === 'separate' ? { title: '空調衛生サブコン', sub: '設備の元請（直接契約）' } : { title: '空調衛生サブコン', sub: '管工事' };
    case 'elec':
      return m === 'separate' ? { title: '電気サブコン', sub: '設備の元請（直接契約）' } : { title: '電気サブコン', sub: '電気工事' };
    case 'archSub':
      return { title: '建築の二次', sub: '内装の施工会社など' };
    case 'piping':
      return { title: '配管工事会社', sub: '専門工事会社' };
    case 'ductco':
      return { title: 'ダクト工事会社', sub: '専門工事会社' };
    case 'elecSub':
      return { title: '電気工事会社', sub: '専門工事会社' };
    case 'crArch':
      return { title: '職長・職人', sub: '内装工など' };
    case 'crPipe':
      return { title: '職長・職人', sub: '配管工' };
    case 'crDuct':
      return { title: '職長・職人', sub: 'ダクト工・保温工' };
    case 'crElec':
      return { title: '職長・職人', sub: '電工' };
    case 'maker':
      return { title: 'メーカー', sub: '機器・資材をつくる' };
    case 'trader':
      return { title: '商社', sub: '資材を仕入れて届ける' };
    case 'dispatch':
      return { title: '人材派遣会社', sub: 'あなたの会社' };
  }
}

type Pos = Partial<Record<NodeId, [number, number]>>;

const BASE: Pos = {
  owner: [670, 105],
  designer: [930, 235],
  gc: [670, 370],
  arch: [400, 510],
  mech: [670, 510],
  elec: [940, 510],
  archSub: [400, 650],
  piping: [600, 650],
  ductco: [780, 650],
  elecSub: [960, 650],
  crArch: [400, 795],
  crPipe: [600, 795],
  crDuct: [780, 795],
  crElec: [960, 795],
  maker: [1255, 510],
  trader: [1255, 650],
  dispatch: [1255, 370],
};

export const POSITIONS: Record<Method, Pos> = {
  lump: BASE,
  separate: { ...BASE, gc: [400, 370], mech: [670, 370], elec: [940, 370], arch: [400, 510], piping: [600, 510], ductco: [780, 510], elecSub: [960, 510] },
  designBuild: { ...BASE, designer: [670, 235] },
  jv: { ...BASE, gc: [560, 370], gc2: [800, 370] },
};

export interface Edge {
  from: NodeId;
  to: NodeId;
  label?: string;
  /** 線の太さ（お金の量の目安） */
  w?: number;
  /** 強調（説明の中心になる流れ） */
  main?: boolean;
  /** 破線（調整などの弱い関係） */
  dashed?: boolean;
  /** してはいけない流れ（赤いバツ） */
  ng?: boolean;
  /** 向きのない線（契約） */
  plain?: boolean;
}

export function edgesFor(flow: FlowType, m: Method, to: DispatchTo): Edge[] {
  const sep = m === 'separate';
  const top: NodeId = 'gc';
  switch (flow) {
    case 'money': {
      const chain: Edge[] = sep
        ? [
            { from: 'owner', to: 'mech', label: '100', w: 10, main: true },
            { from: 'mech', to: 'piping', label: '85', w: 8, main: true },
            { from: 'piping', to: 'crPipe', label: '70（賃金）', w: 6, main: true },
          ]
        : [
            { from: 'owner', to: top, label: '100', w: 10, main: true },
            { from: top, to: 'mech', label: '85', w: 8, main: true },
            { from: 'mech', to: 'piping', label: '70', w: 6, main: true },
            { from: 'piping', to: 'crPipe', label: '55（賃金）', w: 4, main: true },
          ];
      const all: Edge[] = [
        ...chain,
        ...(m === 'designBuild' ? [] : [{ from: 'owner', to: 'designer', label: '設計・監理料', w: 3 } as Edge]),
        ...(sep ? [{ from: 'owner', to: 'gc', w: 3 } as Edge, { from: 'owner', to: 'elec', w: 3 } as Edge] : [{ from: top, to: 'arch', w: 3 } as Edge, { from: top, to: 'elec', w: 3 } as Edge]),
        ...(m === 'jv' ? [{ from: 'owner', to: 'gc2', w: 3, label: '出資の割合で分ける' } as Edge] : []),
        { from: 'gc', to: 'arch', w: sep ? 3 : 0 },
        { from: 'mech', to: 'ductco', w: 3 },
        { from: 'elec', to: 'elecSub', w: 3 },
        { from: 'arch', to: 'archSub', w: 3 },
        { from: 'ductco', to: 'crDuct', w: 2 },
        { from: 'elecSub', to: 'crElec', w: 2 },
        { from: 'archSub', to: 'crArch', w: 2 },
        { from: 'mech', to: 'trader', w: 2, label: '資材の代金' },
      ];
      return all.filter((e) => e.w !== 0);
    }
    case 'contract': {
      const list: Edge[] = [];
      if (m === 'designBuild') list.push({ from: 'owner', to: 'gc', label: '設計施工の契約', plain: true });
      else list.push({ from: 'owner', to: 'designer', label: '設計・監理契約', plain: true }, { from: 'owner', to: 'gc', label: '工事請負契約', plain: true });
      if (m === 'jv') list.push({ from: 'owner', to: 'gc2', label: 'JVとして1つの契約', plain: true });
      if (sep) list.push({ from: 'owner', to: 'mech', label: '工事請負契約（分離）', plain: true }, { from: 'owner', to: 'elec', label: '工事請負契約（分離）', plain: true }, { from: 'gc', to: 'arch', label: '下請契約', plain: true });
      else list.push({ from: 'gc', to: 'arch', label: '下請契約', plain: true }, { from: 'gc', to: 'mech', label: '下請契約', plain: true }, { from: 'gc', to: 'elec', label: '下請契約', plain: true });
      list.push(
        { from: 'mech', to: 'piping', label: '下請契約', plain: true },
        { from: 'mech', to: 'ductco', plain: true },
        { from: 'elec', to: 'elecSub', plain: true },
        { from: 'arch', to: 'archSub', plain: true },
        { from: 'piping', to: 'crPipe', label: '雇用契約', plain: true },
        { from: 'ductco', to: 'crDuct', plain: true },
        { from: 'elecSub', to: 'crElec', plain: true },
        { from: 'archSub', to: 'crArch', plain: true },
        { from: 'maker', to: 'trader', label: '売買契約', plain: true },
        { from: 'trader', to: 'mech', label: '売買契約', plain: true },
        { from: 'dispatch', to: to === 'gc' ? 'gc' : 'mech', label: '労働者派遣契約', plain: true },
      );
      return list;
    }
    case 'order': {
      const list: Edge[] = [{ from: 'designer', to: 'gc', label: m === 'designBuild' ? '社内で設計と調整' : '監理（図面どおりか確認）' }];
      if (sep)
        list.push(
          { from: 'gc', to: 'mech', label: '総合調整', dashed: true },
          { from: 'gc', to: 'elec', dashed: true },
          { from: 'gc', to: 'arch', label: '作業の指示' },
        );
      else list.push({ from: 'gc', to: 'arch' }, { from: 'gc', to: 'mech', label: '作業の指示・調整', main: true }, { from: 'gc', to: 'elec' });
      if (m === 'jv') list.push({ from: 'gc2', to: 'gc', label: '代表者が取りまとめ', dashed: true });
      list.push(
        { from: 'mech', to: 'piping', label: '段取り・指示', main: true },
        { from: 'mech', to: 'ductco' },
        { from: 'elec', to: 'elecSub' },
        { from: 'arch', to: 'archSub' },
        { from: 'piping', to: 'crPipe', label: '職長を通して', main: true },
        { from: 'ductco', to: 'crDuct' },
        { from: 'elecSub', to: 'crElec' },
        { from: 'archSub', to: 'crArch' },
        { from: 'gc', to: 'crPipe', label: '職人へ直接の指示を続けるのはNG', ng: true },
      );
      return list;
    }
    case 'goods':
      return [
        { from: 'maker', to: 'trader', label: '機器・資材', main: true },
        { from: 'trader', to: 'piping', label: '配管材', main: true },
        { from: 'trader', to: 'ductco', label: 'ダクト材' },
        { from: 'maker', to: 'mech', label: '大型機器（直送も）' },
        { from: 'trader', to: 'archSub', label: '内装材', dashed: true },
      ];
    case 'people':
      return [{ from: 'dispatch', to: to === 'gc' ? 'gc' : 'mech', label: '施工管理者を派遣', main: true, w: 5 }];
    default:
      return [];
  }
}
