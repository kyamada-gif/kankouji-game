import type { StageId } from '../types';

export type FlowKind = 'hvac' | 'plumbing' | 'fire';

export const FLOW_COLORS = {
  chwSupply: '#38c6d9',
  chwReturn: '#8fe3ee',
  air: '#f1f6fb',
  water: '#5b9bff',
  drain: '#d29a5c',
  fire: '#ff5a4f',
};

export interface MechSystem {
  title: string;
  lead: string;
  steps: { name: string; desc: string }[];
  legend: { color: string; label: string }[];
}

// ※文言は仮（一般的な例）
export const SYSTEMS: Record<FlowKind, MechSystem> = {
  hvac: {
    title: '空調',
    lead: '屋上の熱源で冷たい水（夏）・温かい水（冬）をつくり、配管で各階へ送る。各階の空調機で空気を冷やし・温め、ダクトで部屋に吹き出す。',
    steps: [
      { name: '熱源（冷凍機・ボイラー）', desc: '屋上や機械室で、冷水・温水をつくる。この建物では屋上の空冷ヒートポンプチラー。' },
      { name: '冷温水配管', desc: 'PS（配管スペース）の立て管で各階へ。往き（送る）と還り（戻る）の2本で1組。' },
      { name: '空調機・ファンコイル', desc: '冷温水で空気を冷やす・温める機械。天井裏や機械室に置く。' },
      { name: 'ダクト', desc: '空調機でつくった空気を部屋まで運ぶ。天井裏でいちばん場所をとる。' },
      { name: '吹出口', desc: '天井の吹出口から部屋に空気が出る。照明・スプリンクラーとの位置調整が必要。' },
    ],
    legend: [
      { color: FLOW_COLORS.chwSupply, label: '冷温水（往き）' },
      { color: FLOW_COLORS.chwReturn, label: '冷温水（還り）' },
      { color: FLOW_COLORS.air, label: '空気（ダクト→吹出口）' },
    ],
  },
  plumbing: {
    title: '給排水衛生',
    lead: '水道本管から水を引き込み、いったん受水槽にためてポンプで各階へ送る。使った水は重力で下へ流し、地下の排水槽からポンプで下水へ出す。',
    steps: [
      { name: '引込み', desc: '道路の水道本管から敷地へ水を引き込む。' },
      { name: '受水槽・ポンプ', desc: '地下の受水槽にためて、加圧ポンプで上の階へ送る。' },
      { name: '給水・給湯', desc: 'PSの立て管から各階の便所・給湯室へ。お湯は電気温水器などでつくる（仮）。' },
      { name: '器具', desc: '便器・洗面器・流しなど。取付けは内装の仕上げの後。' },
      { name: '排水', desc: '器具から勾配をつけた管で流し、PSの排水立て管で下へ。勾配が足りないと詰まる。' },
      { name: '排水槽 → 下水へ', desc: '地下の排水は下水より低いので、排水槽にためてポンプでくみ上げて流す。' },
    ],
    legend: [
      { color: FLOW_COLORS.water, label: '給水' },
      { color: FLOW_COLORS.drain, label: '排水' },
    ],
  },
  fire: {
    title: '消火',
    lead: '地下の消火水槽の水を、火災のときに消火ポンプで各階へ送る。スプリンクラーは熱でヘッドが開き、自動で水が出る。',
    steps: [
      { name: '水源（消火水槽）', desc: '地下ピットの一部を消火用の水槽にする。' },
      { name: '消火ポンプ', desc: '火災時に自動で動き、配管に圧力をかける。非常電源で動く。' },
      { name: '配管', desc: 'PSの立て管から各階の天井裏へ。ふだんから水が満たされている。' },
      { name: 'スプリンクラー・消火栓', desc: '天井のヘッドから散水。屋内消火栓は人がホースを使う。' },
    ],
    legend: [{ color: FLOW_COLORS.fire, label: '消火用水' }],
  },
};

export const PROCESS: { name: string; desc: string; stages: StageId[] }[] = [
  { name: '施工図', desc: '設計図をもとに、実際に施工できる寸法・位置の図面を描く。建築・電気と重ねて調整する（総合図）。', stages: [1, 2, 3] },
  { name: 'スリーブ・インサート', desc: 'コンクリートを打つ前に、配管を通す穴の型（スリーブ）と吊りボルトの受け（インサート）を入れる。', stages: [3, 4] },
  { name: '配管・ダクト', desc: '天井裏・PS・機械室に配管とダクトを通す。', stages: [5, 6] },
  { name: '機器据付', desc: '冷凍機・ポンプ・空調機などを搬入して据え付ける。', stages: [5, 6] },
  { name: '保温', desc: '試験に合格した配管・ダクトに保温材を巻く。', stages: [6] },
  { name: '試験', desc: '水圧試験・満水試験などで漏れがないか確かめ、記録を残す。', stages: [6] },
  { name: '試運転調整', desc: '機器を動かし、温度・風量・水量を設計どおりに調整する。', stages: [7] },
  { name: '引渡し', desc: '検査を受け、取扱説明書・試験成績書などの書類をそろえて引き渡す。', stages: [7] },
];
