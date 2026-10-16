import type { ReactNode } from 'react';
import { GROUND, liftY } from './geometry';
import { Label } from './parts';

const MACHINE_YELLOW = '#cf9d22';

/** バックホウ。既定は右向き（バケットが右）。 */
export function Excavator({ x, y = GROUND, flip = false, reach = 1 }: { x: number; y?: number; flip?: boolean; reach?: number }) {
  const tip = 105 * reach;
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -1 : 1},1)`}>
      <ellipse cx={0} cy={0} rx={55} ry={5} fill="#000" opacity={0.2} />
      {/* 足回り */}
      <rect x={-46} y={-22} width={92} height={22} rx={11} fill="#2a2a2a" />
      {[-34, -12, 12, 34].map((cx) => (
        <circle key={cx} cx={cx} cy={-11} r={6.5} fill="#444" stroke="#1a1a1a" />
      ))}
      <rect x={-30} y={-27} width={60} height={6} fill="#3a3a3a" />
      {/* 上部旋回体 */}
      <path d="M-48,-30 Q-50,-54 -36,-56 L4,-56 L4,-27 L-46,-27 Z" fill={MACHINE_YELLOW} />
      <path d="M-48,-30 Q-50,-54 -36,-56 L4,-56 L4,-27 L-46,-27 Z" fill="url(#g-shade-y)" />
      <rect x={-50} y={-50} width={10} height={22} rx={3} fill="#a77f1c" />
      <path d="M2,-80 L28,-80 L32,-27 L2,-27 Z" fill={MACHINE_YELLOW} />
      <path d="M6,-76 L26,-76 L29,-46 L6,-46 Z" fill="#6f8798" opacity={0.85} />
      <path d="M8,-74 L14,-74 L10,-50 L7,-50 Z" fill="#fff" opacity={0.25} />
      {/* ブーム・アーム・バケット */}
      <path d={`M24,-48 L${tip * 0.62},-118 L${tip},-50`} stroke={MACHINE_YELLOW} strokeWidth={10} strokeLinejoin="round" fill="none" />
      <path d={`M24,-48 L${tip * 0.62},-118 L${tip},-50`} stroke="#000" strokeOpacity={0.2} strokeWidth={3} fill="none" />
      <line x1={30} y1={-40} x2={tip * 0.5} y2={-96} stroke="#bdbdbd" strokeWidth={2.5} />
      <path d={`M${tip - 6},-52 L${tip + 14},-38 L${tip + 10},-12 L${tip - 10},-18 Z`} fill="#3c3c3c" />
      <path d={`M${tip - 10},-18 l-2 4 M${tip - 4},-16 l-2 4 M${tip + 2},-14 l-2 4`} stroke="#3c3c3c" strokeWidth={2} />
    </g>
  );
}

/** ラフタークレーン（右側に車体、ブームは左上へ） */
export function MobileCrane({ x, tip, hookY, children }: { x: number; tip: [number, number]; hookY: number; children?: ReactNode }) {
  const pivot: [number, number] = [x + 110, GROUND - 72];
  return (
    <g>
      <ellipse cx={x + 125} cy={GROUND} rx={140} ry={5} fill="#000" opacity={0.2} />
      {/* アウトリガー */}
      <rect x={x - 10} y={GROUND - 30} width={270} height={6} fill="#c9c6bf" />
      <rect x={x - 16} y={GROUND - 6} width={16} height={6} fill="#555" />
      <rect x={x + 252} y={GROUND - 6} width={16} height={6} fill="#555" />
      <rect x={x - 10} y={GROUND - 26} width={5} height={20} fill="#c9c6bf" />
      <rect x={x + 255} y={GROUND - 26} width={5} height={20} fill="#c9c6bf" />
      {/* 車体 */}
      <rect x={x + 10} y={GROUND - 56} width={230} height={30} rx={4} fill="#e9e6df" stroke="#7d7a74" />
      <rect x={x + 10} y={GROUND - 36} width={230} height={4} fill="#b23a33" />
      {[x + 40, x + 85, x + 175, x + 215].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={GROUND - 16} r={15} fill="#222" />
          <circle cx={cx} cy={GROUND - 16} r={6} fill="#777" />
        </g>
      ))}
      {/* 旋回体とキャブ */}
      <rect x={x + 90} y={GROUND - 84} width={90} height={28} fill="#e9e6df" stroke="#7d7a74" />
      <rect x={x + 60} y={GROUND - 100} width={30} height={44} rx={3} fill="#e9e6df" stroke="#7d7a74" />
      <rect x={x + 64} y={GROUND - 96} width={22} height={20} fill="#6f8798" />
      {/* ブーム */}
      <line x1={pivot[0]} y1={pivot[1]} x2={tip[0]} y2={tip[1]} stroke="#e9e6df" strokeWidth={14} />
      <line x1={pivot[0]} y1={pivot[1]} x2={tip[0]} y2={tip[1]} stroke="#7d7a74" strokeWidth={14} strokeOpacity={0.25} strokeDasharray="120 3" />
      <line x1={pivot[0]} y1={pivot[1] + 4} x2={tip[0]} y2={tip[1] + 4} stroke="#b23a33" strokeWidth={2} />
      <line x1={x + 130} y1={GROUND - 58} x2={pivot[0] - 60} y2={pivot[1] - 50} stroke="#9a9a9a" strokeWidth={6} />
      <circle cx={tip[0]} cy={tip[1]} r={6} fill="#555" />
      <line x1={tip[0]} y1={tip[1]} x2={tip[0]} y2={hookY} stroke="#2a2a2a" strokeWidth={1.4} />
      {children}
    </g>
  );
}

/** タワークレーン（右側のマスト、左へ伸びるジブ） */
export function TowerCrane({ x = 1440, trolleyX, hookY, children }: { x?: number; trolleyX: number; hookY: number; children?: ReactNode }) {
  const top = 52;
  const color = '#d2b13d';
  const mast = [];
  for (let y = GROUND; y > top + 8; y -= 22) mast.push(y);
  const jib = [];
  for (let jx = x; jx > 380; jx -= 24) jib.push(jx);
  return (
    <g>
      <rect x={x - 24} y={GROUND - 8} width={70} height={16} fill="#8f8b83" />
      <g stroke={color} strokeWidth={2.2} fill="none">
        <line x1={x} y1={GROUND} x2={x} y2={top} />
        <line x1={x + 22} y1={GROUND} x2={x + 22} y2={top} />
        {mast.map((y) => (
          <path key={y} d={`M${x} ${y} L${x + 22} ${y - 11} L${x} ${y - 22}`} strokeWidth={1.2} />
        ))}
        {/* ジブ */}
        <line x1={x + 11} y1={top} x2={380} y2={top} />
        <line x1={x + 11} y1={top - 12} x2={392} y2={top - 3} />
        {jib.map((jx) => (
          <path key={jx} d={`M${jx} ${top} L${jx - 12} ${top - 11} L${jx - 24} ${top}`} strokeWidth={1.1} />
        ))}
        {/* カウンタージブ */}
        <line x1={x + 22} y1={top - 6} x2={x + 260} y2={top - 6} strokeWidth={4} />
        {/* 頂部 */}
        <path d={`M${x} ${top - 12} L${x + 11} ${top - 46} L${x + 22} ${top - 12}`} />
      </g>
      <g stroke="#555" strokeWidth={0.8}>
        <line x1={x + 11} y1={top - 46} x2={760} y2={top - 10} />
        <line x1={x + 11} y1={top - 46} x2={x + 250} y2={top - 8} />
      </g>
      <rect x={x + 200} y={top - 4} width={50} height={22} fill="#8f8b83" />
      <rect x={x + 22} y={top - 4} width={22} height={20} fill="#ecebe5" stroke="#777" />
      <rect x={x + 25} y={top - 1} width={16} height={10} fill="#6f8798" />
      {/* トロリーとフック */}
      <rect x={trolleyX - 8} y={top} width={16} height={5} fill="#555" />
      <line x1={trolleyX - 2} y1={top + 5} x2={trolleyX - 2} y2={hookY - 8} stroke="#2a2a2a" strokeWidth={1.1} />
      <line x1={trolleyX + 2} y1={top + 5} x2={trolleyX + 2} y2={hookY - 8} stroke="#2a2a2a" strokeWidth={1.1} />
      {children}
    </g>
  );
}

/** 工事用エレベーター（ロングスパン）。overloaded で荷を積みすぎた状態を描く */
export function ConstructionLift({ overloaded = false }: { overloaded?: boolean }) {
  const x0 = 392;
  const x1 = 472;
  const mast = [];
  for (let y = GROUND; y > 190; y -= 20) mast.push(y);
  return (
    <g>
      <g stroke="#b9bcbf" strokeWidth={1.6} fill="none">
        <line x1={476} y1={GROUND} x2={476} y2={190} />
        <line x1={486} y1={GROUND} x2={486} y2={190} />
        {mast.map((y) => (
          <line key={y} x1={476} y1={y} x2={486} y2={y - 10} strokeWidth={1} />
        ))}
      </g>
      <rect x={x0} y={GROUND - 4} width={x1 - x0} height={4} fill="#55595c" />
      <g stroke="#e0a21c" strokeWidth={2} fill="none">
        <path d={`M${x0} ${GROUND - 4} V${GROUND - 32} H${x1} V${GROUND - 4}`} />
        <path d={`M${x0} ${GROUND - 18} H${x1}`} strokeWidth={1.2} />
      </g>
      <rect x={478} y={GROUND - 74} width={30} height={16} fill="#f4f2ea" stroke="#555" strokeWidth={0.5} />
      <Label x={493} y={GROUND - 68} size={4.5} fill="#222">
        積載荷重
      </Label>
      <Label x={493} y={GROUND - 61} size={5} fill="#c8322b">
        1,000kg
      </Label>
      {overloaded ? (
        <g>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <rect key={i} x={x0 + 4 + (i % 2) * 2} y={GROUND - 12 - i * 9} width={70} height={8} fill={i % 3 === 2 ? '#e9e6dd' : '#d8d4c7'} stroke="#9a968c" strokeWidth={0.6} />
          ))}
          {[0, 1, 2].map((i) => (
            <rect key={`p${i}`} x={x0 - 20} y={GROUND - 80 - i * 5} width={120} height={4} rx={2} fill="url(#g-metal)" stroke="#6e7377" strokeWidth={0.4} />
          ))}
          <rect x={x0 + 20} y={GROUND - 100} width={36} height={14} fill="#3b6ea8" />
        </g>
      ) : (
        <rect x={x0 + 10} y={GROUND - 20} width={40} height={16} fill="#d8d4c7" />
      )}
    </g>
  );
}

/** 外部足場（断面）。妻側から見た建枠・作業床・手すり・メッシュシート */
export function Scaffold({
  x0,
  x1,
  topLevel,
  side,
  missingRailLevel,
  openTop = false,
  children,
}: {
  x0: number;
  x1: number;
  topLevel: number;
  side: 'left' | 'right';
  missingRailLevel?: number;
  openTop?: boolean;
  children?: ReactNode;
}) {
  const levels = Array.from({ length: topLevel }, (_, i) => i + 1);
  const topY = liftY(topLevel);
  const outer = side === 'left' ? x0 : x1;
  return (
    <g>
      <g stroke="#9ea3a7" strokeWidth={2}>
        <line x1={x0} y1={GROUND} x2={x0} y2={topY - (openTop ? 4 : 30)} />
        <line x1={x1} y1={GROUND} x2={x1} y2={topY - (openTop ? 4 : 30)} />
      </g>
      {levels.map((k) => {
        const y = liftY(k);
        const rail = k !== missingRailLevel && !(openTop && k === topLevel);
        return (
          <g key={k}>
            <rect x={x0} y={y - 2} width={x1 - x0} height={3} fill="#7b8083" />
            <path d={`M${x0} ${y + 10} L${x0 + 6} ${y + 1} M${x1} ${y + 10} L${x1 - 6} ${y + 1}`} stroke="#9ea3a7" strokeWidth={1} />
            {rail && (
              <g stroke="#b5b9bc" strokeWidth={1.6}>
                <line x1={x0 - 2} y1={y - 22} x2={x1 + 2} y2={y - 22} />
                <line x1={x0 - 2} y1={y - 12} x2={x1 + 2} y2={y - 12} />
              </g>
            )}
            {k % 2 === 0 && <line x1={side === 'left' ? x1 : x0} y1={y - 30} x2={side === 'left' ? x1 + 8 : x0 - 8} y2={y - 30} stroke="#777" strokeWidth={1.4} />}
          </g>
        );
      })}
      {/* メッシュシート */}
      <rect x={outer - 2} y={topY - (openTop ? 2 : 30)} width={4} height={GROUND - topY + (openTop ? 2 : 30)} fill="#4f6150" opacity={0.55} />
      <rect x={outer - 2} y={topY - (openTop ? 2 : 30)} width={4} height={GROUND - topY + (openTop ? 2 : 30)} fill="url(#p-mesh)" />
      {children}
    </g>
  );
}
