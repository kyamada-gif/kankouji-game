import type { DispatchTo, LayerId, Method, NodeId } from './graph';

export type RuleId = 'license' | 'noLump' | 'engineer' | 'ledger' | 'safety' | 'orderLine' | 'dispatch' | 'ccus' | 'overtime';

export interface Highlight {
  nodes?: NodeId[];
  badges?: { node: NodeId; text: string }[];
  layers?: LayerId[];
  /** してはいけない線（赤い破線とバツ） */
  ng?: { from: NodeId; to: NodeId; text: string }[];
  /** 正しい線（緑） */
  ok?: { from: NodeId; to: NodeId; text: string }[];
  /** 囲み枠 */
  frame?: { nodes: NodeId[]; text: string };
}

export interface Rule {
  id: RuleId;
  name: string;
  summary: string;
  detail: string;
  mech: string;
  highlight: (m: Method, to: DispatchTo) => Highlight;
}

const COMPANIES: NodeId[] = ['gc', 'arch', 'mech', 'elec', 'archSub', 'piping', 'ductco', 'elecSub'];
const SECONDS: NodeId[] = ['archSub', 'piping', 'ductco', 'elecSub'];
const CRAFTS: NodeId[] = ['crArch', 'crPipe', 'crDuct', 'crElec'];

