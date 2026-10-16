import type { ReactNode } from 'react';
import type { Pose, Pt } from './workerGeom';
import { POSES, lerp, line, rad, skeleton } from './workerGeom';

export type { Pose } from './workerGeom';
export type { Anchor } from './workerGeom';

// 人物は cm 単位（身長 約170）で描き、s=0.25 で 1m=25px の断面図に合わせる。
export type Tool =
  | 'none'
  | 'grinder'
  | 'clipboard'
  | 'tablet'
  | 'baton'
  | 'drill'
  | 'shovel'
  | 'torch'
  | 'hammer'
  | 'stakes'
  | 'board'
  | 'staff'
  | 'roller'
  | 'pipe'
  | 'saw'
  | 'hacker'
  | 'ratchet'
  | 'wrench'
  | 'impact'
  | 'trowel'
  | 'flashlight'
  | 'pliers'
  | 'headWrench'
  | 'laptop'
  | 'sealant'
  | 'wrap'
  | 'duct';

export interface WorkerLook {
  jacket?: string;
  pants?: string;
  helmet?: string;
  /** ヘルメットのライン（ゼネコン社員の緑線など） */
  helmetLine?: string;
  /** ヘルメット側面の会社ステッカー色（helmet に "none" でヘルメットなし） */
  sticker?: string;
  /** 鳶のニッカズボン */
  nikka?: boolean;
  /** 反射ベスト（ガードマンなど） */
  vest?: boolean;
  /** 腕章の色（職長・安全当番など） */
  armband?: string;
  gloves?: boolean;
  harness?: 'none' | 'hooked' | 'unhooked';
}

export interface WorkerProps extends WorkerLook {
  x: number;
  y: number;
  pose?: Pose;
  flip?: boolean;
  s?: number;
  chinstrap?: boolean;
  glasses?: boolean;
  /** フックの掛け先（シーン座標） */
  hookTo?: [number, number];
  tool?: Tool;
  /** 酸素濃度計を胸に付けている */
  detector?: boolean;
  /** 腰まわり：腰袋／工具差し／結束線のリール */
  belt?: 'pouch' | 'holster' | 'wire';
}

const SKIN = '#c29674';
const STRAP = '#d4661c';

