import type { StageId } from '../types';
import { ACTORS } from '../data/actors';
import { TRUCKS } from '../data/trucks';
import { ActorLayer } from '../scene/ActorLayer';
import { StageArt } from '../scene/StageArt';
import { Truck } from '../scene/Truck';
import { BANDS } from '../industry/graph';
import { Vignette } from '../industry/Vignettes';

/** 断面図の一部を切り取ったサムネイル */
export function SceneThumb({ stage, crop }: { stage: StageId; crop: [number, number, number] }) {
  const [cx, cy, w] = crop;
  const h = w * 0.6;
  return (
    <svg viewBox={`${cx - w / 2} ${cy - h / 2} ${w} ${h}`} aria-hidden="true">
      <StageArt stage={stage} />
      {TRUCKS.filter((t) => t.stage === stage).map((t) => (
        <Truck key={t.id} x={t.x} kind={t.kind} cargo={t.cargo} />
      ))}
      <ActorLayer actors={ACTORS.filter((a) => a.stage === stage)} />
    </svg>
  );
}

/** 構造図の層を簡略化したサムネイル */
export function LayersThumb({ money = false }: { money?: boolean }) {
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true">
      <rect width={300} height={180} fill="#f1efe9" />
      {BANDS.map((b, i) => {
        const y = 8 + i * 28;
        const w = 220 - i * 22;
        return (
          <g key={b.id}>
            <rect x={150 - w / 2} y={y} width={w} height={22} rx={4} fill={i === 3 ? '#2e63c8' : '#5b6770'} opacity={0.15 + i * 0.1} />
            <text x={150} y={y + 15} fontSize={11.5} textAnchor="middle" fontWeight={700} fill="#1d2024" fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
              {b.label}
            </text>
            {money && i < 5 && <path d={`M${150 + w / 2 + 10} ${y + 14} v20`} stroke="#c9a227" strokeWidth={6 - i} markerEnd="url(#thumb-arrow)" />}
          </g>
        );
      })}
      <defs>
        <marker id="thumb-arrow" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0 0 L10 0 L5 10 z" fill="#c9a227" />
        </marker>
      </defs>
      {!money && <Vignette id="dispatch" x={222} y={118} w={70} />}
    </svg>
  );
}
