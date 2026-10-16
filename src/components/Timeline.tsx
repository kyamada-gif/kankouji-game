import type { StageId } from '../types';
import { STAGES } from '../data/stages';

interface Props {
  value: StageId;
  onChange: (id: StageId) => void;
  /** 段階ごとの補足（例：見つけた数） */
  badge?: (id: StageId) => string | null;
}

export function Timeline({ value, onChange, badge }: Props) {
  return (
    <footer className="timeline">
      <label className="timeline-label" htmlFor="stage-range">
        工期
      </label>
      <div className="timeline-body">
        <input
          id="stage-range"
          type="range"
          min={1}
          max={7}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) as StageId)}
          aria-valuetext={STAGES[value - 1].name}
        />
        <ol className="ticks">
          {STAGES.map((s) => {
            const b = badge?.(s.id);
            return (
              <li key={s.id}>
                <button type="button" aria-current={s.id === value ? 'step' : undefined} onClick={() => onChange(s.id)}>
                  <span className="tick-no">{s.id}</span>
                  <span className="tick-name">{s.name}</span>
                  {b && <span className="tick-badge">{b}</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </footer>
  );
}