function Hook({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M${x - 3},${y - 4} v4 a3,3.4 0 1,0 6,0 v-2`}
      stroke="#c3c6c8"
      strokeWidth={1.8}
      fill="none"
    />
  );
}

function Sparks({ x, y, dir = 1 }: { x: number; y: number; dir?: number }) {
  const rays = [-60, -35, -15, 5, 25, 45];
  return (
    <g filter="url(#f-glow)">
      {rays.map((a, i) => {
        const len = 14 + (i % 3) * 9;
        return (
          <line
            key={a}
            x1={x}
            y1={y}
            x2={x + dir * len * Math.cos(rad(a))}
            y2={y + len * Math.sin(rad(a)) + 10}
            stroke={i % 2 ? '#ffd27a' : '#ff9d2e'}
            strokeWidth={1.1}
          />
        );
      })}
      <circle cx={x} cy={y} r={2.2} fill="#fff6d8" />
    </g>
  );
}

function HeldTool({ tool, a }: { tool: Tool; a: number }) {
  // 手の位置を原点に、+y が前腕の延長方向
  let body: ReactNode = null;
  switch (tool) {
    case 'grinder':
      body = (
        <g>
          <rect x={-3.5} y={-2} width={7} height={20} rx={2} fill="#2c3036" />
          <rect x={-2} y={6} width={9} height={3} fill="#3a3f45" />
          <circle cx={0} cy={23} r={7.5} fill="#8d8e8b" stroke="#55585a" strokeWidth={1} />
          <path d="M-8,23 A8,8 0 0,1 8,23" fill="#2c3036" />
          <Sparks x={4} y={30} />
        </g>
      );
      break;
    case 'torch':
      body = (
        <g>
          <rect x={-1.5} y={0} width={3} height={16} fill="#5c5f63" />
          <Sparks x={0} y={18} />
        </g>
      );
      break;
    case 'clipboard':
      body = (
        <g transform={`rotate(${a})`}>
          <rect x={-8} y={-4} width={16} height={20} rx={1} fill="#7d5f3d" />
          <rect x={-6.5} y={-1} width={13} height={15} fill="#f2efe7" />
          <rect x={-3} y={-6} width={6} height={3} fill="#8c8f92" />
        </g>
      );
      break;
    case 'tablet':
      body = (
        <g transform={`rotate(${a})`}>
          <rect x={-9} y={-2} width={18} height={13} rx={1.5} fill="#1f2226" />
          <rect x={-7.5} y={-0.5} width={15} height={10} fill="#6f8ea6" />
        </g>
      );
      break;
    case 'baton':
      body = (
        <g filter="url(#f-glow)">
          <rect x={-1.8} y={0} width={3.6} height={32} rx={1.5} fill="#ff5a2a" />
          <rect x={-1.8} y={0} width={3.6} height={6} fill="#ffe2d4" />
        </g>
      );
      break;
    case 'drill':
      body = (
        <g>
          <rect x={-3} y={-2} width={6} height={12} rx={1.5} fill="#2f6b4a" />
          <rect x={-3} y={8} width={14} height={6} rx={2} fill="#2f6b4a" />
          <rect x={11} y={10} width={7} height={1.6} fill="#aaa" />
        </g>
      );
      break;
    case 'hammer':
      body = (
        <g>
          <rect x={-1.5} y={0} width={3} height={24} fill="#7a5a39" />
          <rect x={-6} y={22} width={12} height={5} fill="#6d7175" />
        </g>
      );
      break;
    case 'saw':
      // 丸ノコ
      body = (
        <g>
          <rect x={-2.5} y={-2} width={5} height={9} rx={2} fill="#2a2d31" />
          <circle cx={0} cy={15} r={9} fill="#b9bcbe" stroke="#6d7174" strokeWidth={0.8} />
          <path d="M-10,15 A10,10 0 0,1 10,15 Z" fill="#2a7f8a" />
          <rect x={-6} y={5} width={12} height={5} rx={1.5} fill="#2a7f8a" />
        </g>
      );
      break;
    case 'hacker':
      // ハッカー（結束用）
      body = (
        <g>
          <rect x={-1.8} y={-2} width={3.6} height={11} rx={1.5} fill="#b8322b" />
          <path d="M0,9 V18 Q0,23 4,22" stroke="#b9bcbe" strokeWidth={1.6} fill="none" />
        </g>
      );
      break;
    case 'ratchet':
      // ラチェットレンチ（シノ付き）
      body = (
        <g>
          <circle cx={0} cy={0} r={3.5} fill="#8d9195" />
          <path d="M-1.4,2 L0,32 L1.4,2 Z" fill="#b9bcbe" stroke="#6d7174" strokeWidth={0.4} />
        </g>
      );
      break;
    case 'wrench':
      // パイプレンチ
      body = (
        <g>
          <rect x={-2} y={-2} width={4} height={26} rx={1.5} fill="#b8322b" />
          <rect x={-4.5} y={22} width={9} height={4} fill="#3a3d40" />
          <rect x={-4.5} y={28} width={9} height={3} fill="#3a3d40" />
          <rect x={2.5} y={22} width={2} height={9} fill="#3a3d40" />
        </g>
      );
      break;
    case 'impact':
      // インパクトドライバー
      body = (
        <g>
          <rect x={-2.5} y={-2} width={5} height={10} rx={1.5} fill="#1f6f78" />
          <rect x={-3} y={7} width={13} height={6} rx={2} fill="#1f6f78" />
          <rect x={10} y={9} width={6} height={1.5} fill="#c9c9c9" />
        </g>
      );
      break;
    case 'trowel':
      // コテ
      body = (
        <g>
          <rect x={-1.8} y={-2} width={3.6} height={8} rx={1.5} fill="#7a5a39" />
          <path d="M0,6 V9 M-9,10 H9 L7,13 H-7 Z" stroke="#9ea3a7" strokeWidth={1} fill="#c9ccce" />
        </g>
      );
      break;
    case 'flashlight':
      body = (
        <g>
          <rect x={-2} y={-2} width={4} height={14} rx={1.5} fill="#2a2d31" />
          <path d="M-2.5,12 L-14,40 L14,40 L2.5,12 Z" fill="#fff6c8" opacity={0.35} />
        </g>
      );
      break;
    case 'pliers':
      body = (
        <g>
          <path d="M-2,-1 L-1,10 M2,-1 L1,10" stroke="#c8322b" strokeWidth={2.2} />
          <path d="M-1,10 L0,17 L1,10" stroke="#8d9195" strokeWidth={1.6} fill="none" />
        </g>
      );
      break;
    case 'headWrench':
      body = (
        <g>
          <rect x={-1.2} y={-2} width={2.4} height={14} fill="#8d9195" />
          <rect x={-5} y={12} width={10} height={4} rx={1} fill="#6d7174" />
        </g>
      );
      break;
    case 'laptop':
      body = (
        <g transform={`rotate(${a})`}>
          <rect x={-11} y={0} width={22} height={2} fill="#555a60" />
          <rect x={-10} y={-13} width={20} height={13} rx={1} fill="#3a3f45" />
          <rect x={-8.5} y={-11.5} width={17} height={10} fill="#7f9fb8" />
        </g>
      );
      break;
    case 'sealant':
      // シーリングガン
      body = (
        <g>
          <rect x={-2} y={-2} width={4} height={8} fill="#2a2d31" />
          <rect x={-3.5} y={6} width={7} height={18} rx={1.5} fill="#cfd2d4" stroke="#8d9195" strokeWidth={0.6} />
          <path d="M-1,24 L0,31 L1,24 Z" fill="#e9e6dd" />
        </g>
      );
      break;
    case 'roller':
      body = (
        <g>
          <rect x={-1.2} y={0} width={2.4} height={60} fill="#c9c7c0" />
          <rect x={-10} y={60} width={20} height={6} rx={3} fill="#e8e3d6" stroke="#9a968c" strokeWidth={0.8} />
        </g>
      );
      break;
    default:
      body = null;
  }
  return body;
}

export function Worker(p: WorkerProps) {
  const {
    x,
    y,
    pose = 'stand',
    flip = false,
    s = 0.25,
    jacket = '#55606b',
    helmet = '#f2f1ec',
    nikka = false,
    chinstrap = true,
    glasses = false,
    harness = 'none',
    tool = 'none',
    gloves = true,
  } = p;
  const pants = p.pants ?? jacket;
  const P = POSES[pose];
  const { kneeL, footL, kneeR, footR, hipL, hipR, dy, shL, shR, elL, hdL, elR, hdR } = skeleton(pose);
  const dir = flip ? -1 : 1;
  const handC = gloves ? '#d6d0bf' : SKIN;
  const mid = lerp(hdL, hdR, 0.5);
  const ground = -dy;

  let lanyard: ReactNode = null;
  if (harness === 'hooked' && p.hookTo) {
    const ax = ((p.hookTo[0] - x) / s) * dir;
    const ay = (p.hookTo[1] - y) / s - dy;
    const sag: Pt = [ax / 2, Math.max(-137, ay) + 14];
    lanyard = (
      <g>
        <path d={`M0,-137 Q${sag[0]},${sag[1]} ${ax},${ay + 4}`} stroke={STRAP} strokeWidth={2.6} fill="none" />
        <Hook x={ax} y={ay + 4} />
      </g>
    );
  } else if (harness === 'unhooked') {
    lanyard = (
      <g>
        <path d="M0,-137 Q26,-128 22,-98" stroke={STRAP} strokeWidth={2.6} fill="none" />
        <Hook x={22} y={-96} />
      </g>
    );
  }

  let carried: ReactNode = null;
  if (tool === 'stakes') {
    carried = (
      <g transform={`translate(${mid[0]},${mid[1] - 4})`}>
        {[-3, 0, 3].map((o) => (
          <rect key={o} x={-70} y={o - 1.5} width={140} height={3} fill="#a98457" stroke="#6e5333" strokeWidth={0.4} />
        ))}
      </g>
    );
  } else if (tool === 'wrap') {
    carried = (
      <g transform={`translate(${mid[0]},${mid[1] - 6})`}>
        <rect x={-14} y={-7} width={28} height={14} rx={7} fill="#eceae2" stroke="#b5b1a6" strokeWidth={0.8} />
        <ellipse cx={14} cy={0} rx={3} ry={7} fill="#d8d4c8" stroke="#b5b1a6" strokeWidth={0.8} />
      </g>
    );
  } else if (tool === 'duct') {
    carried = (
      <g transform={`translate(${mid[0]},${mid[1] - 12})`}>
        <rect x={-46} y={-11} width={92} height={22} fill="url(#g-metal)" stroke="#6e7377" strokeWidth={0.8} />
        <path d="M-46,-11 L46,11 M-46,11 L46,-11" stroke="#8b9094" strokeWidth={0.5} />
        <rect x={-48} y={-12} width={3} height={24} fill="#8b9094" />
        <rect x={45} y={-12} width={3} height={24} fill="#8b9094" />
      </g>
    );
  } else if (tool === 'board') {
    carried = <rect x={mid[0] - 70} y={mid[1] - 6} width={140} height={5} fill="#ebe8df" stroke="#a7a39a" strokeWidth={0.6} />;
  } else if (tool === 'pipe') {
    carried = <rect x={mid[0] - 95} y={mid[1] - 5} width={190} height={4} rx={2} fill="url(#g-metal)" stroke="#6e7377" strokeWidth={0.4} />;
  } else if (tool === 'staff') {
    carried = (
      <g>
        <rect x={hdR[0] - 2} y={hdR[1] - 70} width={4} height={ground - hdR[1] + 70} fill="#f3f1ea" stroke="#999" strokeWidth={0.4} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={hdR[0] - 2} y={hdR[1] - 70 + i * 26} width={4} height={10} fill="#c8322b" />
        ))}
      </g>
    );
  } else if (tool === 'shovel') {
    const end: Pt = [hdR[0] + 30, ground - 6];
    carried = (
      <g>
        <path d={line(hdR, end)} stroke="#7a5a39" strokeWidth={3} />
        <path d={`M${end[0] - 6},${end[1] - 4} L${end[0] + 8},${end[1] - 4} L${end[0] + 4},${end[1] + 6} L${end[0] - 4},${end[1] + 6} Z`} fill="#6d7175" />
      </g>
    );
  } else if (tool !== 'none') {
    carried = (
      <g transform={`translate(${hdR[0]},${hdR[1]}) rotate(${-P.aR[1]})`}>
        <HeldTool tool={tool} a={P.aR[1]} />
      </g>
    );
  }

  const legW = nikka ? 17 : 14;
  const shinW = nikka ? 20 : 12.5;

  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={0} rx={24} ry={4} fill="#000" opacity={0.22} />
      <g transform={`translate(0,${dy})`}>
        {/* 脚 */}
        {[
          [hipL, kneeL, footL],
          [hipR, kneeR, footR],
        ].map(([h, k, f], i) => (
          <g key={i}>
            <path d={line(h, k)} stroke={pants} strokeWidth={legW} strokeLinecap="round" />
            <path d={line(k, f)} stroke={pants} strokeWidth={shinW} strokeLinecap="round" />
            <path d={line(h, k, f)} stroke="#000" strokeOpacity={0.14} strokeWidth={4} fill="none" />
            <rect x={f[0] - 8 + (i ? 2 : -2)} y={f[1] - 5} width={16} height={7} rx={3} fill="#24211e" />
          </g>
        ))}
        {/* 胴 */}
        <path d="M-19,-144 Q0,-148 19,-144 L15,-89 Q0,-85 -15,-89 Z" fill={jacket} />
        <path d="M-19,-144 Q0,-148 19,-144 L15,-89 Q0,-85 -15,-89 Z" fill="url(#g-shade-x)" />
        <path d="M-19,-144 Q0,-148 19,-144 L15,-89 Q0,-85 -15,-89 Z" fill="url(#g-shade-y)" />
        <path d="M-7,-146 L0,-136 L7,-146" stroke="#000" strokeOpacity={0.3} strokeWidth={1.2} fill="none" />
        <path d="M0,-136 V-90" stroke="#000" strokeOpacity={0.25} strokeWidth={0.8} />
        <rect x={-13} y={-130} width={8} height={7} fill="none" stroke="#000" strokeOpacity={0.22} strokeWidth={0.8} />
        <rect x={5} y={-130} width={8} height={7} fill="none" stroke="#000" strokeOpacity={0.22} strokeWidth={0.8} />
        <rect x={-15.5} y={-95} width={31} height={5} fill="#2b2a28" />
        {p.vest && (
          <g>
            <path d="M-17,-142 L-8,-142 L-4,-128 L4,-128 L8,-142 L17,-142 L14,-92 L-14,-92 Z" fill="#c6d63a" opacity={0.95} />
            <rect x={-15.5} y={-118} width={31} height={3.2} fill="#eceeed" />
            <rect x={-15} y={-104} width={30} height={3.2} fill="#eceeed" />
          </g>
        )}
        {harness !== 'none' && (
          <g stroke="#1f1f1f" strokeWidth={3} fill="none">
            <path d="M-12,-143 L-9,-94 M12,-143 L9,-94" />
            <path d="M-12,-124 H12" />
            <rect x={-3} y={-127} width={6} height={6} fill="#9a9da0" stroke="none" />
            <path d="M-14,-93 Q-17,-82 -9,-78 Q-2,-82 -3,-92 M14,-93 Q17,-82 9,-78 Q2,-82 3,-92" strokeWidth={2.4} />
          </g>
        )}
        {p.belt === 'pouch' && (
          <g>
            <path d="M8,-94 h11 v13 q-5.5,4 -11,0 z" fill="#6b4a2f" stroke="#3e2a1a" strokeWidth={0.6} />
            <path d="M8,-94 h11 v4 h-11 z" fill="#57391f" />
          </g>
        )}
        {p.belt === 'holster' && (
          <g>
            <rect x={8} y={-94} width={10} height={12} rx={1.5} fill="#2b2a28" />
            <path d="M10,-94 v-5 M13,-94 v-6 M16,-94 v-4" stroke="#c8322b" strokeWidth={1.4} />
          </g>
        )}
        {p.belt === 'wire' && (
          <g>
            <circle cx={13} cy={-88} r={5} fill="#9ea3a7" stroke="#6d7174" strokeWidth={0.6} />
            <circle cx={13} cy={-88} r={1.8} fill="#4a4d50" />
          </g>
        )}
        {p.detector && (
          <g>
            <rect x={-12} y={-122} width={9} height={11} rx={1.5} fill="#e8c21f" stroke="#5a4a10" strokeWidth={0.6} />
            <rect x={-10.5} y={-120} width={6} height={4} fill="#28323a" />
          </g>
        )}
        {/* 腕 */}
        {[
          [shL, elL, hdL, true],
          [shR, elR, hdR, false],
        ].map(([sh, el, hd, left], i) => (
          <g key={i}>
            <path d={line(sh as Pt, el as Pt, hd as Pt)} stroke={jacket} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d={line(sh as Pt, el as Pt, hd as Pt)} stroke="#000" strokeOpacity={0.16} strokeWidth={3} fill="none" />
            {left && p.armband && (
              <path d={line(lerp(sh as Pt, el as Pt, 0.28), lerp(sh as Pt, el as Pt, 0.6))} stroke={p.armband} strokeWidth={11.5} />
            )}
            <circle cx={(hd as Pt)[0]} cy={(hd as Pt)[1]} r={4.6} fill={handC} />
          </g>
        ))}
        {lanyard}
        {/* 頭 */}
        <rect x={-4.5} y={-151} width={9} height={10} fill={SKIN} />
        <rect x={-4.5} y={-151} width={9} height={10} fill="#000" opacity={0.15} />
        <ellipse cx={0} cy={-158} rx={9.5} ry={11} fill={SKIN} />
        <ellipse cx={-9.6} cy={-157} rx={1.8} ry={3} fill={SKIN} />
        <ellipse cx={9.6} cy={-157} rx={1.8} ry={3} fill={SKIN} />
        <path d="M-9.5,-158 Q-9,-150 0,-147 Q9,-150 9.5,-158 Q5,-152 0,-151 Q-5,-152 -9.5,-158 Z" fill="#000" opacity={0.12} />
        <ellipse cx={-3.6} cy={-158.5} rx={1.1} ry={0.6} fill="#2a1f18" opacity={0.75} />
        <ellipse cx={3.6} cy={-158.5} rx={1.1} ry={0.6} fill="#2a1f18" opacity={0.75} />
        <path d="M-9.4,-162 Q-10,-157 -8.6,-155 M9.4,-162 Q10,-157 8.6,-155" stroke="#2a241f" strokeWidth={2} fill="none" />
        {glasses && (
          <g>
            <rect x={-8.5} y={-161} width={17} height={4.6} rx={1.5} fill="#b9d6e6" opacity={0.6} />
            <rect x={-8.5} y={-161} width={17} height={4.6} rx={1.5} fill="none" stroke="#2e3236" strokeWidth={0.8} />
          </g>
        )}
        {helmet === 'none' ? (
          // ヘルメットなし（発注者・設計者など事務所の人）
          <path d="M-10,-160 Q-11,-172 0,-171.5 Q11,-172 10,-160 Q8,-166 0,-166 Q-8,-166 -10,-160 Z" fill="#2a241f" />
        ) : (
          <>
          {/* ヘルメット */}
          <path d="M-12.5,-161 C-12.5,-177 12.5,-177 12.5,-161 Z" fill={helmet} />
          <path d="M-12.5,-161 C-12.5,-177 12.5,-177 12.5,-161 Z" fill="url(#g-shade-x)" opacity={0.6} />
          {p.helmetLine && <path d="M-12.4,-165 Q0,-167.5 12.4,-165" stroke={p.helmetLine} strokeWidth={2.4} fill="none" />}
          <path d="M-14.5,-161.5 Q0,-158.5 15.5,-161.5 L15.5,-159.5 Q0,-156 -14.5,-159.5 Z" fill={helmet} stroke="#000" strokeOpacity={0.25} strokeWidth={0.6} />
          <ellipse cx={-4} cy={-171.5} rx={4} ry={2} fill="#fff" opacity={0.4} />
          {p.sticker && <rect x={4} y={-171} width={6} height={4} fill={p.sticker} />}
          {chinstrap ? (
            <path d="M-11.5,-160 Q-10,-150 -4,-147 Q0,-145.8 4,-147 Q10,-150 11.5,-160" stroke="#1c1c1c" strokeWidth={1.7} fill="none" />
          ) : (
            <g stroke="#1c1c1c" strokeWidth={1.7} fill="none">
              <path d="M-11.5,-160 Q-14,-150 -13,-140" />
              <path d="M11.5,-160 Q14.5,-151 13.5,-141" />
              <rect x={-14.5} y={-141} width={3} height={2.6} fill="#1c1c1c" stroke="none" />
            </g>
          )}
          </>
        )}
        {carried}
      </g>
    </g>
  );
}
