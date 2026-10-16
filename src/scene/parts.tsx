import type { ReactNode } from 'react';
import { EXC_BOTTOM, EXC_X0, EXC_X1, GROUND, H, W } from './geometry';

/* ---------- 基本 ---------- */

export function Conc({ x, y, w, h, fill = '#a4a097' }: { x: number; y: number; w: number; h: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} />
      <rect x={x} y={y} width={w} height={h} fill="url(#p-concrete)" />
    </g>
  );
}

export function Label({ x, y, children, size = 9, fill = '#e9ecee' }: { x: number; y: number; children: ReactNode; size?: number; fill?: string }) {
  return (
    <text x={x} y={y} fontSize={size} fill={fill} textAnchor="middle" fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
      {children}
    </text>
  );
}

/* ---------- 環境 ---------- */

export function Sky() {
  return <rect x={0} y={0} width={W} height={GROUND} fill="url(#g-sky)" />;
}

const CITY: [number, number, number][] = [
  [0, 560, 120],
  [120, 690, 110],
  [1770, 640, 100],
  [1870, 500, 130],
];

export function City() {
  return (
    <g opacity={0.5}>
      {CITY.map(([x, top, w]) => {
        const rows = Math.floor((GROUND - top - 30) / 26);
        return (
          <g key={x}>
            <rect x={x} y={top} width={w} height={GROUND - top} fill="#97a2aa" />
            {Array.from({ length: rows }, (_, r) =>
              Array.from({ length: Math.floor((w - 10) / 22) }, (_, c) => (
                <rect key={`${r}-${c}`} x={x + 8 + c * 22} y={top + 14 + r * 26} width={14} height={12} fill="#b9c3c9" />
              )),
            )}
          </g>
        );
      })}
    </g>
  );
}

export function Ground() {
  return (
    <g>
      <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="url(#g-soil)" />
      <rect x={0} y={GROUND} width={W} height={H - GROUND} fill="url(#p-soil)" />
      <rect x={0} y={GROUND} width={W} height={10} fill="#5a4a39" />
      <rect x={0} y={GROUND + 240} width={W} height={2} fill="#3e3328" opacity={0.5} />
      {/* 道路 */}
      <rect x={0} y={GROUND - 2} width={262} height={16} fill="#3b3c3e" />
      <rect x={0} y={GROUND - 2} width={262} height={3} fill="#55575a" />
      <rect x={248} y={GROUND - 6} width={16} height={8} fill="#b8b5ad" />
      {/* 敷地の地表（砕石） */}
      <rect x={264} y={GROUND - 1} width={W - 264} height={4} fill="#8e877b" />
    </g>
  );
}

export function Excavation() {
  const w = EXC_X1 - EXC_X0;
  return (
    <g>
      <rect x={EXC_X0} y={GROUND} width={w} height={EXC_BOTTOM - GROUND} fill="#6a5845" />
      <rect x={EXC_X0} y={GROUND} width={w} height={EXC_BOTTOM - GROUND} fill="url(#p-lagging)" />
      <rect x={EXC_X0} y={GROUND} width={w} height={EXC_BOTTOM - GROUND} fill="#000" opacity={0.18} />
      <rect x={EXC_X0} y={EXC_BOTTOM - 6} width={w} height={6} fill="#9a968e" />
      {/* 山留め（親杭）の切断面 */}
      <rect x={EXC_X0 - 10} y={GROUND - 4} width={10} height={1480 - GROUND} fill="#3f4042" />
      <rect x={EXC_X1} y={GROUND - 4} width={10} height={1480 - GROUND} fill="#3f4042" />
      {/* グラウンドアンカー */}
      {[1225, 1290].map((y) => (
        <g key={y} stroke="#2e2f31" strokeWidth={2.5}>
          <line x1={EXC_X0 - 10} y1={y} x2={EXC_X0 - 170} y2={y + 90} />
          <line x1={EXC_X0 - 120} y1={y + 62} x2={EXC_X0 - 170} y2={y + 90} strokeWidth={7} strokeLinecap="round" stroke="#7c7a74" />
          <line x1={EXC_X1 + 10} y1={y} x2={EXC_X1 + 170} y2={y + 90} />
          <line x1={EXC_X1 + 120} y1={y + 62} x2={EXC_X1 + 170} y2={y + 90} strokeWidth={7} strokeLinecap="round" stroke="#7c7a74" />
          <rect x={EXC_X0 - 2} y={y - 6} width={10} height={12} fill="#555" stroke="none" />
          <rect x={EXC_X1 - 8} y={y - 6} width={10} height={12} fill="#555" stroke="none" />
        </g>
      ))}
    </g>
  );
}

