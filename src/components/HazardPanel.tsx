import type { Hazard, Stage } from '../types';
import type { Actor } from '../data/actors';
import { RESPONSE_STEPS, WHO_CLUES } from '../data/response';
import { HAZARD_MARKS } from '../data/hazards';
import { resolveMark } from '../scene/actorGeom';
import { Closeup } from './Closeup';

interface Props {
  stage: Stage;
  actors: Actor[];
  hazards: Hazard[];
  found: Set<string>;
  selected: Hazard | null;
  reveal: boolean;
  onSelect: (id: string | null) => void;
  onToggleReveal: () => void;
  onReset: () => void;
}

function Detail({ hazard, index, actors, onBack }: { hazard: Hazard; index: number; actors: Actor[]; onBack: () => void }) {
  const marks = (HAZARD_MARKS[hazard.id] ?? []).flatMap((m) => {
    const p = resolveMark(m, actors);
    return p ? [{ x: p[0], y: p[1], text: m.text }] : [];
  });
  return (
    <article className="detail">
      <button type="button" className="back" onClick={onBack}>
        ← この時期の一覧へ
      </button>
      <header className="detail-head">
        <span className="num">{index}</span>
        <h2>{hazard.title}</h2>
      </header>
      <Closeup
        bounds={{ x0: hazard.x - hazard.r, y0: hazard.y - hazard.r, x1: hazard.x + hazard.r, y1: hazard.y + hazard.r }}
        marks={marks}
        label={`拡大図：${hazard.title}`}
      />

      <section>
        <h3>
          <span className="step-no">1</span>何が危ないか
        </h3>
        <p>{hazard.danger}</p>
      </section>

      <section>
        <h3>
          <span className="step-no">2</span>正しい状態
        </h3>
        <p>{hazard.correct}</p>
      </section>

      <section>
        <h3>
          <span className="step-no">3</span>どう対応するか
        </h3>
        <ol className="steps">
          {RESPONSE_STEPS.map((s, i) => (
            <li key={s}>
              <span>{s}</span>
              {i === 0 && (
                <p className={hazard.urgent ? 'tag tag-urgent' : 'tag'}>
                  {hazard.urgent ? 'この場面：すぐに止める' : 'この場面：止めるより、まず本人に伝える'}
                </p>
              )}
              {i === 1 && <blockquote>{hazard.callout}</blockquote>}
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h3>
          <span className="step-no">4</span>誰に言えばいいか
        </h3>
        <p className="clue">{hazard.whoClue}</p>
        <dl className="who">
          {WHO_CLUES.map((c) => (
            <div key={c.label}>
              <dt>{c.label}</dt>
              <dd>{c.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      {hazard.provisional && <p className="provisional">※仮：{hazard.provisional}</p>}
    </article>
  );
}

export function HazardPanel({ stage, actors, hazards, found, selected, reveal, onSelect, onToggleReveal, onReset }: Props) {
  if (selected) {
    return (
      <aside className="panel">
        <Detail hazard={selected} actors={actors} index={hazards.findIndex((h) => h.id === selected.id) + 1} onBack={() => onSelect(null)} />
      </aside>
    );
  }
  const count = hazards.filter((h) => found.has(h.id)).length;
  const done = count === hazards.length;
  return (
    <aside className="panel">
      <p className="eyebrow">B. 危険探し</p>
      <h2>{stage.name}</h2>
      <p className="summary">{stage.summary}</p>

      <div className={done ? 'progress is-done' : 'progress'}>
        <strong>
          {count} / {hazards.length}
        </strong>
        <span>{done ? 'この時期の危険をすべて見つけました' : 'この時期の危険を見つけた数'}</span>
      </div>

      <p className="howto">現場の中で「危ない」と思う人や物を押してください。拡大すると、あごひもやハーネスのフックまで見えます。</p>

      <ol className="found-list">
        {hazards.map((h, i) => (
          <li key={h.id}>
            {found.has(h.id) ? (
              <button type="button" onClick={() => onSelect(h.id)}>
                <span className="num">{i + 1}</span>
                {h.title}
              </button>
            ) : (
              <span className="unknown">
                <span className="num">{i + 1}</span>まだ見つけていない
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="panel-actions">
        <button type="button" onClick={onToggleReveal} aria-pressed={reveal}>
          {reveal ? '答えを隠す' : '答えを表示'}
        </button>
        <button type="button" onClick={onReset} disabled={count === 0}>
          この時期をやり直す
        </button>
      </div>
    </aside>
  );
}
