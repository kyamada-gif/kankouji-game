import type { CSSProperties } from 'react';
import { Defs } from '../scene/Defs';
import { Vignette } from './Vignettes';
import type { DispatchTo, Edge, FlowType, LayerId, Method, NodeId } from './graph';
import { BANDS, FLOWS, NODE_H, NODE_LAYER, NODE_W, POSITIONS, SIDE, VIEW_H, VIEW_W, edgesFor, nodeLabel } from './graph';
import type { Highlight } from './rules';
import { YouIcon } from './YouIcon';

interface Props {
  method: Method;
  flow: FlowType;
  dispatchTo: DispatchTo;
  highlight: Highlight | null;
  selectedLayer: LayerId | null;
  onPickLayer: (id: LayerId) => void;
}

const ALL: NodeId[] = ['owner', 'designer', 'gc', 'gc2', 'arch', 'mech', 'elec', 'archSub', 'piping', 'ductco', 'elecSub', 'crArch', 'crPipe', 'crDuct', 'crElec', 'maker', 'trader', 'dispatch'];
const FONT = "'Hiragino Sans','Noto Sans JP',sans-serif";
const NG = '#c8322b';
const OK = '#2e7d4f';

type P = [number, number];

/** 2つの箱を結ぶ線（上下なら縦、横並びや脇の列なら横） */
function link(a: P, b: P) {
  const side = a[0] > SIDE.x0 || b[0] > SIDE.x0;
  const dy = b[1] - a[1];
  if (side || Math.abs(dy) < 20) {
    const dir = b[0] > a[0] ? 1 : -1;
    const p1: P = [a[0] + (dir * NODE_W) / 2, a[1]];
    const p2: P = [b[0] - (dir * NODE_W) / 2, b[1]];
    const mx = (p1[0] + p2[0]) / 2;
    return { d: `M${p1[0]} ${p1[1]} C${mx} ${p1[1]} ${mx} ${p2[1]} ${p2[0]} ${p2[1]}`, mid: [mx, (p1[1] + p2[1]) / 2] as P, p1, p2 };
  }
  const dir = dy > 0 ? 1 : -1;
  const p1: P = [a[0], a[1] + (dir * NODE_H) / 2];
  const p2: P = [b[0], b[1] - (dir * NODE_H) / 2];
  const my = (p1[1] + p2[1]) / 2;
  return { d: `M${p1[0]} ${p1[1]} C${p1[0]} ${my} ${p2[0]} ${my} ${p2[0]} ${p2[1]}`, mid: [(p1[0] + p2[0]) / 2, my] as P, p1, p2 };
}

function Pill({ at, text, color, big }: { at: P; text: string; color: string; big?: boolean }) {
  if (!text) return null;
  const fs = big ? 17 : 12.5;
  const w = text.length * fs * 0.98 + 14;
  return (
    <g>
      <rect x={at[0] - w / 2} y={at[1] - fs * 0.9} width={w} height={fs * 1.6} rx={fs * 0.4} fill="#fff" stroke={color} strokeWidth={1.5} />
      <text x={at[0]} y={at[1] + fs * 0.38} fontSize={fs} fill={color === '#fff' ? '#111' : color} textAnchor="middle" fontWeight={700} fontFamily={FONT}>
        {text}
      </text>
    </g>
  );
}

function Cross({ at }: { at: P }) {
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={13} fill="#fff" stroke={NG} strokeWidth={3} />
      <path d={`M${at[0] - 6} ${at[1] - 6} L${at[0] + 6} ${at[1] + 6} M${at[0] + 6} ${at[1] - 6} L${at[0] - 6} ${at[1] + 6}`} stroke={NG} strokeWidth={3.5} />
    </g>
  );
}