export function BackFence({ x0 = 284, x1 = 1956 }: { x0?: number; x1?: number }) {
  const seams = [];
  for (let x = x0; x < x1; x += 18) seams.push(x);
  return (
    <g>
      <rect x={x0} y={GROUND - 75} width={x1 - x0} height={75} fill="#d6d5cf" />
      {seams.map((x) => (
        <line key={x} x1={x} y1={GROUND - 75} x2={x} y2={GROUND} stroke="#b4b3ac" strokeWidth={1} />
      ))}
      <rect x={x0} y={GROUND - 77} width={x1 - x0} height={3} fill="#a9a8a1" />
      <rect x={x0} y={GROUND - 30} width={x1 - x0} height={4} fill="#5d7d98" opacity={0.6} />
    </g>
  );
}

export function Gate() {
  return (
    <g>
      <rect x={272} y={GROUND - 88} width={7} height={88} fill="#9a9ea2" />
      <rect x={262} y={GROUND - 104} width={60} height={16} fill="#f2f0e8" stroke="#555" strokeWidth={0.6} />
      <Label x={292} y={GROUND - 93} size={9} fill="#2a2a2a">
        工事用出入口
      </Label>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line key={i} x1={281 + i * 2.4} y1={GROUND - 70} x2={281 + i * 2.4} y2={GROUND} stroke="#9a9ea2" strokeWidth={1.2} />
      ))}
    </g>
  );
}

export function RightFence() {
  return <rect x={1956} y={GROUND - 75} width={8} height={75} fill="#c8c7c1" />;
}

export function SiteOffice({ dismantling = false }: { dismantling?: boolean }) {
  const x = 1752;
  const w = 184;
  const story = (y: number, key: string, wins: number[]) => (
    <g key={key}>
      <rect x={x} y={y} width={w} height={68} fill="#e2e0d9" stroke="#9c9a93" strokeWidth={1} />
      {Array.from({ length: 5 }, (_, i) => (
        <line key={i} x1={x + 36 * (i + 1)} y1={y} x2={x + 36 * (i + 1)} y2={y + 68} stroke="#c3c1ba" strokeWidth={0.8} />
      ))}
      {wins.map((dx) => (
        <rect key={dx} x={x + dx} y={y + 14} width={44} height={28} fill="url(#g-glass)" stroke="#7b7e80" strokeWidth={1.2} />
      ))}
      <rect x={x} y={y + 64} width={w} height={4} fill="#8f8d86" />
    </g>
  );
  return (
    <g>
      {story(GROUND - 68, '1f', [12, 70])}
      <rect x={x + 140} y={GROUND - 54} width={24} height={54} fill="#8a8d90" />
      {dismantling ? (
        <g stroke="#7b7e80" strokeWidth={3}>
          <line x1={x} y1={GROUND - 136} x2={x} y2={GROUND - 68} />
          <line x1={x + w} y1={GROUND - 136} x2={x + w} y2={GROUND - 68} />
          <line x1={x} y1={GROUND - 136} x2={x + 90} y2={GROUND - 136} />
        </g>
      ) : (
        <g>
          {story(GROUND - 136, '2f', [12, 70, 128])}
          <rect x={x + 10} y={GROUND - 156} width={164} height={18} fill="#f4f2ea" stroke="#777" strokeWidth={0.6} />
          <Label x={x + 92} y={GROUND - 143} size={10} fill="#222">
            （仮）○○ビル新築工事 現場事務所
          </Label>
        </g>
      )}
    </g>
  );
}

