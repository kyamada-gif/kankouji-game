import type { Stage, StageId } from '../types';
import type { Actor } from '../data/actors';
import type { FlowKind } from '../data/mech';
import { PROCESS, SYSTEMS } from '../data/mech';
import { ROLES } from '../data/roles';
import { STAGES } from '../data/stages';
import { actorBox } from '../scene/actorGeom';
import { workerAnchor } from '../scene/workerGeom';
import { Closeup } from './Closeup';
import { BELT_NAMES, TOOL_NAMES } from '../scene/toolNames';

interface Props {
  stage: Stage;
  actors: Actor[];
  selected: Actor | null;
  tab: MeTab;
  onSelect: (id: string | null) => void;
  onTab: (tab: MeTab) => void;
}

export type MeTab = 'overview' | FlowKind | 'process';

const TABS: { id: MeTab; label: string }[] = [
  { id: 'overview', label: '仕事の全体' },
  { id: 'hvac', label: '空調' },
  { id: 'plumbing', label: '給排水衛生' },
  { id: 'fire', label: '消火' },
  { id: 'process', label: '施工の流れ' },
];

function ActorCloseup({ actor }: { actor: Actor }) {
  const b = actorBox(actor);
  const w = actor.worker;
  const marks: { x: number; y: number; text: string }[] = [];
  if (w) {
    const at = (a: Parameters<typeof workerAnchor>[1]) => workerAnchor(w, a);
    marks.push({ x: at('helmet')[0], y: at('helmet')[1] + 2, text: w.helmetLine ? 'ヘルメット（ライン入り）' : 'ヘルメット（社名ステッカー）' });
    if (w.armband) marks.push({ x: at('armband')[0], y: at('armband')[1], text: '腕章' });
    if (w.harness && w.harness !== 'none') marks.push({ x: at('chest')[0], y: at('chest')[1], text: 'フルハーネス' });
    if (w.vest) marks.push({ x: at('chest')[0], y: at('chest')[1], text: '反射ベスト' });
    if (w.tool && w.tool !== 'none') marks.push({ x: at('hand')[0], y: at('hand')[1], text: TOOL_NAMES[w.tool] });
    if (w.belt) marks.push({ x: at('waist')[0] + 3 * (w.flip ? -1 : 1), y: at('waist')[1] + 2, text: BELT_NAMES[w.belt] });
  } else {
    marks.push({ x: b.cx, y: b.cy, text: '運転席' });
  }
  return <Closeup bounds={{ x0: b.x0, y0: b.y0, x1: b.x1, y1: b.y1 }} marks={marks} label={`拡大図：${ROLES[actor.role].name}`} />;
}

function When({ stages, current }: { stages: StageId[]; current: StageId }) {
  return (
    <ol className="when">
      {STAGES.map((s) => (
        <li key={s.id} className={[stages.includes(s.id) ? 'on' : '', s.id === current ? 'now' : ''].join(' ')} title={s.name}>
          <span>{s.id}</span>
          <small>{s.name}</small>
        </li>
      ))}
    </ol>
  );
}

