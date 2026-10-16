interface Props {
  /** 見せたい範囲（シーン座標） */
  bounds: { x0: number; y0: number; x1: number; y1: number };
  marks: { x: number; y: number; text: string }[];
  label: string;
}

const RATIO = 0.62;

/** 断面図の一部を拡大して、引き出し線で説明する */
export function Closeup({ bounds, marks, label }: Props) {
  const pts = [...marks.map((m) => [m.x, m.y]), [bounds.x0, bounds.y0], [bounds.x1, bounds.y1]];
  const minX = Math.min(...pts.map((p) => p[0]));
  const maxX = Math.max(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));
  const maxY = Math.max(...pts.map((p) => p[1]));
  const w = Math.max(130, (maxX - minX) * 1.9, ((maxY - minY) * 1.7) / RATIO);
  const h = w * RATIO;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2 + h * 0.08;
  const vx = cx - w / 2;
  const vy = cy - h / 2;
  const fs = w / 22;

  const left = marks.filter((m) => m.x < cx);
  const right = marks.filter((m) => m.x >= cx);

  const draw = (list: typeof marks, side: 'l' | 'r') =>
    list.map((m, i) => {
      const lx = side === 'l' ? vx + w * 0.03 : vx + w * 0.97;
      const ly = vy + fs * 1.5 + i * fs * 1.7;
      const tw = m.text.length * fs * 1.02;
      const endX = side === 'l' ? lx + tw : lx - tw;
      return (
        <g key={`${side}${i}`}>
          <path d={`M${endX + (side === 'l' ? fs * 0.3 : -fs * 0.3)} ${ly - fs * 0.35} L${m.x} ${m.y}`} stroke="#f2b705" strokeWidth={fs * 0.12} fill="none" />
          <circle cx={m.x} cy={m.y} r={fs * 0.45} fill="none" stroke="#f2b705" strokeWidth={fs * 0.15} />
          <rect x={side === 'l' ? lx - fs * 0.3 : endX - fs * 0.3} y={ly - fs * 1.05} width={tw + fs * 0.6} height={fs * 1.4} rx={fs * 0.25} fill="#14171a" fillOpacity={0.88} />
          <text x={lx} y={ly} fontSize={fs} fill="#fff" textAnchor={side === 'l' ? 'start' : 'end'} fontWeight={700} fontFamily="'Hiragino Sans','Noto Sans JP',sans-serif">
            {m.text}
          </text>
        </g>
      );
    });

  return (
    <figure className="closeup">
      <svg viewBox={`${vx} ${vy} ${w} ${h}`} role="img" aria-label={label}>
        <use href="#scene-root" />
        {draw(left, 'l')}
        {draw(right, 'r')}
      </svg>
    </figure>
  );
}
