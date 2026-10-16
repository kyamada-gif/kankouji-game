import type { Stage } from '../types';
import type { TruckDef } from '../data/trucks';
import { KEY_POINTS, LIFT_NAMES, LOGISTICS } from '../data/trucks';
import { STAGES } from '../data/stages';
import { GROUND } from '../scene/geometry';
import { TRUCK_LEN } from '../scene/truckGeom';
import { Closeup } from './Closeup';

interface Props {
  stage: Stage;
  trucks: TruckDef[];
  selected: TruckDef | null;
  onSelect: (id: string | null) => void;
}

function LiftStrip({ current }: { current: number }) {
  return (
    <ol className="lift-strip">
      {STAGES.map((s) => {
        const l = LOGISTICS[s.id];
        return (
          <li key={s.id} className={s.id === current ? 'now' : undefined}>
            <span className="ls-no">{s.id}</span>
            <span className="ls-lift">{l.lift}</span>
            <span className={l.mech === 'なし' ? 'ls-mech off' : 'ls-mech'} title={`管工事：${l.mech}`}>
              {l.mech === 'なし' ? '―' : '管'}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Detail({ t, onBack }: { t: TruckDef; onBack: () => void }) {
  const len = TRUCK_LEN[t.kind];
  return (
    <article className="detail">
      <button type="button" className="back" onClick={onBack}>
        ← この時期のトラック一覧へ
      </button>
      <p className="eyebrow">
        <span className={t.dir === '搬出' ? 'dir dir-out' : 'dir'}>{t.dir}</span> {t.vehicle}
      </p>
      <h2>{t.load}</h2>
      <Closeup bounds={{ x0: Math.max(0, t.x), y0: GROUND - 95, x1: t.x + len, y1: GROUND + 5 }} marks={[]} label={`拡大図：${t.vehicle}`} />
      <section>
        <h3>
          <span className="step-no">1</span>
          {t.dir === '搬入' ? '行き先' : '出どころと行き先'}
        </h3>
        <p>{t.dest}</p>
      </section>
      <section>
        <h3>
          <span className="step-no">2</span>揚重の手段
        </h3>
        <p>
          <span className="chip">{LIFT_NAMES[t.lift]}</span>
        </p>
        <p className="sub">断面図の動く線が、荷が運ばれる道筋です。</p>
      </section>
      <section>
        <h3>
          <span className="step-no">3</span>荷の見分け方
        </h3>
        <p>{t.hint}</p>
      </section>
      <section className="mech-card">
        <h3>
          <span className="step-no">4</span>管工事との関わり
        </h3>
        <p>{t.mech}</p>
      </section>
      <p className="provisional">※ 文言・数量は仮です（一般的な例）</p>
    </article>
  );
}

export function TruckPanel({ stage, trucks, selected, onSelect }: Props) {
  if (selected) {
    return (
      <aside className="panel">
        <Detail t={selected} onBack={() => onSelect(null)} />
      </aside>
    );
  }
  const l = LOGISTICS[stage.id];
  return (
    <aside className="panel">
      <p className="eyebrow">C. 搬入・搬出</p>
      <h2>{stage.name}</h2>
      <dl className="logi">
        <div>
          <dt>主な搬入</dt>
          <dd>{l.in}</dd>
        </div>
        <div>
          <dt>主な搬出</dt>
          <dd>{l.out}</dd>
        </div>
        <div className="logi-mech">
          <dt>管工事の動き</dt>
          <dd>{l.mech}</dd>
        </div>
      </dl>

      <p className="howto">ゲートに来たトラックを押すと、荷物の中身と行き先が分かります。</p>
      <ul className="people">
        {trucks.map((t) => (
          <li key={t.id}>
            <button type="button" className={t.mechLoad ? 'is-me' : undefined} onClick={() => onSelect(t.id)}>
              <strong>
                <span className={t.dir === '搬出' ? 'dir dir-out' : 'dir'}>{t.dir}</span> {t.load}
              </strong>
              <span>{t.vehicle}</span>
            </button>
          </li>
        ))}
      </ul>

      <h3 className="panel-sub">揚重の手段の移り変わり</h3>
      <LiftStrip current={stage.id} />
      <p className="sub">「管」は管工事が動いている時期。</p>

      <section className="points">
        <h3>要点</h3>
        <ul>
          {KEY_POINTS.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
