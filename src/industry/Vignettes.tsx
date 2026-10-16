import type { JSX } from 'react';
import type { LayerId } from './graph';
import { Worker } from '../scene/Worker';
import type { WorkerLook } from '../scene/Worker';
import { LOOK } from '../scene/looks';
import { Chiller } from '../scene/parts';

// 各層に添える写実寄りの小さな絵（200x110）
const SUIT: WorkerLook = { jacket: '#2c3440', pants: '#2c3440', helmet: 'none', gloves: false };
const SUIT2: WorkerLook = { jacket: '#4a4f57', pants: '#3a3e44', helmet: 'none', gloves: false };
const S = 0.45;
const FLOOR = 104;

function Room({ wall = '#d9d5cc', floor = '#a9a49a' }: { wall?: string; floor?: string }) {
  return (
    <g>
      <rect x={0} y={0} width={200} height={FLOOR} fill={wall} />
      <rect x={0} y={FLOOR} width={200} height={6} fill={floor} />
    </g>
  );
}

function Owner() {
  return (
    <g>
      <Room wall="#dcd8cf" />
      <rect x={130} y={10} width={58} height={40} fill="url(#g-glass)" stroke="#8a8d90" />
      <rect x={40} y={70} width={110} height={4} fill="#6d5a45" />
      <rect x={46} y={74} width={4} height={30} fill="#5a4a39" />
      <rect x={140} y={74} width={4} height={30} fill="#5a4a39" />
      {/* 建物の模型 */}
      <rect x={82} y={44} width={22} height={26} fill="#eceae4" stroke="#999" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={84} y1={50 + i * 5} x2={102} y2={50 + i * 5} stroke="#9aa5ad" />
      ))}
      <Worker x={34} y={FLOOR} s={S} {...SUIT} pose="work" tool="clipboard" />
      <Worker x={168} y={FLOOR} s={S} {...SUIT2} pose="point" flip />
    </g>
  );
}

function Designer() {
  return (
    <g>
      <Room wall="#e2ded6" />
      <rect x={60} y={66} width={100} height={4} fill="#c9c4b8" />
      <rect x={64} y={70} width={3} height={34} fill="#777" />
      <rect x={152} y={70} width={3} height={34} fill="#777" />
      <rect x={66} y={58} width={88} height={9} fill="#f6f5f0" transform="rotate(-4 110 62)" />
      <path d="M72 60 h30 v-2 M110 59 h36 M80 63 h50" stroke="#4d7ab0" strokeWidth={0.8} />
      <rect x={20} y={12} width={60} height={36} fill="#f6f5f0" stroke="#aaa" />
      <path d="M26 20 h48 M26 28 h30 M26 36 h40" stroke="#4d7ab0" strokeWidth={0.8} />
      <Worker x={46} y={FLOOR} s={S} {...SUIT2} pose="point" />
      <Worker x={176} y={FLOOR} s={S} jacket="#6b6a66" pants="#3a3e44" helmet="none" gloves={false} pose="work" tool="tablet" flip />
    </g>
  );
}

function General() {
  return (
    <g>
      <Room wall="#d6d2c8" />
      <rect x={70} y={10} width={110} height={52} fill="#f4f3ee" stroke="#8a8d90" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line x1={76} y1={18 + i * 9} x2={174} y2={18 + i * 9} stroke="#c9ccc9" />
          <rect x={80 + i * 14} y={15 + i * 9} width={30 + (i % 2) * 14} height={5} fill={i === 3 ? '#2e63c8' : '#c9a227'} />
        </g>
      ))}
      <Worker x={42} y={FLOOR} s={S} {...LOOK.gc} pose="work" tool="clipboard" />
      <Worker x={150} y={FLOOR} s={S} {...LOOK.gcSafety} pose="point" flip />
    </g>
  );
}

function First() {
  return (
    <g>
      <Room wall="#b9b5ac" floor="#8f8a80" />
      {[22, 30, 38].map((y) => (
        <line key={y} x1={0} y1={y} x2={200} y2={y} stroke={y === 30 ? '#2e63c8' : '#2f8f9d'} strokeWidth={4} />
      ))}
      <rect x={0} y={8} width={200} height={9} fill="url(#g-metal)" />
      <Worker x={60} y={FLOOR} s={S} {...LOOK.mech} pose="work" tool="tablet" />
      <Worker x={140} y={FLOOR} s={S} {...LOOK.mech} jacket="#3d4c63" pose="point" flip />
    </g>
  );
}

function Second() {
  return (
    <g>
      <Room wall="#aaa69d" floor="#8f8a80" />
      <rect x={0} y={10} width={200} height={9} fill="url(#g-metal)" />
      <Worker x={56} y={FLOOR} s={S} {...LOOK.plumber} armband={LOOK.foremanBand} pose="point" />
      <Worker x={140} y={FLOOR} s={S} {...LOOK.plumber} pose="carry" tool="pipe" />
    </g>
  );
}

function Crafts() {
  return (
    <g>
      <Room wall="#a6a299" floor="#8f8a80" />
      <line x1={0} y1={20} x2={200} y2={20} stroke="#2f8f9d" strokeWidth={5} />
      <Worker x={52} y={FLOOR} s={S} {...LOOK.plumber} pose="crouch" tool="wrench" belt="pouch" />
      <path d="M128 104 L138 66 M152 104 L142 66" stroke="#b0b4b7" strokeWidth={2} />
      <Worker x={140} y={80} s={S} {...LOOK.duct} pose="reach" tool="duct" />
    </g>
  );
}

function Supplier() {
  return (
    <g>
      <Room wall="#c9c6be" floor="#9a968c" />
      <g transform="translate(0,0)">
        <Chiller x={78} y={FLOOR} w={80} h={44} />
      </g>
      {[0, 1].map((r) =>
        [0, 1].map((c) => <rect key={`${r}${c}`} x={170 + c * 14} y={FLOOR - 14 - r * 14} width={13} height={13} fill="#b38a57" stroke="#7d5f3a" />),
      )}
      <Worker x={40} y={FLOOR} s={S} jacket="#5a6470" helmet="#f2f1ec" sticker="#7a8a9a" pose="work" tool="clipboard" />
    </g>
  );
}

function Dispatch() {
  return (
    <g>
      <Room wall="#e2ded6" />
      <rect x={70} y={66} width={70} height={4} fill="#c9c4b8" />
      <rect x={95} y={52} width={22} height={14} fill="#3a3f45" />
      <rect x={97} y={54} width={18} height={10} fill="#7f9fb8" />
      <Worker x={44} y={FLOOR} s={S} {...SUIT} pose="point" />
      <Worker x={160} y={FLOOR} s={S} {...LOOK.mech} pose="work" tool="tablet" flip />
    </g>
  );
}

const MAP: Record<LayerId, () => JSX.Element> = {
  owner: Owner,
  designer: Designer,
  gc: General,
  first: First,
  second: Second,
  crafts: Crafts,
  supplier: Supplier,
  dispatch: Dispatch,
};

/** 200x110 の絵。x,y,w で配置 */
export function Vignette({ id, x = 0, y = 0, w = 200 }: { id: LayerId; x?: number; y?: number; w?: number }) {
  const C = MAP[id];
  const k = w / 200;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <clipPath id={`vg-${id}-${x}-${y}`}>
        <rect width={200} height={110} rx={6} />
      </clipPath>
      <g clipPath={`url(#vg-${id}-${x}-${y})`}>
        <C />
      </g>
      <rect width={200} height={110} rx={6} fill="none" stroke="rgba(0,0,0,.25)" />
    </g>
  );
}
