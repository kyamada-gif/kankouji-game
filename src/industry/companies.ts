// 企業カード。数値・実績は出典つき（2026-10-16 取得）。説明文は仮で、公式情報での確認が必要。
export interface Work {
  name: string;
  /** public/images/works/ の写真（photos.ts にクレジット） */
  photo?: string;
  note?: string;
  /** 写真の代わりに出すリンク */
  link?: string;
}

export interface Company {
  id: string;
  name: string;
  category: string;
  scale: string;
  scaleSource: string;
  fields: string[];
  works: Work[];
  worksSource: string;
  features: string;
  mech: string;
  url: string;
}

const GC_MECH =
  '元請として現場をまとめる会社。一括発注なら、あなたのサブコンの発注元になる。派遣先がこの会社なら、あなたは元請の設備担当としてサブコンを管理する側に立つ。';
const SUB_MECH = 'あなたの派遣先、または取引先になる会社。派遣先なら、あなたはこの会社の施工管理として配管・ダクトの会社を段取りする。';
const WIKI = 'Wikipedia日本語版の記事（2026-10-16 取得）';

export const COMPANIES: Record<string, Company> = {
  kajima: {
    id: 'kajima',
    name: '鹿島建設',
    category: 'ゼネコン／スーパーゼネコン',
    scale: '連結売上高 約3兆672億円（2026年3月期）',
    scaleSource: WIKI,
    fields: ['超高層', '土木（ダム・橋）', 'スタジアム', 'エネルギー施設'],
    works: [
      { name: '霞が関ビルディング', photo: 'kasumigaseki', note: '日本初の本格的な超高層ビル' },
      { name: '国立新美術館', photo: 'nact' },
      { name: '埼玉スタジアム2002', photo: 'saitama-stadium' },
    ],
    worksSource: `${WIKI}「主な施工物件」`,
    features: '建築・土木の両方で大規模工事を手がける大手。ダム・原子力発電所などの土木・エネルギー分野から超高層まで実績が幅広い（要確認）。',
    mech: GC_MECH,
    url: 'https://www.kajima.co.jp/',
  },
  obayashi: {
    id: 'obayashi',
    name: '大林組',
    category: 'ゼネコン／スーパーゼネコン',
    scale: '連結売上高 約1兆9,228億円（年度は公式IRで確認）',
    scaleSource: WIKI,
    fields: ['超高層・タワー', '駅・空港', '土木（橋・トンネル）', '商業施設'],
    works: [
      { name: '東京スカイツリー', photo: 'skytree' },
      { name: '梅田スカイビル', photo: 'umeda-sky' },
      { name: '京都駅ビル', photo: 'kyoto-station', note: 'JV代表' },
    ],
    worksSource: `${WIKI}「主な施工物件」`,
    features: '建築・土木の大手。東京スカイツリーなどのタワーや、関西の駅・超高層の実績が多い（要確認）。',
    mech: GC_MECH,
    url: 'https://www.obayashi.co.jp/',
  },
  shimizu: {
    id: 'shimizu',
    name: '清水建設',
    category: 'ゼネコン／スーパーゼネコン',
    scale: '連結売上高 約1兆4,829億円（2022年3月期。最新は公式IRで確認）',
    scaleSource: WIKI,
    fields: ['超高層', '再開発', '病院', 'スタジアム'],
    works: [
      { name: 'サンシャイン60', photo: 'sunshine60' },
      { name: '麻布台ヒルズ森JPタワー', photo: 'azabudai' },
      { name: '横浜スタジアム', photo: 'yokohama-stadium' },
    ],
    worksSource: `${WIKI}「施工物件」`,
    features: '建築に強みを持つ大手。歴史的建造物から最新の超高層・再開発まで実績がある（要確認）。',
    mech: GC_MECH,
    url: 'https://www.shimz.co.jp/',
  },
  taisei: {
    id: 'taisei',
    name: '大成建設',
    category: 'ゼネコン／スーパーゼネコン',
    scale: '連結売上高 約2兆890億円（2026年3月期）',
    scaleSource: WIKI,
    fields: ['スタジアム', '超高層', '土木（トンネル）', '再開発'],
    works: [
      { name: '国立競技場（2019年）', photo: 'national-stadium' },
      { name: '新宿センタービル', photo: 'shinjuku-center', note: '本社が入居' },
      { name: '豊田スタジアム', photo: 'toyota-stadium' },
    ],
    worksSource: `${WIKI}「施工案件」`,
    features: '建築・土木の大手。国立競技場など大規模な公共施設・スタジアムの実績がある（要確認）。',
    mech: GC_MECH,
    url: 'https://www.taisei.co.jp/',
  },
  takenaka: {
    id: 'takenaka',
    name: '竹中工務店',
    category: 'ゼネコン／スーパーゼネコン',
    scale: '連結売上高 約1兆6,147億円（2025年12月期）',
    scaleSource: WIKI,
    fields: ['超高層', 'ドーム・スタジアム', '空港', '設計施工'],
    works: [
      { name: 'あべのハルカス', photo: 'harukas', note: '設計・監理・施工' },
      { name: '東京ドーム', photo: 'tokyo-dome' },
      { name: '東京ミッドタウン', photo: 'midtown' },
    ],
    worksSource: `${WIKI}「建築作品」「沿革」`,
    features: '建築が中心の大手で、非上場。設計から施工まで一貫して手がける「設計施工」が多い（要確認）。',
    mech: GC_MECH,
    url: 'https://www.takenaka.co.jp/',
  },
  takasago: {
    id: 'takasago',
    name: '高砂熱学工業',
    category: '設備サブコン／空調衛生系',
    scale: '連結売上高 約3,817億円（2025年3月期）',
    scaleSource: WIKI,
    fields: ['空調', 'ドーム・大空間', '超高層', 'クリーンルーム'],
    works: [
      { name: '東京ドーム', photo: 'tokyo-dome' },
      { name: '横浜ランドマークタワー', photo: 'landmark' },
      { name: '東京国際フォーラム', photo: 'forum' },
    ],
    worksSource: `${WIKI}「主な施工実績」`,
    features: '空調設備工事の大手。ドームや超高層など大規模建築の空調を数多く手がける（要確認）。',
    mech: SUB_MECH,
    url: 'https://www.tte-net.com/',
  },
  sanki: {
    id: 'sanki',
    name: '三機工業',
    category: '設備サブコン／空調衛生系',
    scale: '連結売上高 約2,531億円（2025年3月期）',
    scaleSource: WIKI,
    fields: ['空調衛生', '電気', '搬送システム', '水処理'],
    works: [
      { name: '虎ノ門ヒルズ ビジネスタワー', photo: 'toranomon', note: '設備を施工（写真は虎ノ門ヒルズの全景）' },
      { name: '近三ビルヂング（歴代の改修）', photo: 'kinsan' },
      { name: 'ほかの実績は公式サイトへ', link: 'https://www.sanki.co.jp/service/result/' },
    ],
    worksSource: `${WIKI}「虎ノ門ヒルズ」「近三ビルヂング」`,
    features: '空調衛生を中心に、搬送設備や水処理なども手がける（要確認）。',
    mech: SUB_MECH,
    url: 'https://www.sanki.co.jp/',
  },
  kandenko: {
    id: 'kandenko',
    name: '関電工',
    category: '設備サブコン／電気系',
    scale: '連結売上高 約6,161億円（2020年3月期。最新は公式IRで確認）',
    scaleSource: WIKI,
    fields: ['屋内電気設備', '送配電', '情報通信', '空調・給排水'],
    works: [
      { name: '東京スカイツリー', photo: 'skytree' },
      { name: '国立競技場', photo: 'national-stadium' },
      { name: '歌舞伎座', photo: 'kabukiza' },
    ],
    worksSource: '関電工 公式サイト「施工事例」（2026-10-16 取得）',
    features: '電気設備工事の大手。建物の電気設備のほか、送配電や情報通信の工事も手がける（要確認）。',
    mech: '電気サブコン。空調機やポンプへの動力配線、天井裏の取り合いで毎日のように調整する相手。派遣先になることもある。',
    url: 'https://www.kandenko.co.jp/',
  },
};
