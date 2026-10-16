import type { Mode, StageId } from '../types';
import type { MeTab } from '../components/RolePanel';
import type { IndState } from '../industry/indState';

/** ガイドの1ステップが画面をどう切り替えるか */
export interface Apply {
  screen: 'site' | 'industry';
  // 断面図
  mode?: Mode;
  stage?: StageId;
  actor?: string;
  meTab?: MeTab;
  truck?: string;
  hazard?: string;
  /** 断面図のどこを拡大して見せるか（シーン座標の中心と幅） */
  focus?: { cx: number; cy: number; w: number };
  // 構造図
  ind?: Partial<IndState>;
}

export interface Step {
  title: string;
  text: string;
  apply: Apply;
}

export interface Chapter {
  id: string;
  title: string;
  summary: string;
  /** 見る画面の説明 */
  where: string;
  minutes: number;
  steps: Step[];
}

const ALL = { cx: 1000, cy: 750, w: 2000 };

// ※文言は仮
export const CHAPTERS: Chapter[] = [
  {
    id: 'overview',
    title: '全体像',
    summary: '建物は、たくさんの会社と7つの段階でできている。まずはざっと全体を見る。',
    where: '業界のしくみ → 現場の流れ',
    minutes: 3,
    steps: [
      {
        title: '建物は1社ではつくれない',
        text: '発注者から職人まで、6つの立場の会社が「上から下へ」仕事を渡して建物をつくります。図の帯が、その立場の層です。',
        apply: { screen: 'industry', ind: {} },
      },
      {
        title: 'あなたはここにいる',
        text: 'あなたの会社は右側の「人材派遣会社」。青い矢印の先、派遣先の会社で施工管理として働きます。青い印があなたです。',
        apply: { screen: 'industry', ind: { flow: 'people' } },
      },
      {
        title: '現場では建物が7段階で育つ',
        text: '断面図で、建物が育っていく様子を見ます。下のスライダーで1〜7を切り替えられます。今は「1. 着工・仮設」。',
        apply: { screen: 'site', mode: 'A', stage: 1, focus: ALL },
      },
      {
        title: '骨組みをつくる',
        text: '「4. 地上躯体」。鉄筋・型枠・コンクリートで1フロアずつ上へ。設備のための穴（スリーブ）もこの時期に入れます。',
        apply: { screen: 'site', mode: 'A', stage: 4, focus: ALL },
      },
      {
        title: '設備が入る',
        text: '「5. 外装・設備前半」。天井裏に配管・ダクト・ケーブルが入ります。管工事がいちばん忙しい時期です。',
        apply: { screen: 'site', mode: 'A', stage: 5, focus: ALL },
      },
      {
        title: 'この教材で学ぶこと',
        text: '「7. 引渡し」まで進むと建物が完成します。次の章から、業界のしくみ → 現場 → あなたの仕事 → 物 → 安全 → ルール、の順に詳しく見ていきます。',
        apply: { screen: 'site', mode: 'A', stage: 7, focus: ALL },
      },
    ],
  },
  {
    id: 'industry',
    title: '業界のしくみ',
    summary: '発注者・ゼネコン・サブコン・職人。それぞれの立場と、あなたの立ち位置を知る。',
    where: '業界のしくみ（構造図）',
    minutes: 5,
    steps: [
      {
        title: '発注者',
        text: 'いちばん上は発注者。お金を出し、どんな建物をつくるかを決めます。右のパネルで、立場の説明を読んでみましょう。',
        apply: { screen: 'industry', ind: { panel: { type: 'layer', id: 'owner' } } },
      },
      {
        title: '設計者・監理者',
        text: '設計図をつくり、工事中は発注者の側に立って、図面どおりかをチェックします。あなたの施工図を承認するのもここ。',
        apply: { screen: 'industry', ind: { panel: { type: 'layer', id: 'designer' } } },
      },
      {
        title: '元請（ゼネコン）',
        text: '工事全体をまとめる会社。自社の職人はほとんどおらず、専門の会社に仕事を出して管理します。',
        apply: { screen: 'industry', ind: { panel: { type: 'layer', id: 'gc' } } },
      },
      {
        title: '一次下請（サブコン）',
        text: '管工事のサブコンは、あなたの仕事の中心になる会社です。派遣先がサブコンなら、青い印のようにここに入ります。',
        apply: { screen: 'industry', ind: { dispatchTo: 'mech', flow: 'people', panel: { type: 'layer', id: 'first' } } },
      },
      {
        title: '派遣先がゼネコンの場合',
        text: '派遣先がゼネコンなら、あなたは元請の設備担当として、サブコンを管理する側に立ちます。立つ位置が1段上がります。',
        apply: { screen: 'industry', ind: { dispatchTo: 'gc', flow: 'people', panel: { type: 'layer', id: 'dispatch' } } },
      },
      {
        title: '二次・三次と職人',
        text: '実際に手を動かすのは職人。指示は必ずその会社の職長を通します（緑の矢印）。赤いバツは、してはいけない直接の指示です。',
        apply: { screen: 'industry', ind: { flow: 'order', panel: { type: 'layer', id: 'second' } } },
      },
      {
        title: '代表的な会社',
        text: '各層の説明の一番下に、代表企業の一覧があります。› が付いた会社は、企業カード（売上・代表工事・写真）を見られます。',
        apply: { screen: 'industry', ind: { panel: { type: 'company', id: 'kajima', from: 'gc' } } },
      },
    ],
  },
  {
    id: 'stages',
    title: '建物ができる流れ',
    summary: '着工から引渡しまで7段階。それぞれの時期に何が起きているかを見る。',
    where: '現場の流れ（断面図）',
    minutes: 5,
    steps: [
      { title: '1. 着工・仮設', text: '仮囲い・ゲート・現場事務所・仮設の電気と水道をつくり、更地を整えます。', apply: { screen: 'site', mode: 'A', stage: 1, focus: { cx: 1100, cy: 1080, w: 1500 } } },
      { title: '2. 土工・山留め・杭', text: '周りの土が崩れないよう山留めで押さえながら、地下を掘ります。掘った土（残土）はダンプで運び出します。', apply: { screen: 'site', mode: 'A', stage: 2, focus: { cx: 950, cy: 1220, w: 1300 } } },
      { title: '3. 基礎・地下躯体', text: '基礎と地下のピット（水槽）、地下の壁と床をつくります。タワークレーンが立ちます。', apply: { screen: 'site', mode: 'A', stage: 3, focus: { cx: 920, cy: 1250, w: 1200 } } },
      { title: '4. 地上躯体', text: '1フロアずつコンクリートを打って上へ。外部足場も一緒に上がっていきます。', apply: { screen: 'site', mode: 'A', stage: 4, focus: { cx: 950, cy: 700, w: 1500 } } },
      { title: '5. 外装・設備前半', text: '窓・外壁・屋上防水。天井裏に配管・ダクト・ケーブルを通し、屋上に大型機器を据えます。', apply: { screen: 'site', mode: 'A', stage: 5, focus: ALL } },
      { title: '6. 内装・設備後半', text: '足場が外れ、天井・壁をつくります。天井を張る前に、天井裏の設備を終わらせるのがポイント。', apply: { screen: 'site', mode: 'A', stage: 6, focus: { cx: 880, cy: 700, w: 1300 } } },
      { title: '7. 仕上げ・検査・引渡し', text: '試運転調整と検査をして、仮設を片付け、建物を引き渡します。', apply: { screen: 'site', mode: 'A', stage: 7, focus: ALL } },
    ],
  },
  {
    id: 'people',
    title: '現場の人',
    summary: 'どんな職種の人が、いつ・どこで働いているか。管工事とどう関わるか。',
    where: '現場の流れ → A. 職種マップ',
    minutes: 6,
    steps: [
      { title: '所長', text: '現場全体の責任者。人を押すと、パネルに仕事の説明と「見分け方」が出ます。', apply: { screen: 'site', mode: 'A', stage: 1, actor: 's1-director', focus: { cx: 1650, cy: 1120, w: 700 } } },
      { title: '鉄筋工', text: 'コンクリートを打つ前に、スリーブ（配管を通す穴の型）の位置を鉄筋とぶつからないように決めます。青い枠の「管工事との関わり」に注目。', apply: { screen: 'site', mode: 'A', stage: 4, actor: 's4-rebar', focus: { cx: 800, cy: 560, w: 700 } } },
      { title: '玉掛け者・合図者', text: 'クレーンで荷を吊るときの合図役。大型機器の吊り込みで一緒に段取りします。', apply: { screen: 'site', mode: 'A', stage: 5, actor: 's5-slinger', focus: { cx: 800, cy: 180, w: 700 } } },
      { title: '電工', text: '空調機やポンプへの動力配線は電気側の仕事。天井裏の高さを分け合う相手です。', apply: { screen: 'site', mode: 'A', stage: 5, actor: 's5-elec', focus: { cx: 720, cy: 640, w: 600 } } },
      { title: '内装工', text: '天井を張る人。天井の高さ・点検口・吹出口の位置を合わせます。', apply: { screen: 'site', mode: 'A', stage: 6, actor: 's6-interior-ladder', focus: { cx: 720, cy: 340, w: 600 } } },
      { title: '消防設備業者', text: 'スプリンクラーのヘッドは、照明や吹出口とぶつかりやすいので、天井の割付けを一緒に決めます。', apply: { screen: 'site', mode: 'A', stage: 6, actor: 's6-fire', focus: { cx: 900, cy: 330, w: 600 } } },
    ],
  },
  {
    id: 'me',
    title: 'あなたの仕事',
    summary: '管工事の施工管理は、着工から引渡しまでずっと関わる。時期ごとの仕事と設備のしくみ。',
    where: '現場の流れ → A. 職種マップ（あなた）',
    minutes: 7,
    steps: [
      { title: '最初の仕事は仮設の水道', text: '着工直後、仮設事務所やトイレ・散水のための水道を引きます。', apply: { screen: 'site', mode: 'A', stage: 1, actor: 's1-me', focus: { cx: 1580, cy: 1120, w: 600 } } },
      { title: 'ピットまわり', text: '地下のピット（水槽）まわりの埋設配管とスリーブ。コンクリートを打った後では直せません。', apply: { screen: 'site', mode: 'A', stage: 3, actor: 's3-me', focus: { cx: 780, cy: 1290, w: 700 } } },
      { title: 'スリーブ・インサート', text: '毎回の打設の前に、床のスリーブとインサートの数と位置を確認します（打設前チェック）。', apply: { screen: 'site', mode: 'A', stage: 4, actor: 's4-me', focus: { cx: 820, cy: 560, w: 600 } } },
      { title: '空調のしくみ', text: '屋上の熱源 → 冷温水配管 → 空調機 → ダクト → 吹出口。断面図の上の動く線を追ってみましょう。', apply: { screen: 'site', mode: 'A', stage: 5, actor: 's5-me', meTab: 'hvac', focus: ALL } },
      { title: '給排水のしくみ', text: '引込み → 受水槽 → ポンプ → 給水 → 器具 → 排水 → 排水槽 → 下水へ。', apply: { screen: 'site', mode: 'A', stage: 6, actor: 's6-me', meTab: 'plumbing', focus: ALL } },
      { title: '施工の流れと試運転', text: '施工図から引渡しまでの8ステップ。最後は機器を動かして温度・風量を調整する「試運転調整」です。', apply: { screen: 'site', mode: 'A', stage: 7, actor: 's7-me', meTab: 'process', focus: { cx: 800, cy: 200, w: 800 } } },
    ],
  },
  {
    id: 'goods',
    title: '物の流れ',
    summary: '時期によってゲートに来るトラックの荷が変わる。揚重の手段の移り変わり。',
    where: '現場の流れ → C. 搬入・搬出',
    minutes: 4,
    steps: [
      { title: '序盤は残土', text: '掘った土を大量に運び出します。トラックを押すと、荷の中身と行き先が出ます。', apply: { screen: 'site', mode: 'C', stage: 2, truck: 'c2-dump', focus: ALL } },
      { title: 'スリーブの搬入', text: '管工事の材料（青い札）。打設日から逆算して届くように手配します。', apply: { screen: 'site', mode: 'C', stage: 3, truck: 'c3-small', focus: ALL } },
      { title: '大型機器はクレーンで', text: '冷凍機などの大型機器は、タワークレーンで屋上へ。段取りの山場です。', apply: { screen: 'site', mode: 'C', stage: 5, truck: 'c5-trailer', focus: ALL } },
      { title: '配管材は工事用エレベーターで', text: '配管・ダクトの大量搬入。工事用エレベーターの予約を取って、階ごとに上げます。', apply: { screen: 'site', mode: 'C', stage: 5, truck: 'c5-unic', focus: ALL } },
      { title: '後半は本設のエレベーター', text: '足場とクレーンがなくなり、本設エレベーターで器具・保温材を運びます。', apply: { screen: 'site', mode: 'C', stage: 6, truck: 'c6-small', focus: ALL } },
      { title: '最後は解体材の搬出', text: '足場・仮囲い・仮設事務所を解体して運び出します。', apply: { screen: 'site', mode: 'C', stage: 7, truck: 'c7-flat', focus: ALL } },
    ],
  },
  {
    id: 'safety',
    title: '安全',
    summary: '現場の危険を見つけ、誰にどう伝えるかを身につける。',
    where: '現場の流れ → B. 危険探し',
    minutes: 6,
    steps: [
      { title: '危険を探してみよう', text: '絵の中の危ない人や物を押して探します。段階1には2つあります。ルーペを使うと細部まで見えます。', apply: { screen: 'site', mode: 'B', stage: 1, focus: ALL } },
      { title: '解説の読み方', text: '高所でフックを掛けていない例。「何が危ないか → 正しい状態 → どう対応するか → 誰に言うか」の順で読みます。', apply: { screen: 'site', mode: 'B', stage: 4, hazard: 's4-hook', focus: { cx: 1200, cy: 560, w: 700 } } },
      { title: '管工事で特に注意：ピット', text: '酸素が足りないピットに入るのは命に関わります。管工事の職人が入ることが多い場所です。', apply: { screen: 'site', mode: 'B', stage: 3, hazard: 's3-pit', focus: { cx: 700, cy: 1300, w: 600 } } },
      { title: '管工事で特に注意：火気', text: '配管の溶接の近くに燃えやすい物。火を使う作業は元請に届け出ます。', apply: { screen: 'site', mode: 'B', stage: 6, hazard: 's6-welding', focus: { cx: 1030, cy: 860, w: 600 } } },
      { title: '自分で探してみよう', text: '段階5には3つの危険があります。見つけたら、解説の「誰に言うか」まで読んでみましょう。', apply: { screen: 'site', mode: 'B', stage: 5, focus: ALL } },
    ],
  },
  {
    id: 'rules',
    title: 'ルールとお金',
    summary: 'お金・契約の流れ、発注方式の違い、守るべきルール。最後にこのビルの施工体系図。',
    where: '業界のしくみ（構造図）',
    minutes: 7,
    steps: [
      { title: 'お金の流れ', text: '発注者のお金は、下の会社に渡るたびに差し引かれていきます（数字は説明用の例）。', apply: { screen: 'industry', ind: { flow: 'money' } } },
      { title: '分離発注だと', text: '設備工事を発注者が直接サブコンに出すと、段が1つ減ります。箱が動くのを見てみましょう。', apply: { screen: 'industry', ind: { flow: 'money', method: 'separate' } } },
      { title: '契約の流れ', text: '誰と誰が契約しているか。あなたと派遣先の間は「労働者派遣契約」です。', apply: { screen: 'industry', ind: { flow: 'contract' } } },
      { title: '設計施工一括とJV', text: 'ゼネコンが設計もする方式や、複数のゼネコンが組む方式もあります。', apply: { screen: 'industry', ind: { method: 'jv', flow: 'contract' } } },
      { title: '丸投げの禁止', text: '請けた工事をそのまま下請に丸投げしてはいけません。左のルールを押すと、図の該当箇所が光ります。', apply: { screen: 'industry', ind: { panel: { type: 'rule', id: 'noLump' } } } },
      { title: '指示は職長を通す', text: '他社の職人に直接指示を出し続けると、偽装請負とみなされるおそれがあります。', apply: { screen: 'industry', ind: { panel: { type: 'rule', id: 'orderLine' } } } },
      { title: '派遣のルール', text: '施工管理の派遣はOK。現場で作業する仕事への派遣は禁止です。', apply: { screen: 'industry', ind: { panel: { type: 'rule', id: 'dispatch' } } } },
      { title: 'このビルの施工体系図', text: '断面図のビルでは、実際にこんな会社が入っています（社名は架空）。あなたの位置と、断面図の職種を見比べてみましょう。', apply: { screen: 'industry', ind: { building: true } } },
    ],
  },
];
