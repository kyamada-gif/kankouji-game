import type { DispatchTo, LayerId } from './graph';
import { YouIcon } from './YouIcon';

// 断面図の「10階建てRC造オフィスビル」の施工体系図（社名はすべて架空）
interface TNode {
  id: string;
  name: string;
  role: string;
  layer: LayerId;
  parent?: string;
  /** 断面図に出てくる職種 */
  trades?: string[];
}

const NODES: TNode[] = [
  { id: 'owner', name: '北辰不動産', role: '発注者', layer: 'owner' },
  { id: 'design', name: '白樺設計', role: '設計・監理', layer: 'designer' },
  { id: 'gc', name: '山並建設', role: '元請（ゼネコン）', layer: 'gc', parent: 'owner', trades: ['所長', '建築担当', '設備担当', '安全担当'] },
  { id: 'tobi', name: '岩城工業', role: '鳶・土工', layer: 'first', parent: 'gc', trades: ['鳶', '土工', '重機オペ', '玉掛け'] },
  { id: 'rebar', name: '早瀬鉄筋', role: '鉄筋', layer: 'first', parent: 'gc', trades: ['鉄筋工'] },
  { id: 'form', name: '杉本工務', role: '型枠', layer: 'first', parent: 'gc', trades: ['型枠大工'] },
  { id: 'interior', name: '緑町インテリア', role: '内装', layer: 'first', parent: 'gc' },
  { id: 'wp', name: '黒川防水', role: '防水', layer: 'first', parent: 'gc', trades: ['防水工'] },
  { id: 'sash', name: '銀星サッシ', role: 'サッシ・ガラス', layer: 'first', parent: 'gc', trades: ['サッシ工'] },
  { id: 'mech', name: '青葉設備工業', role: '空調衛生（管工事）', layer: 'first', parent: 'gc' },
  { id: 'elec', name: '光進電設', role: '電気', layer: 'first', parent: 'gc', trades: ['電気 施工管理'] },
  { id: 'ev', name: '昇和エレベーター', role: 'エレベーター', layer: 'first', parent: 'gc', trades: ['EV業者'] },
  { id: 'guard', name: '東西警備', role: '警備', layer: 'first', parent: 'gc', trades: ['ガードマン'] },
  { id: 'intsub', name: '朝日内装', role: '内装の施工', layer: 'second', parent: 'interior', trades: ['内装工', '左官', '塗装工'] },
  { id: 'pipe', name: '浜田配管', role: '配管', layer: 'second', parent: 'mech', trades: ['配管工'] },
  { id: 'duct', name: '東和ダクト', role: 'ダクト', layer: 'second', parent: 'mech', trades: ['ダクト工'] },
  { id: 'insul', name: '丸山保温', role: '保温', layer: 'second', parent: 'mech', trades: ['保温工'] },
  { id: 'fire', name: '赤城防災', role: '消防設備', layer: 'second', parent: 'mech', trades: ['消防設備'] },
  { id: 'elecsub', name: '若葉電工', role: '電気工事', layer: 'second', parent: 'elec', trades: ['電工'] },
];

const W = 1400;
const NW = 112;
const NH = 58;
const ROW: Record<string, number> = { owner: 60, gc: 200, first: 380, second: 600 };
const FONT = "'Hiragino Sans','Noto Sans JP',sans-serif";

function layout() {
  const pos: Record<string, [number, number]> = {};
  const firsts = NODES.filter((n) => n.layer === 'first');
  const step = (W - 40) / firsts.length;
  firsts.forEach((n, i) => (pos[n.id] = [20 + step * (i + 0.5), ROW.first]));
  pos.owner = [W / 2, ROW.owner];
  pos.design = [W / 2 + 260, ROW.owner];
  pos.gc = [W / 2, ROW.gc];
  const byParent: Record<string, TNode[]> = {};
  NODES.filter((n) => n.layer === 'second').forEach((n) => (byParent[n.parent!] ??= []).push(n));
  Object.entries(byParent).forEach(([pid, kids]) => {
    const px = pos[pid][0];
    kids.forEach((k, i) => (pos[k.id] = [px + (i - (kids.length - 1) / 2) * (NW + 10), ROW.second]));
  });
  // 空調衛生の子が多いので、左右にずらして重ならないようにする
  const xs = Object.entries(pos)
    .filter(([id]) => NODES.find((n) => n.id === id)?.layer === 'second')
    .sort((a, b) => a[1][0] - b[1][0]);
  for (let i = 1; i < xs.length; i++) {
    const prev = xs[i - 1][1];
    const cur = xs[i][1];
    if (cur[0] - prev[0] < NW + 10) cur[0] = prev[0] + NW + 10;
  }
  return pos;
}

