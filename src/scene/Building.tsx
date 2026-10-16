import type { ReactNode } from 'react';
import type { StageId } from '../types';
import { B1_FLOOR, BAYS, BX0, BX1, COLS, COL_W, GROUND, PIT_BOTTOM, PS, SHAFT, SLAB_T, ceilingY, floorY, plenumTop } from './geometry';
import { Chiller, Conc, Desk, Label, Pump, WaterTank } from './parts';
import { SYS } from './systems';


type Mep = 'none' | 'hangers' | 'rough' | 'insulated';
type Ceil = 'none' | 'grid' | 'boarded';

const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

function Slab({ n, gaps = [] }: { n: number; gaps?: [number, number][] }) {
  const y = floorY(n);
  const all = [...gaps, SHAFT].sort((a, b) => a[0] - b[0]);
  const segs: [number, number][] = [];
  let x = BX0;
  for (const [g0, g1] of all) {
    if (g0 > x) segs.push([x, g0]);
    x = Math.max(x, g1);
  }
  segs.push([x, BX1]);
  return (
    <g>
      {segs.map(([a, b]) => (
        <g key={a}>
          <Conc x={a} y={y} w={b - a} h={SLAB_T} fill="#8a867e" />
          <rect x={a} y={y} width={b - a} height={1.2} fill="#b8b4ab" />
        </g>
      ))}
    </g>
  );
}

function BackWall({ n, tone, glazed, blinds }: { n: number; tone: string; glazed: boolean; blinds?: boolean }) {
  const top = plenumTop(n);
  const bot = floorY(n);
  return (
    <g>
      <rect x={BX0} y={top} width={BX1 - BX0} height={bot - top} fill={tone} />
      <rect x={BX0} y={top} width={BX1 - BX0} height={bot - top} fill="url(#p-concrete)" opacity={0.6} />
      <rect x={BX0} y={top} width={BX1 - BX0} height={18} fill="#000" opacity={0.07} />
      {BAYS.map(([a, b]) => {
        const wy = ceilingY(n) + 4;
        const wh = bot - 24 - wy;
        return (
          <g key={a}>
            <rect x={a + 12} y={wy} width={b - a - 24} height={wh} fill={glazed ? 'url(#g-glass)' : '#c3ced5'} stroke={glazed ? '#6b6f72' : 'none'} strokeWidth={1.4} />
            {glazed &&
              range(1, Math.floor((b - a - 24) / 42)).map((i) => (
                <line key={i} x1={a + 12 + i * 42} y1={wy} x2={a + 12 + i * 42} y2={wy + wh} stroke="#6b6f72" strokeWidth={1.2} />
              ))}
            {blinds &&
              range(0, 6).map((i) => <line key={`b${i}`} x1={a + 12} y1={wy + 2 + i * 2.2} x2={b - 12} y2={wy + 2 + i * 2.2} stroke="#e9e7e1" strokeWidth={1.2} />)}
          </g>
        );
      })}
    </g>
  );
}

