import { Worker } from '../scene/Worker';
import { LOOK } from '../scene/looks';

/** 「あなた」の目印（青い円に施工管理の人物） */
export function YouIcon({ label = 'あなた' }: { label?: string }) {
  return (
    <g pointerEvents="none">
      <circle r={30} fill="#2e63c8" className="you-pulse" />
      <circle r={26} fill="#e7eefb" stroke="#2e63c8" strokeWidth={3} />
      <clipPath id="you-clip">
        <circle r={24} />
      </clipPath>
      <g clipPath="url(#you-clip)">
        <Worker x={0} y={38} s={0.36} {...LOOK.mech} pose="work" tool="tablet" />
      </g>
      <rect x={-30} y={30} width={60} height={20} rx={10} fill="#2e63c8" />
      <text y={45} fontSize={13} fontWeight={700} textAnchor="middle" fill="#fff" fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
        {label}
      </text>
    </g>
  );
}