/** 掲示板：施工体系図・安全掲示 */
export function NoticeBoard({ x = 1650 }: { x?: number }) {
  return (
    <g>
      <rect x={x + 4} y={GROUND - 70} width={4} height={70} fill="#777" />
      <rect x={x + 76} y={GROUND - 70} width={4} height={70} fill="#777" />
      <rect x={x} y={GROUND - 78} width={84} height={46} fill="#f4f3ee" stroke="#4d5d6a" strokeWidth={2} />
      <Label x={x + 24} y={GROUND - 68} size={7} fill="#222">
        施工体系図
      </Label>
      <g stroke="#555" strokeWidth={0.7}>
        <line x1={x + 24} y1={GROUND - 64} x2={x + 24} y2={GROUND - 58} />
        <line x1={x + 10} y1={GROUND - 58} x2={x + 38} y2={GROUND - 58} />
        {[10, 24, 38].map((d) => (
          <g key={d}>
            <line x1={x + d} y1={GROUND - 58} x2={x + d} y2={GROUND - 52} />
            <rect x={x + d - 5} y={GROUND - 52} width={10} height={5} fill="#dfe6ec" />
            <line x1={x + d} y1={GROUND - 47} x2={x + d} y2={GROUND - 42} />
            <rect x={x + d - 4} y={GROUND - 42} width={8} height={4} fill="#dfe6ec" />
          </g>
        ))}
      </g>
      <rect x={x + 50} y={GROUND - 74} width={30} height={38} fill="#2f8a4a" />
      <path d={`M${x + 65} ${GROUND - 66} v18 M${x + 56} ${GROUND - 57} h18`} stroke="#fff" strokeWidth={4} />
    </g>
  );
}

export function PowerPole({ x = 1946 }: { x?: number }) {
  return (
    <g>
      <rect x={x - 3} y={GROUND - 250} width={7} height={250} fill="#8b8a85" />
      <rect x={x - 22} y={GROUND - 238} width={44} height={4} fill="#6f6e6a" />
      <rect x={x - 12} y={GROUND - 200} width={14} height={22} rx={3} fill="#8f969a" />
      <rect x={x + 4} y={GROUND - 120} width={14} height={22} fill="#b9bcb8" stroke="#666" strokeWidth={0.6} />
      <path d={`M${x} ${GROUND - 232} Q${x - 4} ${GROUND - 160} 1936 ${GROUND - 120}`} stroke="#222" strokeWidth={1.2} fill="none" />
    </g>
  );
}

export function Tree({ x, h = 120 }: { x: number; h?: number }) {
  return (
    <g>
      <rect x={x - 3} y={GROUND - h * 0.45} width={6} height={h * 0.45} fill="#5a4632" />
      <ellipse cx={x} cy={GROUND - h * 0.7} rx={h * 0.28} ry={h * 0.33} fill="#4f6a43" />
      <ellipse cx={x - h * 0.1} cy={GROUND - h * 0.78} rx={h * 0.16} ry={h * 0.18} fill="#62804f" />
    </g>
  );
}

/* ---------- 小物 ---------- */

export function Cone({ x, y = GROUND }: { x: number; y?: number }) {
  return (
    <g>
      <rect x={x - 8} y={y - 2} width={16} height={2} fill="#2b2b2b" />
      <path d={`M${x - 6} ${y - 2} L${x - 1.5} ${y - 18} H${x + 1.5} L${x + 6} ${y - 2} Z`} fill="#e2522b" />
      <path d={`M${x - 4.2} ${y - 8} H${x + 4.2} L${x + 3.2} ${y - 12} H${x - 3.2} Z`} fill="#f1f1ec" />
    </g>
  );
}

export function ConeBar({ x0, x1, y = GROUND }: { x0: number; x1: number; y?: number }) {
  const n = Math.max(1, Math.round((x1 - x0) / 12));
  return (
    <g>
      <Cone x={x0} y={y} />
      <Cone x={x1} y={y} />
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x0 + ((x1 - x0) / n) * i} y={y - 17} width={(x1 - x0) / n} height={3.5} fill={i % 2 ? '#1f1f1f' : '#e9c21f'} />
      ))}
    </g>
  );
}

/** 単管バリケード（掘削の囲い） */
export function Barricade({ x0, x1, y = GROUND }: { x0: number; x1: number; y?: number }) {
  const posts = [];
  for (let x = x0; x <= x1; x += 30) posts.push(x);
  return (
    <g>
      {posts.map((x) => (
        <rect key={x} x={x - 1.5} y={y - 28} width={3} height={28} fill="#9ea3a7" />
      ))}
      <rect x={x0} y={y - 28} width={x1 - x0} height={3} fill="#9ea3a7" />
      <rect x={x0} y={y - 16} width={x1 - x0} height={3} fill="#9ea3a7" />
      <rect x={x0} y={y - 27} width={x1 - x0} height={10} fill="#e9c21f" opacity={0.25} />
    </g>
  );
}