function Plenum({ n, mep, ceiling, lit }: { n: number; mep: Mep; ceiling: Ceil; lit?: boolean }) {
  const t = plenumTop(n);
  const c = ceilingY(n);
  const ins = mep === 'insulated';
  const parts: ReactNode[] = [];
  if (mep !== 'none') {
    parts.push(
      <g key="hang" stroke="#6c6f72" strokeWidth={0.7}>
        {range(0, 14).map((i) => (
          <line key={i} x1={566 + i * 40} y1={t} x2={566 + i * 40} y2={mep === 'hangers' ? t + 10 : t + 21} />
        ))}
      </g>,
    );
  }
  if (mep === 'rough' || ins) {
    parts.push(
      <g key="mep">
        {/* ケーブルラック */}
        <g stroke={SYS.cable} strokeWidth={1}>
          <line x1={560} y1={t + 2} x2={1130} y2={t + 2} />
          <line x1={560} y1={t + 4.5} x2={1130} y2={t + 4.5} />
          {range(0, 71).map((i) => (
            <line key={i} x1={562 + i * 8} y1={t + 2} x2={562 + i * 8} y2={t + 4.5} strokeWidth={0.6} />
          ))}
        </g>
        {/* 空調ダクト */}
        <rect x={600} y={t + 5.5} width={460} height={8} fill={ins ? '#dfe2e3' : 'url(#g-metal)'} stroke="#80868a" strokeWidth={0.5} />
        {range(1, 9).map((i) => (
          <line key={i} x1={600 + i * 48} y1={t + 5.5} x2={600 + i * 48} y2={t + 13.5} stroke="#80868a" strokeWidth={ins ? 0.4 : 1} />
        ))}
        {/* 冷温水管（往・還） */}
        <line x1={560} y1={t + 15.5} x2={1186} y2={t + 15.5} stroke={SYS.chw} strokeWidth={ins ? 3.2 : 2} />
        <line x1={560} y1={t + 18.5} x2={1190} y2={t + 18.5} stroke={SYS.chw} strokeWidth={ins ? 3.2 : 2} strokeOpacity={0.75} />
        {ins && <line x1={560} y1={t + 17} x2={1190} y2={t + 17} stroke="#fff" strokeWidth={0.5} strokeOpacity={0.5} />}
        {/* 給水・排水（便所まわり） */}
        <line x1={1080} y1={t + 12} x2={1194} y2={t + 12} stroke={SYS.water} strokeWidth={1.8} />
        <path d={`M1140 ${t + 13} L1198 ${t + 19}`} stroke={SYS.drain} strokeWidth={3} />
        {/* スプリンクラー */}
        <line x1={560} y1={t + 20.5} x2={1194} y2={t + 20.5} stroke={SYS.sprinkler} strokeWidth={1.5} />
        {range(0, 7).map((i) => (
          <g key={i}>
            <line x1={590 + i * 78} y1={t + 20.5} x2={590 + i * 78} y2={c} stroke={SYS.sprinkler} strokeWidth={1.2} />
            {ceiling === 'boarded' && <rect x={588 + i * 78} y={c + 2} width={4} height={2} fill="#d9d9d9" />}
          </g>
        ))}
      </g>,
    );
  }
  if (ceiling === 'grid') {
    parts.push(
      <g key="grid">
        <line x1={544} y1={c} x2={1132} y2={c} stroke="#b5b9bc" strokeWidth={1.4} />
        {range(0, 24).map((i) => (
          <line key={i} x1={548 + i * 24} y1={c - 4} x2={548 + i * 24} y2={c} stroke="#b5b9bc" strokeWidth={0.8} />
        ))}
      </g>,
    );
  }
  if (ceiling === 'boarded') {
    parts.push(
      <g key="board">
        <rect x={544} y={c} width={588} height={2.5} fill="#ecebe5" />
        {[630, 830, 1030].map((x) => (
          <rect key={x} x={x - 6} y={c + 2.5} width={12} height={2} fill="#9da2a5" />
        ))}
        {[580, 680, 780, 880, 980, 1080].map((x) => (
          <g key={`l${x}`}>
            <rect x={x - 12} y={c + 2.5} width={24} height={1.6} fill={lit ? '#fffbe2' : '#e7e7e2'} />
            {lit && <ellipse cx={x} cy={c + 22} rx={40} ry={22} fill="url(#g-light)" />}
          </g>
        ))}
      </g>,
    );
  }
  return <g>{parts}</g>;
}

function Toilet({ n }: { n: number }) {
  const f = floorY(n);
  return (
    <g>
      <rect x={1180} y={plenumTop(n)} width={2.5} height={f - plenumTop(n)} fill="#e8e6e0" />
      <rect x={1160} y={f - 30} width={9} height={14} rx={1.5} fill="#f2f2ee" stroke="#aaa" strokeWidth={0.5} />
      <path d={`M1146 ${f - 16} H1166 Q1166 ${f - 8} 1158 ${f - 6} L1158 ${f} H1152 L1152 ${f - 6} Q1146 ${f - 8} 1146 ${f - 16} Z`} fill="#f2f2ee" stroke="#aaa" strokeWidth={0.5} />
    </g>
  );
}

