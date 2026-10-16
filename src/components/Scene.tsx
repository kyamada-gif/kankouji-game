import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { PointerEvent as RPointerEvent } from 'react';
import type { Hazard, Mode, Stage } from '../types';
import type { Actor } from '../data/actors';
import type { FlowKind } from '../data/mech';
import { ROLES } from '../data/roles';
import { Defs } from '../scene/Defs';
import { H, W } from '../scene/geometry';
import { StageArt } from '../scene/StageArt';
import { ActorLayer } from '../scene/ActorLayer';
import { Flows } from '../scene/Flows';
import { actorBox, hitActor } from '../scene/actorGeom';
import type { TruckDef } from '../data/trucks';
import { Truck } from '../scene/Truck';
import { TRUCK_LEN } from '../scene/truckGeom';
import { GROUND } from '../scene/geometry';

interface View {
  x: number;
  y: number;
  w: number;
}

interface Props {
  mode: Mode;
  stage: Stage;
  actors: Actor[];
  trucks: TruckDef[];
  hazards: Hazard[];
  found: Set<string>;
  reveal: boolean;
  editing: boolean;
  selectedId: string | null;
  flow: FlowKind | null;
  /** ガイドが指定する拡大位置（focusKey が変わったときに適用） */
  focus?: { cx: number; cy: number; w: number } | null;
  focusKey?: string;
  onHit: (id: string) => void;
  onPickActor: (id: string) => void;
  onPickTruck: (id: string) => void;
  onSelect: (id: string | null) => void;
  onMove: (id: string, x: number, y: number) => void;
}

const MIN_W = 260;
const LENS_R = 110;
const LENS_ZOOM = 3.5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function fit(v: View): View {
  const w = clamp(v.w, MIN_W, W);
  const h = (w * H) / W;
  return { w, x: clamp(v.x, 0, W - w), y: clamp(v.y, 0, H - h) };
}

function hitTruck(trucks: TruckDef[], x: number, y: number) {
  return trucks.find((t) => x >= t.x - 4 && x <= t.x + TRUCK_LEN[t.kind] + 4 && y >= GROUND - 100 && y <= GROUND + 4) ?? null;
}

/** 運ばれる道筋（動く線と矢印） */
function TruckRoute({ t, unit }: { t: TruckDef; unit: number }) {
  const d = 'M' + t.route.map(([x, y]) => `${x} ${y}`).join(' L');
  const [ex, ey] = t.route[t.route.length - 1];
  const [px, py] = t.route[t.route.length - 2];
  const ang = (Math.atan2(ey - py, ex - px) * 180) / Math.PI;
  const color = t.mechLoad ? '#4d8cff' : '#f2b705';
  const a = 12 * unit;
  return (
    <g pointerEvents="none">
      <path d={d} stroke="#000" strokeOpacity={0.6} strokeWidth={9} fill="none" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <path d={d} stroke={color} strokeWidth={5} fill="none" strokeLinejoin="round" className="route-line" vectorEffect="non-scaling-stroke" />
      <path d={`M${-a} ${-a * 0.6} L0 0 L${-a} ${a * 0.6} Z`} fill={color} stroke="#000" strokeWidth={1} vectorEffect="non-scaling-stroke" transform={`translate(${ex} ${ey}) rotate(${ang})`} />
      <circle cx={t.route[0][0]} cy={t.route[0][1]} r={6 * unit} fill={color} stroke="#000" strokeWidth={1} vectorEffect="non-scaling-stroke" />
    </g>
  );
}

const TAG_H = 18;
const TAG_GAP = 3;

/** 名札の配置。自分・選択中を優先し、重なる名札は上の段へ積む */
function layoutTags(actors: Actor[], selectedId: string | null, unit: number) {
  const prio = (a: Actor) => (a.role === 'me' ? 0 : a.id === selectedId ? 1 : 2);
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  return [...actors]
    .sort((p, q) => prio(p) - prio(q) || actorBox(p).cx - actorBox(q).cx)
    .map((a) => {
      const b = actorBox(a);
      const text = a.role === 'me' ? 'あなた' : ROLES[a.role].short;
      const tw = (text.length * 12 + 12) * unit;
      const x0 = b.cx - tw / 2;
      let row = 0;
      let y0 = 0;
      for (; row < 8; row++) {
        y0 = b.top - (8 + TAG_H + row * (TAG_H + TAG_GAP)) * unit;
        const r = { x0: x0 - 2 * unit, x1: x0 + tw + 2 * unit, y0, y1: y0 + TAG_H * unit };
        if (!placed.some((p) => p.x0 < r.x1 && r.x0 < p.x1 && p.y0 < r.y1 && r.y0 < p.y1)) {
          placed.push(r);
          break;
        }
      }
      return { a, b, text, x0, y0, tw, row };
    });
}

