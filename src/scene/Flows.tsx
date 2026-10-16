import type { FlowKind } from '../data/mech';
import { FLOW_COLORS as C } from '../data/mech';
import { GROUND, H, W, ceilingY, floorY, plenumTop } from './geometry';

function Flow({ d, color, width = 4 }: { d: string; color: string; width?: number }) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} stroke="#000" strokeOpacity={0.55} strokeWidth={width + 3} />
      <path d={d} stroke={color} strokeWidth={width} className="flow-line" />
    </g>
  );
}

function Tag({ x, y, children }: { x: number; y: number; children: string }) {
  const w = children.length * 15 + 16;
  return (
    <g>
      <rect x={x - w / 2} y={y - 14} width={w} height={22} rx={4} fill="#14171a" fillOpacity={0.88} />
      <text x={x} y={y + 2} fontSize={15} fill="#fff" textAnchor="middle" fontWeight={700} fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
        {children}
      </text>
    </g>
  );
}

function Hvac() {
  const floors = [2, 5, 8];
  return (
    <g>
      <Flow d={`M636 112 V104 H1186 V${plenumTop(2) + 15.5}`} color={C.chwSupply} />
      <Flow d={`M1190 ${plenumTop(2) + 18.5} V98 H776 V112`} color={C.chwReturn} />
      {floors.map((n) => {
        const t = plenumTop(n);
        return (
          <g key={n}>
            <Flow d={`M1186 ${t + 15.5} H612`} color={C.chwSupply} width={3} />
            <Flow d={`M612 ${t + 18.5} H1190`} color={C.chwReturn} width={3} />
            <rect x={588} y={t + 3} width={24} height={17} fill="#d9dcdc" stroke="#555" />
            <Flow d={`M612 ${t + 9.5} H1050`} color={C.air} width={3} />
            {[630, 830, 1030].map((x) => (
              <Flow key={x} d={`M${x} ${t + 13.5} V${ceilingY(n) + 24}`} color={C.air} width={3} />
            ))}
          </g>
        );
      })}
      <Tag x={706} y={84}>熱源（冷凍機）</Tag>
      <Tag x={1300} y={420}>冷温水配管（PS）</Tag>
      <Tag x={600} y={plenumTop(5) - 10}>空調機・ファンコイル</Tag>
      <Tag x={860} y={plenumTop(8) - 10}>ダクト</Tag>
      <Tag x={830} y={ceilingY(2) + 40}>吹出口</Tag>
    </g>
  );
}

function Plumbing() {
  const floors = [3, 6, 9];
  return (
    <g>
      <Flow d={`M20 1210 H625 V1250`} color={C.water} />
      <Flow d={`M680 1290 H716`} color={C.water} />
      <Flow d={`M716 1275 V1235 H1194 V${plenumTop(9) + 12}`} color={C.water} />
      {floors.map((n) => {
        const t = plenumTop(n);
        const f = floorY(n);
        return (
          <g key={n}>
            <Flow d={`M1194 ${t + 12} H1162 V${f - 28}`} color={C.water} width={3} />
            <Flow d={`M1155 ${f - 4} V${f + 14} H1203`} color={C.drain} width={3} />
          </g>
        );
      })}
      <Flow d={`M1203 ${floorY(9) + 14} V1312 H960 V1350`} color={C.drain} width={5} />
      <Flow d={`M820 1350 V1222 H20`} color={C.drain} width={5} />
      <Tag x={130} y={1196}>引込み</Tag>
      <Tag x={130} y={1246}>下水へ</Tag>
      <Tag x={625} y={1236}>受水槽</Tag>
      <Tag x={760} y={1262}>ポンプ</Tag>
      <Tag x={1290} y={520}>給水（PS立て管）</Tag>
      <Tag x={1290} y={860}>排水（PS立て管）</Tag>
      <Tag x={1110} y={floorY(6) - 42}>器具</Tag>
      <Tag x={880} y={1336}>排水槽</Tag>
    </g>
  );
}

function Fire() {
  const floors = [3, 6, 9];
  return (
    <g>
      <Flow d={`M1095 1350 V1338 H800 V1296`} color={C.fire} />
      <Flow d={`M796 1275 V1228 H1198 V${plenumTop(9) + 20.5}`} color={C.fire} />
      {floors.map((n) => {
        const t = plenumTop(n);
        const c = ceilingY(n);
        return (
          <g key={n}>
            <Flow d={`M1198 ${t + 20.5} H560`} color={C.fire} width={3} />
            {Array.from({ length: 7 }, (_, i) => 590 + i * 78).map((x) => (
              <g key={x}>
                <Flow d={`M${x} ${t + 20.5} V${c}`} color={C.fire} width={2.5} />
                <circle cx={x} cy={c + 3} r={4} fill={C.fire} stroke="#000" />
              </g>
            ))}
          </g>
        );
      })}
      <Tag x={1095} y={1326}>水源（消火水槽）</Tag>
      <Tag x={760} y={1262}>消火ポンプ</Tag>
      <Tag x={1290} y={700}>消火配管（立て管）</Tag>
      <Tag x={830} y={ceilingY(6) + 28}>スプリンクラーヘッド</Tag>
    </g>
  );
}

export function Flows({ kind }: { kind: FlowKind }) {
  return (
    <g pointerEvents="none">
      <rect x={0} y={0} width={W} height={H} fill="#0d0f11" opacity={0.5} />
      <rect x={0} y={GROUND} width={W} height={2} fill="#fff" opacity={0.3} />
      {kind === 'hvac' && <Hvac />}
      {kind === 'plumbing' && <Plumbing />}
      {kind === 'fire' && <Fire />}
    </g>
  );
}