export function Building({ stage }: { stage: StageId }) {
  if (stage < 3) return null;
  const framed = stage >= 4;
  const topStory = stage === 4 ? 6 : 10; // 背面が見える最上階
  const colTop = stage === 4 ? 5 : 10; // コンクリート柱が打設済みの最上階
  const slabTop = stage === 4 ? 6 : 11;

  const tone = (n: number) => (stage === 7 ? '#e2ded5' : stage === 6 && n <= 5 ? '#d6d2c9' : '#aaa69d');
  const glazed = (n: number) => (stage === 5 ? n <= 6 : stage >= 6);
  const mep = (n: number): Mep => (stage === 5 ? (n <= 6 ? 'rough' : 'hangers') : stage >= 6 ? 'insulated' : 'none');
  const ceil = (n: number): Ceil => (stage === 7 ? 'boarded' : stage === 6 ? (n <= 5 ? 'boarded' : 'grid') : 'none');

  const stories = framed ? range(1, stage === 4 ? colTop : topStory) : [];

  return (
    <g>
      {/* 地下1階の背面 */}
      {framed && <Conc x={BX0} y={GROUND + SLAB_T} w={BX1 - BX0} h={B1_FLOOR - GROUND - SLAB_T} fill="#9d998f" />}

      {stories.map((n) => (
        <BackWall key={n} n={n} tone={tone(n)} glazed={glazed(n)} blinds={stage === 7 && n % 2 === 0} />
      ))}

      {/* EVシャフト（奥） */}
      {framed && (
        <rect x={SHAFT[0]} y={stage === 4 ? floorY(7) : 100} width={SHAFT[1] - SHAFT[0]} height={1345 - (stage === 4 ? floorY(7) : 100)} fill="#6f6b64" />
      )}
      {stage >= 6 && (
        <g stroke="#3d3f42" strokeWidth={1.2}>
          <line x1={SHAFT[0] + 8} y1={100} x2={SHAFT[0] + 8} y2={1345} />
          <line x1={SHAFT[1] - 8} y1={100} x2={SHAFT[1] - 8} y2={1345} />
        </g>
      )}

      {/* 柱 */}
      {framed &&
        range(0, colTop).map((n) =>
          COLS.map((cx) => {
            const top = n === 0 ? GROUND + SLAB_T : plenumTop(n);
            const bot = n === 0 ? B1_FLOOR : floorY(n);
            return <Conc key={`${n}-${cx}`} x={cx} y={top} w={COL_W} h={bot - top} fill="#97938a" />;
          }),
        )}

      {stories.map((n) => (
        <Plenum key={n} n={n} mep={mep(n)} ceiling={ceil(n)} lit={stage === 7} />
      ))}

      {/* コア壁・PS立て管 */}
      {framed && (
        <g>
          <Conc x={SHAFT[0] - 8} y={stage === 4 ? floorY(7) : 100} w={8} h={1345 - (stage === 4 ? floorY(7) : 100)} fill="#97938a" />
          <Conc x={SHAFT[1]} y={stage === 4 ? floorY(7) : 100} w={8} h={1345 - (stage === 4 ? floorY(7) : 100)} fill="#97938a" />
        </g>
      )}
      {stage >= 5 && (
        <g>
          {[
            [PS[0] + 4, SYS.chw],
            [PS[0] + 8, SYS.chw],
            [PS[0] + 12, SYS.water],
            [PS[0] + 16, SYS.sprinkler],
            [PS[0] + 21, SYS.drain],
          ].map(([x, c]) => (
            <line key={x} x1={x} y1={140} x2={x} y2={B1_FLOOR} stroke={c as string} strokeWidth={x === PS[0] + 21 ? 3 : 2} />
          ))}
        </g>
      )}

      {/* スラブ */}
      {framed && range(1, slabTop).map((n) => <Slab key={n} n={n} gaps={stage === 4 && n === 5 ? [[1000, 1040]] : []} />)}

      {/* 外装仕上げ */}
      {stage >= 6 && (
        <g>
          <rect x={BX0 - 5} y={152} width={5} height={GROUND - 152} fill="#cdc6b6" />
          <rect x={BX1} y={152} width={5} height={GROUND - 152} fill="#cdc6b6" />
        </g>
      )}

      {/* 地下：基礎・ピット・B1スラブ・地下外壁 */}
      <Basement stage={stage} />

      {stage === 4 && <Deck />}
      {stage >= 5 && <Roof stage={stage} />}

      {/* 内装・機器 */}
      {stage >= 6 && range(1, 10).filter((n) => stage === 7 || n <= 5).map((n) => <Toilet key={n} n={n} />)}
      {stage === 7 && range(1, 10).map((n) => <rect key={n} x={544} y={floorY(n) - 2} width={588} height={2} fill="#6d737b" />)}
      {stage === 7 && [4, 5, 6].map((n) => [640, 800, 980].map((x) => <Desk key={`${n}-${x}`} x={x} y={floorY(n)} />))}
      {stage >= 6 && (
        <g>
          <rect x={SHAFT[0] + 4} y={floorY(stage === 6 ? 3 : 1) - 60} width={SHAFT[1] - SHAFT[0] - 8} height={58} fill="#a9adb0" stroke="#6b6f72" />
          <line x1={(SHAFT[0] + SHAFT[1]) / 2} y1={floorY(stage === 6 ? 3 : 1) - 56} x2={(SHAFT[0] + SHAFT[1]) / 2} y2={floorY(stage === 6 ? 3 : 1) - 4} stroke="#6b6f72" />
        </g>
      )}
    </g>
  );
}