export function Scene(props: Props) {
  const { mode, stage, actors, trucks, hazards, found, reveal, editing, selectedId, flow } = props;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, w: W });
  const [size, setSize] = useState({ w: 1000, h: 750 });
  const [misses, setMisses] = useState<{ id: number; x: number; y: number }[]>([]);
  const [lensOn, setLensOn] = useState(true);
  const [lens, setLens] = useState<{ sx: number; sy: number; x: number; y: number } | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const drag = useRef<{ sx: number; sy: number; view: View; k: number; moved: boolean; hazardId: string | null } | null>(null);

  useEffect(() => {
    const f = props.focus;
    if (!f) return;
    const w = clamp(f.w, MIN_W, W);
    setView(fit({ w, x: f.cx - w / 2, y: f.cy - (w * H) / W / 2 }));
    // focusKey が変わったときだけ動かす
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.focusKey]);

  const vh = (view.w * H) / W;
  const k = Math.min(size.w / view.w, size.h / vh); // 画面px / シーン単位
  const unit = 1 / k;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toSvg = (cx: number, cy: number) => {
    const m = svgRef.current?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(cx, cy).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  };

  const nearestHazard = (x: number, y: number, slack = 0) =>
    hazards
      .map((h) => ({ h, d: Math.hypot(h.x - x, h.y - y) }))
      .filter(({ h, d }) => d <= h.r + slack)
      .sort((a, b) => a.d - b.d)[0]?.h ?? null;

  const zoomAt = (cx: number, cy: number, factor: number) => {
    const p = toSvg(cx, cy);
    setView((v) => {
      const w = clamp(v.w * factor, MIN_W, W);
      const s = w / v.w;
      return fit({ w, x: p.x - (p.x - v.x) * s, y: p.y - (p.y - v.y) * s });
    });
  };

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.0015));
    };
    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  });

  const zoomCenter = (factor: number) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (r) zoomAt(r.left + r.width / 2, r.top + r.height / 2, factor);
  };

  const onPointerDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toSvg(e.clientX, e.clientY);
    const hit = editing ? nearestHazard(p.x, p.y, 6) : null;
    if (hit) props.onSelect(hit.id);
    drag.current = { sx: e.clientX, sy: e.clientY, view, k: svgRef.current?.getScreenCTM()?.a ?? 1, moved: false, hazardId: hit?.id ?? null };
  };

  const onPointerMove = (e: RPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    if (!d) {
      if (e.pointerType !== 'mouse') return;
      const p = toSvg(e.clientX, e.clientY);
      const r = wrapRef.current!.getBoundingClientRect();
      setLens({ sx: e.clientX - r.left, sy: e.clientY - r.top, x: p.x, y: p.y });
      setHoverId(mode === 'C' ? (hitTruck(trucks, p.x, p.y)?.id ?? null) : (hitActor(actors, p.x, p.y)?.id ?? null));
      return;
    }
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (!d.moved && Math.hypot(dx, dy) < 5) return;
    d.moved = true;
    setLens(null);
    if (d.hazardId) {
      const p = toSvg(e.clientX, e.clientY);
      props.onMove(d.hazardId, Math.round(p.x), Math.round(p.y));
    } else {
      setView(fit({ ...d.view, x: d.view.x - dx / d.k, y: d.view.y - dy / d.k }));
    }
  };

  const onPointerUp = (e: RPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved || editing) return;
    const p = toSvg(e.clientX, e.clientY);
    if (mode === 'A') {
      const a = hitActor(actors, p.x, p.y);
      if (a) props.onPickActor(a.id);
      return;
    }
    if (mode === 'C') {
      const t = hitTruck(trucks, p.x, p.y);
      if (t) props.onPickTruck(t.id);
      return;
    }
    const hit = nearestHazard(p.x, p.y);
    if (hit) {
      props.onHit(hit.id);
      return;
    }
    const id = Date.now();
    setMisses((m) => [...m, { id, x: p.x, y: p.y }]);
    window.setTimeout(() => setMisses((m) => m.filter((x) => x.id !== id)), 650);
  };

  const tagged = mode === 'A' ? actors : mode === 'B' ? actors.filter((a) => a.id === hoverId) : [];
  const selTruck = mode === 'C' ? trucks.find((t) => t.id === selectedId) : undefined;
  const lensW = (LENS_R * 2) / (k * LENS_ZOOM);

  return (
    <div className="scene" ref={wrapRef}>
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => {
          setLens(null);
          setHoverId(null);
        }}
        onPointerCancel={() => (drag.current = null)}
        className={[editing ? 'is-editing' : '', mode !== 'B' && hoverId ? 'is-pointing' : ''].join(' ')}
        role="img"
        aria-label={`工事現場の断面図：${stage.name}`}
      >
        <Defs />
        <g id="scene-root">
          {stage.image ? (
            <image href={import.meta.env.BASE_URL + stage.image} x={0} y={0} width={W} height={H} preserveAspectRatio="xMidYMid slice" />
          ) : (
            <StageArt stage={stage.id} />
          )}
          {trucks.map((t, i) => (
            <g
              key={`${stage.id}-${t.id}`}
              className="truck-in"
              style={{ '--dx': `${-(t.x + TRUCK_LEN[t.kind] + 60)}px`, animationDelay: `${i * 0.35}s` } as CSSProperties}
            >
              <Truck x={t.x} kind={t.kind} cargo={t.cargo} />
            </g>
          ))}
          <ActorLayer actors={actors} />
        </g>

        {flow && <Flows kind={flow} />}

        {/* A：自分の位置と選択中の人 */}
        {mode === 'A' &&
          actors.map((a) => {
            const b = actorBox(a);
            const me = a.role === 'me';
            const sel = a.id === selectedId;
            if (!me && !sel) return null;
            return (
              <rect
                key={a.id}
                x={b.x0 - 4}
                y={b.y0 - 4}
                width={b.x1 - b.x0 + 8}
                height={b.y1 - b.y0 + 8}
                rx={6}
                fill="none"
                stroke={sel ? '#f2b705' : '#4d8cff'}
                strokeWidth={3}
                vectorEffect="non-scaling-stroke"
                className={me && !sel ? 'me-ring' : undefined}
              />
            );
          })}

        {/* C：運ばれる道筋とトラックの札 */}
        {selTruck && <TruckRoute t={selTruck} unit={unit} />}
        {mode === 'C' &&
          trucks.map((t) => {
            const len = TRUCK_LEN[t.kind];
            const sel = t.id === selectedId;
            const hover = t.id === hoverId;
            const text = `${t.dir}${t.mechLoad ? '・管工事' : ''}`;
            const fs = 12 * unit;
            const tw = (text.length * 12 + 14) * unit;
            const cx = Math.max(t.x + len / 2, tw / 2 + 6 * unit);
            const fill = t.mechLoad ? '#2e63c8' : t.dir === '搬出' ? '#7a4a1e' : '#14171a';
            return (
              <g key={t.id} pointerEvents="none">
                {(sel || hover) && (
                  <rect x={t.x - 4} y={GROUND - 100} width={len + 8} height={104} rx={6} fill="none" stroke="#f2b705" strokeWidth={3} vectorEffect="non-scaling-stroke" />
                )}
                <rect x={cx - tw / 2} y={GROUND - 104 - 22 * unit} width={tw} height={18 * unit} rx={4 * unit} fill={sel ? '#f2b705' : fill} fillOpacity={0.92} />
                <text x={cx} y={GROUND - 104 - 9 * unit} fontSize={fs} fill={sel ? '#111' : '#fff'} textAnchor="middle" fontWeight={700} fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
                  {text}
                </text>
              </g>
            );
          })}

        {/* 名札（重なるものは上の段へずらし、線で本人とつなぐ） */}
        {!editing &&
          layoutTags(tagged, selectedId, unit).map(({ a, b, text, x0, y0, tw, row }) => {
            const me = a.role === 'me';
            const sel = a.id === selectedId;
            const fill = me ? '#2e63c8' : sel ? '#f2b705' : '#14171a';
            const th = TAG_H * unit;
            return (
              <g key={a.id} pointerEvents="none">
                {row > 0 && <line x1={b.cx} y1={y0 + th} x2={b.cx} y2={b.top - 3 * unit} stroke={fill} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />}
                <rect x={x0} y={y0} width={tw} height={th} rx={4 * unit} fill={fill} fillOpacity={0.92} />
                {row === 0 && <path d={`M${b.cx - 4 * unit} ${y0 + th - 0.5 * unit} L${b.cx} ${b.top - 3 * unit} L${b.cx + 4 * unit} ${y0 + th - 0.5 * unit}`} fill={fill} />}
                <text x={x0 + tw / 2} y={y0 + 13 * unit} fontSize={12 * unit} fill={sel && !me ? '#111' : '#fff'} textAnchor="middle" fontWeight={700} fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
                  {text}
                </text>
              </g>
            );
          })}

        {/* B：危険のマーク */}
        {mode === 'B' &&
          hazards.map((hz, i) => {
            if (editing) {
              const sel = hz.id === selectedId;
              return (
                <g key={hz.id}>
                  <circle cx={hz.x} cy={hz.y} r={hz.r} fill={sel ? 'rgba(46,99,200,.25)' : 'rgba(242,183,5,.18)'} stroke={sel ? '#2e63c8' : '#f2b705'} strokeWidth={2} vectorEffect="non-scaling-stroke" strokeDasharray="6 4" />
                  <text x={hz.x} y={hz.y - hz.r - 6 * unit} fontSize={13 * unit} textAnchor="middle" fill="#111" stroke="#fff" strokeWidth={3 * unit} paintOrder="stroke">
                    {hz.id}
                  </text>
                </g>
              );
            }
            if (found.has(hz.id)) {
              return (
                <g key={hz.id} className="found-mark" pointerEvents="none">
                  <circle cx={hz.x} cy={hz.y} r={hz.r} fill="none" stroke="#111" strokeOpacity={0.45} strokeWidth={7} vectorEffect="non-scaling-stroke" />
                  <circle cx={hz.x} cy={hz.y} r={hz.r} fill="none" stroke={hz.id === selectedId ? '#ffffff' : '#f2b705'} strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                  <circle cx={hz.x + hz.r * 0.72} cy={hz.y - hz.r * 0.72} r={11 * unit} fill="#f2b705" stroke="#111" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                  <text x={hz.x + hz.r * 0.72} y={hz.y - hz.r * 0.72 + 5 * unit} fontSize={14 * unit} fontWeight={700} textAnchor="middle" fill="#111">
                    {i + 1}
                  </text>
                </g>
              );
            }
            if (reveal) {
              return <circle key={hz.id} cx={hz.x} cy={hz.y} r={hz.r} fill="rgba(200,50,43,.12)" stroke="#c8322b" strokeWidth={2} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" pointerEvents="none" />;
            }
            return null;
          })}

        {misses.map((m) => (
          <g key={m.id} className="miss-mark" pointerEvents="none">
            <circle cx={m.x} cy={m.y} r={14 * unit} fill="rgba(0,0,0,.35)" />
            <path
              d={`M${m.x - 6 * unit} ${m.y - 6 * unit} L${m.x + 6 * unit} ${m.y + 6 * unit} M${m.x + 6 * unit} ${m.y - 6 * unit} L${m.x - 6 * unit} ${m.y + 6 * unit}`}
              stroke="#fff"
              strokeWidth={2.5}
              vectorEffect="non-scaling-stroke"
            />
          </g>
        ))}
      </svg>

      {lensOn && lens && !editing && (
        <div className="lens" style={{ left: lens.sx - LENS_R, top: lens.sy - LENS_R, width: LENS_R * 2, height: LENS_R * 2 }} aria-hidden="true">
          <svg viewBox={`${lens.x - lensW / 2} ${lens.y - lensW / 2} ${lensW} ${lensW}`}>
            <use href="#scene-root" />
          </svg>
        </div>
      )}

      <div className="zoom">
        <button type="button" onClick={() => zoomCenter(0.7)} aria-label="拡大">
          ＋
        </button>
        <button type="button" onClick={() => zoomCenter(1 / 0.7)} aria-label="縮小">
          −
        </button>
        <button type="button" onClick={() => setView({ x: 0, y: 0, w: W })}>
          全体
        </button>
        <button type="button" aria-pressed={lensOn} onClick={() => setLensOn((v) => !v)}>
          ルーペ
        </button>
      </div>
      <p className="scene-hint">
        {mode === 'A' ? '人を押すと、その人の仕事が分かります。' : mode === 'B' ? '危ないと思う人や物を押してください。' : 'トラックを押すと、荷物の中身と行き先が分かります。'}
        ルーペで細部まで見えます。ドラッグで移動、ホイールで拡大。
      </p>
    </div>
  );
}