function EdgeView({ e, pos, color }: { e: Edge; pos: Partial<Record<NodeId, P>>; color: string }) {
  const a = pos[e.from];
  const b = pos[e.to];
  if (!a || !b) return null;
  const { d, mid, p1, p2 } = link(a, b);
  const c = e.ng ? NG : color;
  const w = e.w ?? (e.main ? 4 : 2.5);
  return (
    <g>
      <path d={d} fill="none" stroke="#fff" strokeWidth={w + 4} strokeOpacity={0.85} />
      <path
        d={d}
        fill="none"
        stroke={c}
        strokeWidth={w}
        strokeDasharray={e.ng || e.dashed ? '8 6' : undefined}
        className={e.main && !e.plain ? 'ind-flow' : undefined}
        markerEnd={e.plain || e.ng ? undefined : `url(#arrow-${c.slice(1)})`}
      />
      {e.plain && (
        <>
          <circle cx={p1[0]} cy={p1[1]} r={4.5} fill={c} />
          <circle cx={p2[0]} cy={p2[1]} r={4.5} fill={c} />
        </>
      )}
      {e.ng && <Cross at={mid} />}
      {e.label && <Pill at={e.ng ? [mid[0], mid[1] + 26] : mid} text={e.label} color={c} big={e.main && !!e.w && e.w >= 4} />}
    </g>
  );
}