function Basics({ actor, current, mechTitle }: { actor: Actor; current: StageId; mechTitle: string }) {
  const r = ROLES[actor.role];
  return (
    <>
      <section>
        <h3>
          <span className="step-no">1</span>何をする人か
        </h3>
        <p>{r.what}</p>
      </section>
      <section>
        <h3>
          <span className="step-no">2</span>建物のどこで働いているか
        </h3>
        <p>{r.where}</p>
      </section>
      <section>
        <h3>
          <span className="step-no">3</span>所属する会社
        </h3>
        <p>
          <span className="chip">{r.company}</span>
        </p>
        <p className="sub">{r.chain}</p>
      </section>
      <section>
        <h3>
          <span className="step-no">4</span>いつ現場にいるか
        </h3>
        <When stages={r.when} current={current} />
      </section>
      <section>
        <h3>
          <span className="step-no">5</span>主な作業の流れ
        </h3>
        <ol className="flow-steps">
          {r.flow.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ol>
      </section>
      <section>
        <h3>
          <span className="step-no">6</span>施工管理者が見るポイント
        </h3>
        <ul className="checks">
          {r.checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>
      <section className="mech-card">
        <h3>
          <span className="step-no">7</span>
          {mechTitle}
        </h3>
        <p>{r.mech}</p>
      </section>
    </>
  );
}

function SystemTab({ kind, stageId }: { kind: FlowKind; stageId: StageId }) {
  const sys = SYSTEMS[kind];
  return (
    <section className="system">
      <p>{sys.lead}</p>
      {stageId < 6 && <p className="note">今の段階では、設備はまだできていません。断面図の線は「完成したときの流れ」です。</p>}
      <ul className="legend">
        {sys.legend.map((l) => (
          <li key={l.label}>
            <span style={{ background: l.color }} />
            {l.label}
          </li>
        ))}
      </ul>
      <ol className="chain">
        {sys.steps.map((s) => (
          <li key={s.name}>
            <strong>{s.name}</strong>
            <span>{s.desc}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ProcessTab({ stageId }: { stageId: StageId }) {
  return (
    <section className="system">
      <p>管工事の施工は、次の順番で進みます。今の時期に当たるところに印を付けています。</p>
      <ol className="chain">
        {PROCESS.map((p) => {
          const now = p.stages.includes(stageId);
          return (
            <li key={p.name} className={now ? 'now' : undefined}>
              <strong>
                {p.name}
                {now && <em>今ここ</em>}
              </strong>
              <span>{p.desc}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function RolePanel({ stage, actors, selected, tab, onSelect, onTab }: Props) {
  if (selected) {
    const r = ROLES[selected.role];
    const me = selected.role === 'me';
    return (
      <aside className="panel">
        <article className="detail">
          <button type="button" className="back" onClick={() => onSelect(null)}>
            ← この時期の人の一覧へ
          </button>
          <p className="eyebrow">{r.group}</p>
          <h2 className={me ? 'me-title' : undefined}>{r.name}</h2>
          <ActorCloseup actor={selected} />
          <p className="doing">
            <span>この場面で</span>
            {selected.doing}
          </p>
          <section className="spot">
            <h3>見分け方</h3>
            <dl>
              <div>
                <dt>作業の様子</dt>
                <dd>{r.spot.work}</dd>
              </div>
              <div>
                <dt>持っている道具</dt>
                <dd>{r.spot.tools}</dd>
              </div>
              <div>
                <dt>服装・装備</dt>
                <dd>{r.spot.gear}</dd>
              </div>
            </dl>
          </section>
          {me && (
            <div className="tabs" role="tablist">
              {TABS.map((t) => (
                <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => onTab(t.id)}>
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {(!me || tab === 'overview') && <Basics actor={selected} current={stage.id} mechTitle={me ? 'この仕事の特徴' : '管工事との関わり'} />}
          {me && (tab === 'hvac' || tab === 'plumbing' || tab === 'fire') && <SystemTab kind={tab} stageId={stage.id} />}
          {me && tab === 'process' && <ProcessTab stageId={stage.id} />}
          <p className="provisional">※ 説明の文言は仮です（一般的な例。会社・現場によって異なります）</p>
        </article>
      </aside>
    );
  }

  const sorted = [...actors].sort((a, b) => Number(b.role === 'me') - Number(a.role === 'me'));
  const hasMe = actors.some((a) => a.role === 'me');
  return (
    <aside className="panel">
      <p className="eyebrow">A. 職種マップ</p>
      <h2>{stage.name}</h2>
      <p className="summary">{stage.summary}</p>
      {!hasMe && (
        <p className="note">
          この時期、管工事の現場作業はほとんどありません。あなたは事務所で施工図を描き、次の段階のスリーブや埋設配管に備えます。（仮）
        </p>
      )}
      <p className="howto">断面図の人を押すか、下の一覧から選んでください。</p>
      <ul className="people">
        {sorted.map((a) => {
          const r = ROLES[a.role];
          return (
            <li key={a.id}>
              <button type="button" className={a.role === 'me' ? 'is-me' : undefined} onClick={() => onSelect(a.id)}>
                <strong>{a.role === 'me' ? 'あなた（管工事の施工管理）' : r.name}</strong>
                <span>{a.doing}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