export function BuildingTree({ dispatchTo, onPickLayer }: { dispatchTo: DispatchTo; onPickLayer: (id: LayerId) => void }) {
  const pos = layout();
  const you = pos[dispatchTo === 'gc' ? 'gc' : 'mech'];
  return (
    <svg viewBox={`0 0 ${W} 860`} className="ind-svg" role="img" aria-label="このビルの施工体系図">
      <rect width={W} height={860} fill="#f6f4ef" />
      <text x={24} y={34} fontSize={20} fontWeight={700} fill="#1d2024" fontFamily={FONT}>
        施工体系図：（仮）○○ビル新築工事（10階建てRC造オフィスビル）
      </text>
      <text x={24} y={56} fontSize={12.5} fill="#c8322b" fontFamily={FONT}>
        ※会社名はすべて架空です。実際の施工体系図は現場事務所に掲示されています。
      </text>
      {[
        ['発注者', ROW.owner],
        ['元請', ROW.gc],
        ['一次下請', ROW.first],
        ['二次下請', ROW.second],
      ].map(([t, y]) => (
        <text key={t} x={24} y={(y as number) + 5} fontSize={13} fontWeight={700} fill="#4a4f56" fontFamily={FONT}>
          {t}
        </text>
      ))}
      {/* 線 */}
      {NODES.filter((n) => n.parent).map((n) => {
        const [x1, y1] = pos[n.parent!];
        const [x2, y2] = pos[n.id];
        const my = (y1 + NH / 2 + y2 - NH / 2) / 2;
        const mech = n.parent === 'mech' || n.id === 'mech';
        return <path key={n.id} d={`M${x1} ${y1 + NH / 2} V${my} H${x2} V${y2 - NH / 2}`} fill="none" stroke={mech ? '#2e63c8' : '#8a8d90'} strokeWidth={mech ? 2.5 : 1.5} />;
      })}
      <path d={`M${pos.owner[0] + NW / 2} ${pos.owner[1]} H${pos.design[0] - NW / 2}`} stroke="#8a8d90" strokeDasharray="5 4" />
      {/* 箱 */}
      {NODES.map((n) => {
        const [x, y] = pos[n.id];
        const mech = n.id === 'mech' || n.parent === 'mech';
        return (
          <g key={n.id} className="ind-band" onClick={() => onPickLayer(n.layer)}>
            <rect x={x - NW / 2} y={y - NH / 2} width={NW} height={NH} rx={8} fill={mech ? '#e7eefb' : '#fbfaf7'} stroke={mech ? '#2e63c8' : '#8a8d90'} strokeWidth={mech ? 2.4 : 1.4} />
            <text x={x} y={y - 6} fontSize={13.5} fontWeight={700} textAnchor="middle" fill="#1d2024" fontFamily={FONT}>
              {n.name}
            </text>
            <text x={x} y={y + 13} fontSize={11} textAnchor="middle" fill="#4a4f56" fontFamily={FONT}>
              {n.role}
            </text>
            {n.trades?.map((t, i) => (
              <g key={t}>
                <rect x={x - 46} y={y + NH / 2 + 6 + i * 21} width={92} height={18} rx={9} fill={mech ? '#2e63c8' : '#5b6770'} />
                <text x={x} y={y + NH / 2 + 19 + i * 21} fontSize={11} textAnchor="middle" fill="#fff" fontFamily={FONT}>
                  {t}
                </text>
              </g>
            ))}
          </g>
        );
      })}
      <g transform={`translate(${you[0] + NW / 2 + 20} ${you[1] - 22})`}>
        <YouIcon />
      </g>
    </svg>
  );
}