export function Boxes({ x, y, cols, rows, w = 16, h = 12 }: { x: number; y: number; cols: number; rows: number; w?: number; h?: number }) {
  const items = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols - (r % 2 && cols > 1 ? 1 : 0); c++) items.push([c * w + (r % 2) * (w / 2), r]);
  return (
    <g>
      {items.map(([dx, r]) => (
        <g key={`${dx}-${r}`}>
          <rect x={x + dx} y={y - (r + 1) * h} width={w - 1} height={h - 0.5} fill="#b38a57" stroke="#7d5f3a" strokeWidth={0.6} />
          <rect x={x + dx + w / 2 - 1.5} y={y - (r + 1) * h} width={3} height={h - 0.5} fill="#cfb17d" opacity={0.8} />
        </g>
      ))}
    </g>
  );
}

export function CordReel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 9} y={y - 3} width={18} height={3} fill="#444" />
      <circle cx={x} cy={y - 12} r={10} fill="#d24b2a" />
      <circle cx={x} cy={y - 12} r={6.5} fill="#2a2a2a" />
      <circle cx={x} cy={y - 12} r={2.5} fill="#bbb" />
    </g>
  );
}

/** 延長コード。damage があるとその位置で被覆が破れ心線が見える */
export function Cord({ d, damage }: { d: string; damage?: [number, number] }) {
  return (
    <g>
      <path d={d} stroke="#1d1d1d" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      {damage && (
        <g>
          <rect x={damage[0] - 5} y={damage[1] - 2.5} width={10} height={5} fill="#d8c69a" opacity={0.5} />
          <path d={`M${damage[0] - 5} ${damage[1]} q2.5 -3 5 0 t5 0`} stroke="#c8322b" strokeWidth={1.1} fill="none" />
          <path d={`M${damage[0] - 5} ${damage[1] + 0.6} q2.5 2.4 5 0 t5 0`} stroke="#f4f4f0" strokeWidth={1.1} fill="none" />
          <path d={`M${damage[0] - 1} ${damage[1] - 1} l2 -3 M${damage[0] + 1} ${damage[1] + 1} l1.5 3`} stroke="#c58a3a" strokeWidth={0.8} />
        </g>
      )}
    </g>
  );
}

export function StepLadder({ x, y, h }: { x: number; y: number; h: number }) {
  const steps = Math.floor(h / 7);
  return (
    <g stroke="#a9adb0" strokeWidth={2} fill="none">
      <path d={`M${x - 7} ${y - h} L${x - 14} ${y} M${x + 7} ${y - h} L${x + 14} ${y}`} />
      {Array.from({ length: steps }, (_, i) => {
        const t = (i + 1) / (steps + 1);
        const yy = y - h + h * t;
        return <line key={i} x1={x - 7 - 7 * t} y1={yy} x2={x - 2} y2={yy} strokeWidth={1.4} />;
      })}
      <rect x={x - 9} y={y - h - 2.5} width={18} height={3} fill="#8d9195" stroke="none" />
    </g>
  );
}

export function RollingTower({ x, y, h = 30, w = 44 }: { x: number; y: number; h?: number; w?: number }) {
  return (
    <g stroke="#9ea3a7" strokeWidth={1.8} fill="none">
      <path d={`M${x - w / 2} ${y - 3} V${y - h - 26} M${x + w / 2} ${y - 3} V${y - h - 26}`} />
      <path d={`M${x - w / 2} ${y - h / 2} H${x + w / 2} M${x - w / 2} ${y - h - 13} H${x + w / 2} M${x - w / 2} ${y - h - 26} H${x + w / 2}`} />
      <path d={`M${x - w / 2} ${y - 3} L${x + w / 2} ${y - h / 2}`} strokeWidth={1} />
      <rect x={x - w / 2} y={y - h - 2} width={w} height={3} fill="#7f8486" stroke="none" />
      <circle cx={x - w / 2} cy={y - 2} r={2.5} fill="#333" stroke="none" />
      <circle cx={x + w / 2} cy={y - 2} r={2.5} fill="#333" stroke="none" />
    </g>
  );
}

export function Extinguisher({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 4} y={y - 18} width={8} height={18} rx={3} fill="#c8322b" />
      <rect x={x - 2} y={y - 21} width={4} height={3} fill="#333" />
    </g>
  );
}

