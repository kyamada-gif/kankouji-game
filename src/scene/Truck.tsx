import type { ReactNode } from 'react';
import { GROUND } from './geometry';
import { Excavator } from './machines';
import { Chiller } from './parts';
import type { Cargo, TruckKind } from './truckGeom';
import { TRUCK_LEN } from './truckGeom';

const CAB_W = 44;
const BED_Y = GROUND - 32;

function CargoArt({ cargo, x0, x1 }: { cargo: Cargo; x0: number; x1: number }) {
  const w = x1 - x0;
  const y = BED_Y;
  switch (cargo) {
    case 'soil':
      return (
        <g>
          <rect x={x0} y={y - 36} width={w} height={36} fill="#5e6a52" stroke="#3a4232" />
          <path d={`M${x0 + 2} ${y - 36} Q${x0 + w / 2} ${y - 62} ${x1 - 2} ${y - 36} Z`} fill="#6d563f" />
        </g>
      );
    case 'concrete':
      return (
        <g>
          <ellipse cx={x0 + w / 2} cy={y - 26} rx={w / 2} ry={26} fill="#e4e1d9" stroke="#8a877f" transform={`rotate(-12 ${x0 + w / 2} ${y - 26})`} />
          <path d={`M${x0 + 12} ${y - 30} q${w * 0.35} -18 ${w * 0.8} -14`} stroke="#b23a33" strokeWidth={3} fill="none" />
          <path d={`M${x0} ${y - 12} l-10 6`} stroke="#555" strokeWidth={4} />
        </g>
      );
    case 'panels':
      return (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x={x0} y={y - 4 - i * 4} width={w * 0.55} height={3.5} fill="#d6d5cf" stroke="#9c9b95" strokeWidth={0.5} />
          ))}
          <rect x={x0 + w * 0.58} y={y - 40} width={w * 0.42} height={40} fill="#e2e0d9" stroke="#9c9a93" />
          <rect x={x0 + w * 0.64} y={y - 32} width={w * 0.14} height={14} fill="url(#g-glass)" />
        </g>
      );
    case 'excavator':
      return (
        <g transform={`translate(${x0 + w * 0.45} ${y}) scale(0.8) translate(${-(x0 + w * 0.45)} ${-y})`}>
          <Excavator x={x0 + w * 0.45} y={y} reach={0.55} />
        </g>
      );
    case 'hbeam':
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={x0 - 6} y={y - 10 - i * 10} width={w + 12} height={9} fill="#5e5148" />
              <path d={`M${x0 - 6} ${y - 6 - i * 10} H${x1 + 6}`} stroke="#3e352f" strokeWidth={1} />
            </g>
          ))}
          <rect x={x0 + 20} y={y - 32} width={5} height={32} fill="#d0a52a" />
          <rect x={x1 - 25} y={y - 32} width={5} height={32} fill="#d0a52a" />
        </g>
      );
    case 'rebar':
      return (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={x0 - 20} y1={y - 3 - i * 2.5} x2={x1 + 10} y2={y - 3 - i * 2.5} stroke="#6b3e26" strokeWidth={1.6} />
          ))}
          <rect x={x0 + 30} y={y - 24} width={4} height={24} fill="#d0a52a" />
          <rect x={x1 - 34} y={y - 24} width={4} height={24} fill="#d0a52a" />
        </g>
      );
    case 'formwork':
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={x0} y={y - 6 - i * 6} width={w * 0.6} height={5.5} fill="url(#p-ply)" stroke="#8a5a2a" strokeWidth={0.4} />
          ))}
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={`s${i}`} x={x0 + w * 0.63} y={y - 5 - i * 5} width={w * 0.37} height={3} rx={1.5} fill="url(#g-metal)" stroke="#6e7377" strokeWidth={0.4} />
          ))}
        </g>
      );
    case 'sleeves':
    case 'temp-pipes':
      return (
        <g>
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={i} x={x0} y={y - 5 - i * 5} width={w * 0.6} height={4} rx={2} fill={cargo === 'temp-pipes' ? '#5b7fb5' : '#cfd2d4'} stroke="#6e7377" strokeWidth={0.4} />
          ))}
          {cargo === 'sleeves' &&
            [0, 1, 2].map((i) => (
              <rect key={`c${i}`} x={x0 + w * 0.64 + i * 14} y={y - 16} width={12} height={16} rx={2} fill="#d9dcde" stroke="#8b9094" />
            ))}
          {cargo === 'temp-pipes' && <rect x={x0 + w * 0.64} y={y - 22} width={w * 0.34} height={22} fill="#b38a57" stroke="#7d5f3a" />}
          <rect x={x0 + 4} y={y - 32} width={36} height={11} rx={2} fill="#2e63c8" />
        </g>
      );
    case 'chiller':
      return <Chiller x={x0 + 10} y={y} w={w - 20} h={46} />;
    case 'pipes':
      return (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <rect key={i} x={x0 - 10} y={y - 5 - i * 5} width={w * 0.62} height={4} rx={2} fill="url(#g-metal)" stroke="#6e7377" strokeWidth={0.4} />
          ))}
          <rect x={x0 + w * 0.56} y={y - 22} width={w * 0.44} height={22} fill="url(#g-metal)" stroke="#6e7377" />
          <rect x={x0 + w * 0.6} y={y - 44} width={w * 0.36} height={20} fill="url(#g-metal)" stroke="#6e7377" />
          <rect x={x0 + 4} y={y - 40} width={36} height={11} rx={2} fill="#2e63c8" />
        </g>
      );
    case 'board':
      return (
        <g>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={x0} y={y - 4 - i * 4} width={w * 0.66} height={3.6} fill="#ebe8df" stroke="#a7a39a" strokeWidth={0.4} />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <rect key={`l${i}`} x={x0 + w * 0.68} y={y - 4 - i * 4} width={w * 0.32} height={3} fill="#a9adb0" />
          ))}
        </g>
      );
    case 'fixtures':
      return (
        <g>
          <rect x={x0} y={y - 22} width={22} height={22} fill="#b38a57" stroke="#7d5f3a" />
          <rect x={x0 + 24} y={y - 22} width={22} height={22} fill="#b38a57" stroke="#7d5f3a" />
          <rect x={x0 + 12} y={y - 42} width={22} height={20} fill="#b38a57" stroke="#7d5f3a" />
          <circle cx={x0 + 62} cy={y - 9} r={9} fill="#e1cf72" stroke="#a8963e" />
          <circle cx={x0 + 82} cy={y - 9} r={9} fill="#e1cf72" stroke="#a8963e" />
          <rect x={x0 + 4} y={y - 54} width={36} height={11} rx={2} fill="#2e63c8" />
        </g>
      );
    case 'scrap':
      return (
        <g>
          <rect x={x0} y={y - 30} width={w} height={30} fill="none" stroke="#7d8184" strokeWidth={2} />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1={x0 + 4 + i * 6} y1={y - 3} x2={x0 + w - 10 - i * 4} y2={y - 26 + (i % 3) * 6} stroke="#9ea3a7" strokeWidth={2.4} />
          ))}
          <rect x={x0 + w * 0.5} y={y - 22} width={w * 0.4} height={14} fill="#d6d5cf" transform={`rotate(-8 ${x0 + w * 0.7} ${y - 15})`} />
          <rect x={x0 + 10} y={y - 18} width={30} height={12} fill="#b38a57" opacity={0.8} />
        </g>
      );
    case 'furniture':
      return (
        <g>
          {[0, 1, 2].map((r) =>
            [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={x0 + c * (w / 4)} y={y - 14 - r * 14} width={w / 4 - 2} height={13} fill="#b38a57" stroke="#7d5f3a" strokeWidth={0.6} />),
          )}
        </g>
      );
  }
}

