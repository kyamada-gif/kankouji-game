import type { StageId } from '../types';
import { Building } from './Building';
import { B1_FLOOR, EXC_BOTTOM, GROUND, floorY, liftY } from './geometry';
import { ConstructionLift, Excavator, MobileCrane, Scaffold, TowerCrane, Truck } from './machines';
import {
  BackFence,
  Barricade,
  Boxes,
  Chiller,
  City,
  Conc,
  Cone,
  Cord,
  CordReel,
  Excavation,
  ExitSign,
  Gate,
  Ground,
  NoticeBoard,
  PowerPole,
  RightFence,
  RollingTower,
  SiteOffice,
  Sky,
  Slings,
  SteelBundle,
  StepLadder,
  Tree,
} from './parts';

function Stage1() {
  return (
    <g>
      <rect x={580} y={GROUND - 3} width={700} height={3} fill="#3d3f41" />
      <Cone x={735} />
      <Cone x={1030} />
      <Excavator x={880} flip />
      {/* 測量 */}
      <g stroke="#3a3a3a" strokeWidth={1.4}>
        <line x1={1160} y1={GROUND} x2={1170} y2={GROUND - 36} />
        <line x1={1180} y1={GROUND} x2={1170} y2={GROUND - 36} />
        <rect x={1164} y={GROUND - 42} width={14} height={7} fill="#e3bf3a" stroke="none" />
      </g>
      {/* 仮囲いパネルの仮置き */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={330} y={GROUND - 4 - i * 4} width={110} height={3.5} fill="#d6d5cf" stroke="#9c9b95" strokeWidth={0.5} />
      ))}
      {/* 仮設水道 */}
      <path d={`M1615 ${GROUND} V${GROUND - 26} h8`} stroke="#2e63c8" strokeWidth={2.5} fill="none" />
      <rect x={1621} y={GROUND - 29} width={5} height={5} fill="#9a9da0" />
      <Truck x={40} kind="flat-scrap" />
    </g>
  );
}

function Stage2() {
  return (
    <g>
      {[620, 820, 1020, 1220].map((x) => (
        <g key={x}>
          <Conc x={x - 15} y={EXC_BOTTOM} w={30} h={1500 - EXC_BOTTOM} fill="#9b978e" />
          {[-9, -3, 3, 9].map((d) => (
            <line key={d} x1={x + d} y1={EXC_BOTTOM} x2={x + d} y2={EXC_BOTTOM - 12} stroke="#6b3e26" strokeWidth={1.4} />
          ))}
        </g>
      ))}
      <Barricade x0={380} x1={460} />
      {/* 外されたバリケード */}
      <rect x={1402} y={GROUND - 4} width={56} height={3} fill="#9ea3a7" />
      <rect x={1404} y={GROUND - 7} width={50} height={3} fill="#e9c21f" opacity={0.7} />
      <Excavator x={640} y={EXC_BOTTOM} />
      <MobileCrane x={1480} tip={[1180, 860]} hookY={1242}>
        <Slings hx={1180} hy={1250} x0={1120} x1={1240} y={1268} />
        <SteelBundle x0={1120} x1={1240} y={1268} />
      </MobileCrane>
      <Truck x={40} kind="dump" />
    </g>
  );
}

function Stage3() {
  return (
    <g>
      <TowerCrane trolleyX={905} hookY={1228}>
        <Slings hx={905} hy={1236} x0={860} x1={950} y={1250} />
        <SteelBundle x0={860} x1={950} y={1250} h={10} color="#6b3e26" />
      </TowerCrane>
      {/* 危険：破損したコード */}
      <CordReel x={1060} y={B1_FLOOR} />
      <Cord d={`M1068 ${B1_FLOOR - 10} Q1100 ${B1_FLOOR - 1} 1140 ${B1_FLOOR - 2} T1256 ${B1_FLOOR - 26}`} damage={[1140, B1_FLOOR - 2]} />
      <Truck x={40} kind="mixer" />
    </g>
  );
}

function Stage4() {
  const top = liftY(15);
  return (
    <g>
      <Scaffold x0={488} x1={512} topLevel={15} side="left" missingRailLevel={7}>
        <line x1={491} y1={liftY(7) - 4} x2={509} y2={liftY(7) - 5} stroke="#b5b9bc" strokeWidth={1.8} />
      </Scaffold>
      <Scaffold x0={1328} x1={1352} topLevel={15} side="right" openTop>
        <path d={`M1352 ${top} V${top - 28} M1328 ${top} V${top - 20}`} stroke="#9ea3a7" strokeWidth={2} />
      </Scaffold>
      <TowerCrane trolleyX={1000} hookY={462}>
        <Slings hx={1000} hy={470} x0={960} x1={1040} y={480} />
        <rect x={960} y={480} width={80} height={14} fill="url(#p-ply)" />
      </TowerCrane>
      <Truck x={40} kind="mixer" />
    </g>
  );
}