export function Diagram({ method, flow, dispatchTo, highlight, selectedLayer, onPickLayer }: Props) {
  const pos = POSITIONS[method] as Partial<Record<NodeId, P>>;
  const color = FLOWS.find((f) => f.id === flow)!.color;
  const edges = edgesFor(flow, method, dispatchTo);
  const hl = highlight;
  const target = pos[dispatchTo === 'gc' ? 'gc' : 'mech']!;
  const youAt: P = [target[0] + NODE_W / 2 + 26, target[1] - 8];

  const frameOf = (ids: NodeId[], pad = 14) => {
    const ps = ids.map((i) => pos[i]).filter(Boolean) as P[];
    const x0 = Math.min(...ps.map((p) => p[0])) - NODE_W / 2 - pad;
    const x1 = Math.max(...ps.map((p) => p[0])) + NODE_W / 2 + pad;
    const y0 = Math.min(...ps.map((p) => p[1])) - NODE_H / 2 - pad;
    const y1 = Math.max(...ps.map((p) => p[1])) + NODE_H / 2 + pad;
    return { x0, y0, x1, y1 };
  };

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="ind-svg" role="img" aria-label="多重下請け構造の図">
      <Defs />
      <defs>
        {[...FLOWS.map((f) => f.color), NG, OK].map((c) => (
          <marker key={c} id={`arrow-${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {/* 層の帯 */}
      {BANDS.map((b, i) => {
        const lit = hl?.layers?.includes(b.id) || selectedLayer === b.id;
        return (
          <g key={b.id} className="ind-band" onClick={() => onPickLayer(b.id)}>
            <rect x={0} y={b.y0} width={SIDE.x0 - 10} height={b.y1 - b.y0} fill={lit ? '#fff3c4' : i % 2 ? '#f1efe9' : '#e9e6df'} />
            <text x={18} y={b.y0 + 17} fontSize={14} fontWeight={700} fill="#1d2024" fontFamily={FONT}>
              {i + 1}. {b.label}
            </text>
            <Vignette id={b.id} x={18} y={b.y0 + 24} w={Math.min(200, ((b.y1 - b.y0 - 30) * 200) / 110)} />
          </g>
        );
      })}
      <rect x={SIDE.x0} y={300} width={SIDE.x1 - SIDE.x0} height={420} rx={10} fill="#ece9e2" stroke="#d3d0c8" />
      <text x={(SIDE.x0 + SIDE.x1) / 2} y={322} fontSize={13} fontWeight={700} textAnchor="middle" fill="#4a4f56" fontFamily={FONT}>
        横から関わる立場
      </text>

      {/* 発注方式の囲み */}
      {method === 'jv' && (() => {
        const f = frameOf(['gc', 'gc2'], 10);
        return (
          <g className="ind-fade">
            <rect x={f.x0} y={f.y0} width={f.x1 - f.x0} height={f.y1 - f.y0} rx={12} fill="none" stroke="#1d2024" strokeWidth={2} strokeDasharray="6 4" />
            <Pill at={[(f.x0 + f.x1) / 2, f.y0]} text="JV（共同企業体）" color="#1d2024" />
          </g>
        );
      })()}
      {method === 'designBuild' && (() => {
        const f = frameOf(['designer', 'gc'], 12);
        return (
          <g className="ind-fade">
            <rect x={f.x0} y={f.y0} width={f.x1 - f.x0} height={f.y1 - f.y0} rx={12} fill="rgba(46,99,200,.06)" stroke="#1d2024" strokeWidth={2} strokeDasharray="6 4" />
            <Pill at={[f.x1 - 70, f.y0]} text="ゼネコン（設計＋施工）" color="#1d2024" />
          </g>
        );
      })()}
      {hl?.frame && (() => {
        const f = frameOf(hl.frame.nodes, 18);
        return (
          <g>
            <rect x={f.x0} y={f.y0} width={f.x1 - f.x0} height={f.y1 - f.y0} rx={14} fill="rgba(242,183,5,.1)" stroke="#d99a00" strokeWidth={3} />
            <Pill at={[f.x0 + 120, f.y0]} text={hl.frame.text} color="#a87400" />
          </g>
        );
      })()}

      {/* 流れの矢印（箱が動き終わってから出す） */}
      <g key={`${flow}-${method}-${dispatchTo}`} className="ind-edges">
        {edges.filter((e) => !e.main).map((e, i) => (
          <EdgeView key={`n${i}`} e={e} pos={pos} color={color} />
        ))}
        {edges.filter((e) => e.main).map((e, i) => (
          <EdgeView key={`m${i}`} e={e} pos={pos} color={color} />
        ))}
      </g>

      {/* ルールのハイライト（線） */}
      {hl && (
        <g key={`hl-${method}-${dispatchTo}`} className="ind-edges">
          {hl.ok?.map((e, i) => (
            <EdgeView key={`ok${i}`} e={{ from: e.from, to: e.to, label: e.text, main: true, w: 4 }} pos={pos} color={OK} />
          ))}
          {hl.ng?.map((e, i) => (
            <EdgeView key={`ng${i}`} e={{ from: e.from, to: e.to, label: e.text, ng: true, w: 4 }} pos={pos} color={NG} />
          ))}
        </g>
      )}

      {/* 箱 */}
      {ALL.map((id) => {
        const p = pos[id];
        const shown = !!p;
        const at = p ?? POSITIONS.lump.gc!;
        const { title, sub } = nodeLabel(id, method);
        const layer = NODE_LAYER[id];
        const mechLike = id === 'mech' || id === 'piping' || id === 'ductco' || id === 'crPipe' || id === 'crDuct';
        const lit = hl?.nodes?.includes(id) || hl?.badges?.some((b) => b.node === id) || selectedLayer === layer;
        const badge = hl?.badges?.find((b) => b.node === id);
        return (
          <g
            key={id}
            className="ind-node"
            style={{ transform: `translate(${at[0]}px, ${at[1]}px)`, opacity: shown ? 1 : 0, pointerEvents: shown ? 'auto' : 'none' } as CSSProperties}
            onClick={() => onPickLayer(layer)}
          >
            <rect
              x={-NODE_W / 2}
              y={-NODE_H / 2}
              width={NODE_W}
              height={NODE_H}
              rx={8}
              fill={id === 'dispatch' ? '#e7eefb' : '#fbfaf7'}
              stroke={lit ? '#d99a00' : mechLike ? '#2e63c8' : '#8a8d90'}
              strokeWidth={lit ? 4 : mechLike ? 2.4 : 1.5}
            />
            <text y={-4} fontSize={15} fontWeight={700} textAnchor="middle" fill="#1d2024" fontFamily={FONT}>
              {title}
            </text>
            {sub && (
              <text y={15} fontSize={11.5} textAnchor="middle" fill="#4a4f56" fontFamily={FONT}>
                {sub}
              </text>
            )}
            {badge && (
              <g transform={`translate(${NODE_W / 2 - 8} ${-NODE_H / 2 - 4})`}>
                <rect x={-badge.text.length * 12 - 8} y={-10} width={badge.text.length * 12 + 16} height={20} rx={10} fill="#d99a00" />
                <text x={-badge.text.length * 6} y={4.5} fontSize={11.5} fontWeight={700} textAnchor="middle" fill="#fff" fontFamily={FONT}>
                  {badge.text}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* あなた */}
      <g className="ind-node" style={{ transform: `translate(${youAt[0]}px, ${youAt[1]}px)` } as CSSProperties}>
        <YouIcon />
      </g>

      {flow === 'money' && (
        <g className="ind-fade">
          <Pill at={[670, 22]} text="お金の流れ：配管工事1件分の例（数字は説明用の仮）" color="#a67f12" />
        </g>
      )}
    </svg>
  );
}