export function Truck({ x, kind, cargo, label }: { x: number; kind: TruckKind; cargo: Cargo; label?: ReactNode }) {
  const len = TRUCK_LEN[kind];
  const y = GROUND;
  const cabX = x + len - CAB_W;
  const bedX1 = kind === 'unic' ? cabX - 16 : cabX - 6;
  const wheels = kind === 'trailer' ? [x + 30, x + 60, x + 90, cabX - 40, cabX - 12, x + len - 18] : kind === 'small' ? [x + 30, x + len - 22] : [x + 26, x + 56, x + len - 24];
  return (
    <g>
      <ellipse cx={x + len / 2} cy={y} rx={len / 2 + 6} ry={4} fill="#000" opacity={0.2} />
      <rect x={x} y={y - 28} width={len - 4} height={10} fill="#2f2f2f" />
      {kind === 'trailer' ? <rect x={x} y={BED_Y} width={cabX - x - 30} height={6} fill="#555a5e" /> : kind !== 'dump' && kind !== 'mixer' && <rect x={x + 4} y={BED_Y} width={bedX1 - x - 4} height={6} fill="#6a6d70" />}
      <CargoArt cargo={cargo} x0={x + 8} x1={kind === 'trailer' ? cabX - 34 : bedX1 - 2} />
      {kind === 'unic' && (
        <g>
          <rect x={cabX - 14} y={y - 84} width={9} height={58} fill="#e9e6df" stroke="#7d7a74" strokeWidth={0.6} />
          <rect x={x + 40} y={y - 86} width={cabX - x - 46} height={7} fill="#e9e6df" stroke="#7d7a74" strokeWidth={0.6} />
          <line x1={x + 44} y1={y - 79} x2={x + 44} y2={y - 60} stroke="#333" />
        </g>
      )}
      {/* キャブ */}
      <path d={`M${cabX} ${y - 22} V${y - 74} H${cabX + 30} L${cabX + CAB_W} ${y - 50} V${y - 22} Z`} fill={kind === 'mixer' ? '#e9e6df' : kind === 'trailer' ? '#5a6f86' : '#e9e6df'} stroke="#7d7a74" />
      <path d={`M${cabX + 14} ${y - 70} H${cabX + 29} L${cabX + 40} ${y - 50} H${cabX + 14} Z`} fill="#6f8798" />
      {wheels.map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={y - 12} r={12} fill="#1f1f1f" />
          <circle cx={cx} cy={y - 12} r={5} fill="#777" />
        </g>
      ))}
      {label}
    </g>
  );
}
