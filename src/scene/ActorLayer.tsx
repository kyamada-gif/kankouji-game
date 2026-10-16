import type { Actor } from '../data/actors';
import { Worker } from './Worker';

export function ActorLayer({ actors }: { actors: Actor[] }) {
  return (
    <g>
      {actors.map((a) =>
        a.worker ? (
          <Worker key={a.id} {...a.worker} />
        ) : (
          // 運転席の人（頭だけ見える）
          <g key={a.id}>
            <circle cx={a.cab![0]} cy={a.cab![1] + 2} r={3.2} fill="#c29674" />
            <path d={`M${a.cab![0] - 3.6} ${a.cab![1]} a3.6 3.6 0 0 1 7.2 0 z`} fill="#f2f1ec" />
          </g>
        ),
      )}
    </g>
  );
}