// ※法令の内容は仮。正式な条文・数値は要確認。
export const RULES: Rule[] = [
  {
    id: 'license',
    name: '建設業許可',
    summary: '29業種。一般許可と特定許可。管工事業はそのひとつ',
    detail:
      '一定規模以上の工事を請け負うには、業種ごとに建設業の許可が必要。業種は29あり、管工事業もそのひとつ。下請に大きな金額の工事を出す元請には「特定許可」、それ以外は「一般許可」が必要になる。',
    mech: '管工事を請け負う会社には「管工事業」の許可が必要。あなたの派遣先がどの許可を持っているかは、施工体制台帳で確認できる。',
    highlight: (m) => ({ badges: [...COMPANIES, ...(m === 'jv' ? (['gc2'] as NodeId[]) : [])].map((n) => ({ node: n, text: n === 'gc' || n === 'gc2' || (m === 'separate' && (n === 'mech' || n === 'elec')) ? '特定許可' : '許可' })) }),
  },
  {
    id: 'noLump',
    name: '一括下請負（丸投げ）の禁止',
    summary: '請けた工事をそのまま全部下請に出してはいけない',
    detail:
      '元請が請け負った工事を、自分では何も管理せずにそのまま下請に丸ごと出すことは禁止されている。元請は施工計画・工程・品質・安全などに実質的に関わる必要がある。',
    mech: 'サブコンも同じ。配管工事会社に丸ごと任せきりにせず、施工図・工程・品質の管理をあなたたちが行う。',
    highlight: (m) => ({ ng: [m === 'separate' ? { from: 'mech', to: 'piping', text: '丸投げ禁止' } : { from: 'gc', to: 'mech', text: '丸投げ禁止' }], nodes: m === 'separate' ? ['mech'] : ['gc'] }),
  },
  {
    id: 'engineer',
    name: '主任技術者・監理技術者の配置',
    summary: '工事をする各社に技術者を置く義務',
    detail:
      '工事を請け負う会社は、現場に技術上の管理をする「主任技術者」を置く必要がある。下請に出す金額が大きい元請は、より上位の「監理技術者」を置く。',
    mech: '管工事の主任技術者になるには、管工事施工管理技士などの資格や実務経験が必要。資格を取ると、あなたが技術者として名前を載せられるようになる。',
    highlight: (m) => ({
      badges: [
        { node: 'gc', text: '監理技術者' },
        ...(m === 'jv' ? [{ node: 'gc2' as NodeId, text: '技術者' }] : []),
        { node: 'mech', text: m === 'separate' ? '監理技術者' : '主任技術者' },
        { node: 'elec', text: m === 'separate' ? '監理技術者' : '主任技術者' },
        { node: 'arch', text: '主任技術者' },
        ...SECONDS.map((n) => ({ node: n, text: '主任技術者' })),
      ],
    }),
  },
  {
    id: 'ledger',
    name: '施工体制台帳・施工体系図',
    summary: '誰が誰の下に入っているかを記録し、現場に掲示する',
    detail:
      '元請は、下請を含めた工事の体制（どの会社が誰の下に入り、技術者は誰か）を施工体制台帳にまとめ、その図（施工体系図）を現場の見やすい場所に掲示する。',
    mech: '職人がどの会社の人か分からないとき、誰に伝えればいいか迷ったときは、現場事務所の施工体系図を見る。',
    highlight: (m) => ({ frame: { nodes: [...COMPANIES, ...CRAFTS, ...(m === 'jv' ? (['gc2'] as NodeId[]) : [])], text: '施工体系図に載る範囲' }, nodes: ['gc'] }),
  },
  {
    id: 'safety',
    name: '元請の安全指導の義務',
    summary: '元請は下請の作業員にも安全の指導をする',
    detail: '元請は、自社の社員だけでなく、下請の作業員も含めた現場全体の安全を指導・管理する。新規入場者教育、朝礼、安全巡回などがその例。',
    mech: '危ない作業を見たら、立場に関係なく声をかける。その上で、職長・上長・安全担当へ伝える（危険探しモード参照）。',
    highlight: () => ({ ok: CRAFTS.map((c) => ({ from: 'gc' as NodeId, to: c, text: c === 'crPipe' ? '安全の指導' : '' })), layers: ['crafts'] }),
  },
  {
    id: 'orderLine',
    name: '請負と指示の区分',
    summary: '他社の職人への指示は職長を通す',
    detail:
      '請負では、職人への作業の指示はその職人の会社（職長）が出す。元請やサブコンの社員が、他社の職人に直接作業の指示を出し続けると、実態が「派遣」と同じになり、偽装請負とみなされるおそれがある。',
    mech: 'あなたが配管工に伝えたいことは、配管工事会社の職長に伝える。ただし危険を見たときの声かけは別（すぐに止める）。',
    highlight: (_m, to) => ({
      ok: [
        { from: to === 'gc' ? 'gc' : 'mech', to: 'piping', text: '職長に伝える' },
        { from: 'piping', to: 'crPipe', text: '職長から指示' },
      ],
      ng: [{ from: to === 'gc' ? 'gc' : 'mech', to: 'crPipe', text: '直接の指示を続けるのはNG' }],
    }),
  },
  {
    id: 'dispatch',
    name: '派遣のルール',
    summary: '現場作業への派遣は禁止。施工管理の業務は派遣できる',
    detail: '建設現場で実際に作業する仕事（建設業務）に労働者を派遣することは禁止されている。一方で、施工管理の業務は派遣が認められている。',
    mech: 'あなたは施工管理として派遣されている。職人の作業を手伝う（自分で配管をつなぐなど）のは、ルール上の問題になりうるので注意する。',
    highlight: (_m, to) => ({ ok: [{ from: 'dispatch', to: to === 'gc' ? 'gc' : 'mech', text: '施工管理の派遣はOK' }], ng: [{ from: 'dispatch', to: 'crElec', text: '現場作業への派遣は禁止' }] }),
  },
  {
    id: 'ccus',
    name: '建設キャリアアップシステム（CCUS）',
    summary: '職人の資格や経験を記録する仕組み',
    detail: '職人一人ひとりにカードを発行し、どの現場で何日働いたか、どんな資格を持っているかを記録する仕組み。経験に応じた評価や処遇につなげることがねらい。',
    mech: '現場の入口でカードをタッチする運用が増えている。あなたの現場の職人が登録しているか、元請の指示で確認することがある。',
    highlight: () => ({ layers: ['crafts'], badges: CRAFTS.map((n) => ({ node: n, text: 'CCUSカード' })) }),
  },
  {
    id: 'overtime',
    name: '時間外労働の上限規制',
    summary: '2024年4月から建設業にも適用',
    detail: '残業時間の上限が、2024年4月から建設業にも適用された。長時間労働を前提にした工程は組めなくなり、週休2日の現場も増えている。',
    mech: 'あなた自身の働き方にも関わる。派遣会社と派遣先の両方が、あなたの残業時間を管理する。',
    highlight: () => ({ layers: ['gc', 'first', 'second', 'crafts'], nodes: ['dispatch'] }),
  },
];