function Basement({ stage }: { stage: StageId }) {
  const partial = stage === 3;
  const beams: [number, number][] = [
    [520, 560],
    [760, 780],
    [980, 1000],
    [1190, 1210],
    [1292, 1320],
  ];
  const pits: [number, number, string][] = [
    [560, 760, '湧水槽'],
    [780, 980, '雑排水槽'],
    [1000, 1190, '消火水槽'],
  ];
  const manholes: [number, number][] = [
    [620, 644],
    [860, 884],
    [1100, 1124],
  ];
  const slabSegs: [number, number][] = [];
  let x = BX0;
  for (const [a, b] of manholes) {
    slabSegs.push([x, a]);
    x = b;
  }
  slabSegs.push([x, BX1]);
  return (
    <g>
      <Conc x={BX0} y={PIT_BOTTOM} w={BX1 - BX0} h={12} fill="#8a867e" />
      {pits.map(([a, b, name]) => (
        <g key={a}>
          <rect x={a} y={B1_FLOOR + 12} width={b - a} height={PIT_BOTTOM - B1_FLOOR - 12} fill="#2f3438" />
          <rect x={a} y={PIT_BOTTOM - (stage >= 5 ? 14 : 4)} width={b - a} height={stage >= 5 ? 14 : 4} fill="#3f5f6b" opacity={0.85} />
          <Label x={(a + b) / 2} y={B1_FLOOR + 30} size={9} fill="#c9d1d5">
            {name}
          </Label>
        </g>
      ))}
      <rect x={1210} y={B1_FLOOR + 12} width={82} height={PIT_BOTTOM - B1_FLOOR - 12} fill="#4a4844" />
      {beams.map(([a, b]) => (
        <Conc key={a} x={a} y={B1_FLOOR} w={b - a} h={PIT_BOTTOM - B1_FLOOR} fill="#8a867e" />
      ))}
      {slabSegs.map(([a, b]) => (
        <g key={a}>
          <Conc x={a} y={B1_FLOOR} w={b - a} h={12} fill="#8a867e" />
          <rect x={a} y={B1_FLOOR} width={b - a} height={1.2} fill="#b8b4ab" />
        </g>
      ))}
      {!partial && manholes.map(([a, b]) => <rect key={a} x={a - 2} y={B1_FLOOR - 2} width={b - a + 4} height={3} fill="#6b6e70" />)}
      {partial && (
        <g stroke="#8e9194" strokeWidth={1.4}>
          <line x1={626} y1={B1_FLOOR - 6} x2={626} y2={PIT_BOTTOM} />
          <line x1={640} y1={B1_FLOOR - 6} x2={640} y2={PIT_BOTTOM} />
          {range(0, 7).map((i) => (
            <line key={i} x1={626} y1={B1_FLOOR + i * 8} x2={640} y2={B1_FLOOR + i * 8} />
          ))}
        </g>
      )}
      {/* 地下外壁 */}
      {partial ? (
        <g>
          {[
            [BX0, 'L'],
            [BX1 - 24, 'R'],
          ].map(([wx]) => (
            <g key={wx}>
              <Conc x={wx as number} y={1250} w={24} h={B1_FLOOR - 1250} fill="#97938a" />
              <rect x={(wx as number) - 6} y={1188} width={6} height={62} fill="url(#p-ply)" />
              <rect x={(wx as number) + 24} y={1188} width={6} height={62} fill="url(#p-ply)" />
              {[6, 12, 18].map((d) => (
                <line key={d} x1={(wx as number) + d} y1={1165} x2={(wx as number) + d} y2={1250} stroke="#6b3e26" strokeWidth={1.2} />
              ))}
            </g>
          ))}
          {COLS.slice(1, 4).map((cx) => (
            <g key={cx} stroke="#6b3e26" strokeWidth={1.2}>
              {[4, 12, 20].map((d) => (
                <line key={d} x1={cx + d} y1={B1_FLOOR} x2={cx + d} y2={1160} />
              ))}
              {range(0, 13).map((i) => (
                <line key={`h${i}`} x1={cx + 2} y1={B1_FLOOR - 8 - i * 10} x2={cx + 22} y2={B1_FLOOR - 8 - i * 10} strokeWidth={0.8} />
              ))}
            </g>
          ))}
        </g>
      ) : (
        <g>
          <Conc x={BX0} y={GROUND} w={24} h={B1_FLOOR - GROUND} fill="#97938a" />
          <Conc x={BX1 - 24} y={GROUND} w={24} h={B1_FLOOR - GROUND} fill="#97938a" />
        </g>
      )}
      {/* 機械室 */}
      {stage >= 5 && (
        <g>
          <WaterTank x={570} y={B1_FLOOR} />
          <Pump x={710} y={B1_FLOOR} />
          <Pump x={745} y={B1_FLOOR} />
          <Pump x={790} y={B1_FLOOR} color="#b8322b" />
          <path d={`M580 ${B1_FLOOR - 58} V${B1_FLOOR - 70} H${PS[0] + 12}`} stroke={SYS.water} strokeWidth={2} fill="none" />
          {[860, 890, 920].map((cx) => (
            <rect key={cx} x={cx} y={B1_FLOOR - 52} width={28} height={52} fill="#c9ccc9" stroke="#8b8f8d" />
          ))}
          <Label x={625} y={B1_FLOOR - 60} size={8} fill="#2b2b2b">
            受水槽
          </Label>
        </g>
      )}
    </g>
  );
}