export function ExitSign({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 14} y={y - 7} width={28} height={14} fill="#2f9a55" />
      <rect x={x + 3} y={y - 5} width={8} height={10} fill="#e9f5ec" />
      <circle cx={x - 4} cy={y - 3} r={1.6} fill="#fff" />
      <path d={`M${x - 4} ${y - 1} l-3 5 M${x - 4} ${y - 1} l3 5 M${x - 7} ${y} h6`} stroke="#fff" strokeWidth={1.2} />
    </g>
  );
}

export function Desk({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 30} y={y - 18} width={60} height={2.5} fill="#cfc7b8" />
      <rect x={x - 28} y={y - 16} width={2} height={16} fill="#8b8f93" />
      <rect x={x + 26} y={y - 16} width={2} height={16} fill="#8b8f93" />
      <rect x={x - 12} y={y - 26} width={14} height={8} fill="#2b2e33" />
      <path d={`M${x + 34} ${y} v-12 h8 v-10`} stroke="#3c4148" strokeWidth={2.5} fill="none" />
    </g>
  );
}

/* ---------- 吊り荷 ---------- */

export function Slings({ hx, hy, x0, x1, y }: { hx: number; hy: number; x0: number; x1: number; y: number }) {
  return (
    <g>
      <path d={`M${x0 + 4} ${y} L${hx} ${hy} L${x1 - 4} ${y}`} stroke="#3a3a3a" strokeWidth={1.4} fill="none" />
      <path d={`M${hx - 4} ${hy - 8} h8 v6 q-4 6 -8 0 z`} fill="#d0a52a" stroke="#555" strokeWidth={0.6} />
    </g>
  );
}

export function SteelBundle({ x0, x1, y, h = 13, color = '#5e5148' }: { x0: number; x1: number; y: number; h?: number; color?: string }) {
  return (
    <g>
      <rect x={x0} y={y} width={x1 - x0} height={h} fill={color} />
      {Array.from({ length: Math.floor(h / 4) }, (_, i) => (
        <line key={i} x1={x0} y1={y + 2 + i * 4} x2={x1} y2={y + 2 + i * 4} stroke="#000" strokeOpacity={0.3} strokeWidth={0.8} />
      ))}
      <rect x={x0 + 10} y={y - 1} width={4} height={h + 2} fill="#d0a52a" />
      <rect x={x1 - 14} y={y - 1} width={4} height={h + 2} fill="#d0a52a" />
    </g>
  );
}

/* ---------- 設備機器 ---------- */

export function Chiller({ x, y, w = 110, h = 52 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill="#d9dbd8" stroke="#8e9290" strokeWidth={1} />
      {Array.from({ length: Math.floor(w / 6) }, (_, i) => (
        <line key={i} x1={x + 4 + i * 6} y1={y - h + 14} x2={x + 4 + i * 6} y2={y - 6} stroke="#a5a9a7" strokeWidth={1} />
      ))}
      {[0.25, 0.75].map((t) => (
        <g key={t}>
          <rect x={x + w * t - 18} y={y - h - 8} width={36} height={8} fill="#b7bab8" />
          <ellipse cx={x + w * t} cy={y - h - 8} rx={18} ry={2.5} fill="#5d6163" />
        </g>
      ))}
    </g>
  );
}

export function WaterTank({ x, y, w = 110, h = 55 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill="#b8c6cd" stroke="#7c8b93" strokeWidth={1} />
      {Array.from({ length: Math.floor(w / 18) }, (_, i) => (
        <line key={i} x1={x + 18 * (i + 1)} y1={y - h} x2={x + 18 * (i + 1)} y2={y} stroke="#91a2aa" />
      ))}
      <line x1={x} y1={y - h / 2} x2={x + w} y2={y - h / 2} stroke="#91a2aa" />
    </g>
  );
}

export function Pump({ x, y, color = '#3b6ea8' }: { x: number; y: number; color?: string }) {
  return (
    <g>
      <rect x={x - 14} y={y - 5} width={28} height={5} fill="#8d8a84" />
      <rect x={x - 12} y={y - 16} width={14} height={11} rx={3} fill={color} />
      <circle cx={x + 7} cy={y - 11} r={6} fill={color} />
      <rect x={x + 5} y={y - 30} width={4} height={14} fill="#7c8186" />
    </g>
  );
}