function Stage5() {
  const k6 = liftY(6);
  return (
    <g>
      <Scaffold x0={488} x1={512} topLevel={23} side="left" />
      <Scaffold x0={1328} x1={1352} topLevel={23} side="right">
        {/* 危険：足場上に資材を積みすぎ */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={1330 + (i % 2)} y={k6 - 7 - i * 6} width={20} height={6} rx={2} fill="#d8d2c0" stroke="#8f8a7c" strokeWidth={0.5} />
        ))}
        <rect x={1329} y={k6 - 46} width={22} height={6} fill="#ebe8df" stroke="#a7a39a" strokeWidth={0.5} />
      </Scaffold>
      {/* 危険：工事用エレベーターの積載超過 */}
      <ConstructionLift overloaded />
      <rect x={364} y={GROUND - 14} width={24} height={10} fill="#3b6ea8" />
      <circle cx={368} cy={GROUND - 3} r={3} fill="#222" />
      <circle cx={384} cy={GROUND - 3} r={3} fill="#222" />
      <TowerCrane trolleyX={700} hookY={70}>
        <Slings hx={700} hy={78} x0={650} x1={750} y={96} />
        <Chiller x={648} y={146} w={104} h={42} />
      </TowerCrane>
      <RollingTower x={610} y={floorY(2)} />
      <StepLadder x={990} y={floorY(4)} h={21} />
      <Truck x={40} kind="flat-pipe" />
    </g>
  );
}

function Stage6() {
  return (
    <g>
      {/* 危険：脚立の天板に乗る */}
      <StepLadder x={700} y={floorY(8)} h={22} />
      {/* 危険：溶接の近くに可燃物・消火器なし */}
      <Boxes x={1020} y={floorY(4)} cols={3} rows={3} />
      {[0, 1].map((i) => (
        <g key={i}>
          <circle cx={1080 + i * 18} cy={floorY(4) - 8} r={8} fill="#e1cf72" stroke="#a8963e" strokeWidth={0.6} />
          <circle cx={1080 + i * 18} cy={floorY(4) - 8} r={2.5} fill="#a8963e" />
        </g>
      ))}
      <RollingTower x={700} y={floorY(5)} />
      <StepLadder x={900} y={floorY(9)} h={14} />
      <RollingTower x={620} y={floorY(10)} />
      <Truck x={40} kind="flat-pipe" />
    </g>
  );
}

function Stage7() {
  const f3 = floorY(3);
  return (
    <g>
      <rect x={284} y={GROUND - 2} width={220} height={3} fill="#9a978f" />
      <Tree x={360} h={110} />
      <Tree x={455} h={95} />
      <Tree x={1410} h={120} />
      {/* 危険：避難経路（非常口）の前に資材 */}
      <rect x={1040} y={1110} width={60} height={70} fill="#e2ded5" />
      <rect x={1052} y={1126} width={36} height={54} fill="#8a8f94" stroke="#5d6165" />
      <ExitSign x={1070} y={1116} />
      <Boxes x={1036} y={GROUND} cols={4} rows={4} />
      {/* 危険：破損したコード */}
      <CordReel x={720} y={f3} />
      <Cord d={`M728 ${f3 - 10} Q780 ${f3 - 1} 820 ${f3 - 2} T930 ${f3 - 4}`} damage={[820, f3 - 2]} />
      <rect x={926} y={f3 - 12} width={20} height={12} rx={3} fill="#3c5a7a" />
      <line x1={936} y1={f3 - 12} x2={950} y2={f3 - 32} stroke="#555" strokeWidth={2} />
      <Truck x={40} kind="flat-scrap" />
    </g>
  );
}

const STAGES = { 1: Stage1, 2: Stage2, 3: Stage3, 4: Stage4, 5: Stage5, 6: Stage6, 7: Stage7 };

export function StageArt({ stage }: { stage: StageId }) {
  const Actors = STAGES[stage];
  return (
    <g>
      <Sky />
      <City />
      <BackFence x0={stage === 7 ? 1380 : 284} />
      <Ground />
      {(stage === 2 || stage === 3) && <Excavation />}
      {stage <= 6 && <PowerPole />}
      <SiteOffice dismantling={stage === 7} />
      <NoticeBoard />
      <Building stage={stage} />
      <Gate />
      <RightFence />
      <Actors />
    </g>
  );
}