function Deck() {
  // 7階床の型枠・配筋中（6階の柱は型枠のみ）
  const y = floorY(7);
  const supports = range(0, 27).map((i) => 552 + i * 28).filter((x) => x < SHAFT[0] - 4 || x > SHAFT[1] + 4);
  const segs: [number, number][] = [
    [BX0, SHAFT[0]],
    [SHAFT[1], BX1],
  ];
  return (
    <g>
      {segs.map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={y + 6} width={b - a} height={4} fill="url(#p-ply)" />
          <rect x={a} y={y + 10} width={b - a} height={4} fill="#8b6a42" />
          {range(0, Math.floor((b - a) / 6)).map((i) => (
            <circle key={i} cx={a + 3 + i * 6} cy={y + 3} r={1.1} fill="#6b3e26" />
          ))}
          <line x1={a} y1={y + 1} x2={b} y2={y + 1} stroke="#6b3e26" strokeWidth={1} />
        </g>
      ))}
      {supports.map((x) => (
        <line key={x} x1={x} y1={y + 14} x2={x} y2={floorY(6)} stroke="#9aa0a4" strokeWidth={1.6} />
      ))}
      {COLS.map((cx) => (
        <g key={cx}>
          <rect x={cx - 3} y={y + 14} width={COL_W + 6} height={floorY(6) - y - 14} fill="url(#p-ply)" />
          {[5, 12, 19].map((d) => (
            <line key={d} x1={cx + d} y1={y + 6} x2={cx + d} y2={y - 55} stroke="#6b3e26" strokeWidth={1.4} />
          ))}
        </g>
      ))}
      {/* スリーブ（設備の配管を通す穴） */}
      {[800, 836, 1010].map((x) => (
        <rect key={x} x={x} y={y - 6} width={8} height={16} fill="#d9dcde" stroke="#8b9094" strokeWidth={0.6} />
      ))}
    </g>
  );
}

function Roof({ stage }: { stage: StageId }) {
  const y = floorY(11);
  return (
    <g>
      <Conc x={BX0} y={y - 28} w={12} h={28} fill="#97938a" />
      <Conc x={BX1 - 12} y={y - 28} w={12} h={28} fill="#97938a" />
      {/* 塔屋 */}
      <rect x={1130} y={100} width={180} height={80} fill="#aaa69d" />
      <Conc x={1120} y={100} w={10} h={80} fill="#97938a" />
      <Conc x={1310} y={100} w={10} h={80} fill="#97938a" />
      <Conc x={1120} y={92} w={200} h={8} fill="#8a867e" />
      <rect x={SHAFT[0]} y={100} width={SHAFT[1] - SHAFT[0]} height={80} fill="#6f6b64" />
      <rect x={1140} y={130} width={30} height={50} fill="#7d8184" />
      {/* 防水 */}
      <rect x={532} y={y - 3} width={stage === 5 ? 370 : 588} height={3} fill="#3a3c3f" />
      {stage >= 6 && (
        <g>
          <Conc x={580} y={y - 8} w={112} h={8} fill="#a4a097" />
          <Chiller x={581} y={y - 8} />
          <Conc x={720} y={y - 8} w={112} h={8} fill="#a4a097" />
          <Chiller x={721} y={y - 8} />
          <path d={`M692 ${y - 30} H1120 M692 ${y - 24} H1120`} stroke={SYS.chw} strokeWidth={3} />
          <rect x={900} y={y - 30} width={34} height={30} fill="#c3c6c4" stroke="#8e9290" />
        </g>
      )}
    </g>
  );
}
