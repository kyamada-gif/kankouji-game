import type { LayerId, Method } from './graph';
import { FLOWS, METHODS } from './graph';
import { LAYERS } from './layers';
import { COMPANIES } from './companies';
import type { RuleId } from './rules';
import { RULES } from './rules';
import { Vignette } from './Vignettes';
import { USAGE_TOUR } from '../learn/chapters';
import { PHOTOS } from './photos';

export type PanelState =
  { type: 'intro' } | { type: 'layer'; id: LayerId } | { type: 'company'; id: string; from: LayerId } | { type: 'rule'; id: RuleId };

interface Props {
  state: PanelState;
  method: Method;
  onChange: (s: PanelState) => void;
  onUsage: () => void;
}

function Picture({ id }: { id: LayerId }) {
  return (
    <figure className="closeup ind-pic">
      <svg viewBox="0 0 200 110" role="img" aria-label={LAYERS[id].name}>
        <Vignette id={id} />
      </svg>
    </figure>
  );
}

const USAGE = [
  {
    title: '図の層や会社の箱を押す',
    text: '発注者から職人まで、6つの層が上から並んでいます。押すと、ここにその立場の説明と代表企業が出ます。',
  },
  { title: 'あなたの派遣先を切り替える', text: '上のボタンで「ゼネコン／サブコン」を切り替えると、青い印（あなた）の位置が変わります。' },
  {
    title: '流れを切り替える',
    text: 'お金・契約・指示・物・人のどれかを選ぶと、図の上に矢印が出ます。まずは「指示」と「お金」がおすすめ。',
  },
  { title: '発注方式を切り替える', text: '一括発注・分離発注などを切り替えると、図が組み替わります。サブコンの位置の変化に注目。' },
  { title: 'ルールを選ぶ', text: '上の⑤「ルール」を押すと一覧が開きます。選んだルールが効いている場所が、図の中で光ります。' },
  { title: 'このビルの施工体系図を見る', text: '断面図のビルに、実際にどんな会社が入っているかを見ます（社名は架空）。' },
];

function Check() {
  return <span className="tag-check">要確認</span>;
}

export function IndustryPanel({ state, method, onChange, onUsage }: Props) {
  if (state.type === 'layer') {
    const l = LAYERS[state.id];
    return (
      <aside className="panel">
        <article className="detail">
          <button type="button" className="back" onClick={() => onChange({ type: 'intro' })}>
            ← 使い方へ
          </button>
          <p className="eyebrow">立場</p>
          <h2 className={state.id === 'dispatch' ? 'me-title' : undefined}>{l.name}</h2>
          <Picture id={state.id} />
          <section>
            <h3>
              <span className="step-no">1</span>どんな立場か
            </h3>
            <p>{l.what}</p>
          </section>
          <section>
            <h3>
              <span className="step-no">2</span>主な責任と仕事
            </h3>
            <ul className="checks">
              {l.duties.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>
              <span className="step-no">3</span>誰と契約し、誰に指示を出すか
            </h3>
            <dl className="who">
              <div>
                <dt>契約</dt>
                <dd>{l.contract}</dd>
              </div>
              <div>
                <dt>指示</dt>
                <dd>{l.order}</dd>
              </div>
            </dl>
          </section>
          <section>
            <h3>
              <span className="step-no">4</span>この立場ならではのルール
            </h3>
            {l.rules.length ? (
              <div className="rule-chips">
                {l.rules.map((r) => (
                  <button key={r} type="button" onClick={() => onChange({ type: 'rule', id: r })}>
                    {RULES.find((x) => x.id === r)!.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="sub">特になし（仮）</p>
            )}
          </section>
          <section className="mech-card">
            <h3>
              <span className="step-no">5</span>管工事の施工管理から見た関わり方
            </h3>
            <p>{l.mech}</p>
          </section>
          <section>
            <h3>
              <span className="step-no">6</span>代表企業
            </h3>
            {l.groups.map((g) => (
              <div key={g.label} className="co-group">
                <p className="co-label">{g.label}</p>
                <ul className="co-list">
                  {g.items.map((it) => {
                    if (typeof it === 'string') {
                      const c = COMPANIES[it];
                      return (
                        <li key={it}>
                          <button type="button" onClick={() => onChange({ type: 'company', id: it, from: state.id })}>
                            {c.name} <span aria-hidden="true">›</span>
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={it.name}>
                        <span>{it.name}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <p className="sub">› が付いた会社は企業カードがあります。社名・区分は要確認です。</p>
          </section>
          <p className="provisional">※ 説明の文言は仮です（一般的な例）</p>
        </article>
      </aside>
    );
  }

  if (state.type === 'company') {
    const c = COMPANIES[state.id];
    return (
      <aside className="panel">
        <article className="detail">
          <button type="button" className="back" onClick={() => onChange({ type: 'layer', id: state.from })}>
            ← {LAYERS[state.from].name}へ
          </button>
          <p className="eyebrow">{c.category}</p>
          <h2>{c.name}</h2>
          <section>
            <h3>
              <span className="step-no">2</span>売上規模
            </h3>
            <p>{c.scale}</p>
            <p className="src">出典：{c.scaleSource}</p>
          </section>
          <section>
            <h3>
              <span className="step-no">3</span>得意な分野
            </h3>
            <div className="field-chips">
              {c.fields.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </section>
          <section>
            <h3>
              <span className="step-no">4</span>代表的な工事
            </h3>
            <ul className="works">
              {c.works.map((w) => {
                const ph = w.photo ? PHOTOS[w.photo] : undefined;
                return (
                  <li key={w.name}>
                    {w.photo ? (
                      <img src={`${import.meta.env.BASE_URL}images/works/${w.photo}.jpg`} alt={w.name} loading="lazy" />
                    ) : w.link ? (
                      <a className="photo-slot" href={w.link} target="_blank" rel="noopener noreferrer">
                        公式サイトの実績一覧 ↗
                      </a>
                    ) : (
                      <div className="photo-slot">写真（差し替え予定）</div>
                    )}
                    <strong>{w.name}</strong>
                    {w.note && <span>{w.note}</span>}
                    {ph && (
                      <a className="credit" href={ph.source} target="_blank" rel="noopener noreferrer">
                        写真：{ph.artist}／{ph.license}／Wikimedia Commons
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="src">出典：{c.worksSource}。共同企業体（JV）での施工を含みます。</p>
          </section>
          <section>
            <h3>
              <span className="step-no">5</span>会社の特徴
            </h3>
            <p>{c.features}</p>
          </section>
          <section className="mech-card">
            <h3>
              <span className="step-no">6</span>管工事の施工管理から見た関わり方
            </h3>
            <p>{c.mech}</p>
          </section>
          <section>
            <h3>
              <span className="step-no">7</span>公式サイト
            </h3>
            <p>
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.url}
              </a>
            </p>
            <p className="src">2026-10-16 にアクセスを確認</p>
          </section>
          <p className="provisional">
            ※ 売上・実績は出典の記載をもとにしています。会社の特徴と「得意な分野」の文言は仮です（
            <Check />
            ）。
          </p>
        </article>
      </aside>
    );
  }

  if (state.type === 'rule') {
    const r = RULES.find((x) => x.id === state.id)!;
    return (
      <aside className="panel">
        <article className="detail">
          <button type="button" className="back" onClick={() => onChange({ type: 'intro' })}>
            ← 使い方へ
          </button>
          <p className="eyebrow">ルール</p>
          <h2>{r.name}</h2>
          <p className="summary">{r.summary}</p>
          <p className="note">図の中で、このルールが関わる場所を黄色・緑・赤で示しています。</p>
          <section>
            <h3>説明</h3>
            <p>{r.detail}</p>
          </section>
          <section className="mech-card">
            <h3>管工事の施工管理として</h3>
            <p>{r.mech}</p>
          </section>
          <p className="provisional">※ 法令の内容は仮です。正式な条文・数値は要確認。</p>
        </article>
      </aside>
    );
  }

  const m = METHODS.find((x) => x.id === method)!;
  return (
    <aside className="panel">
      <p className="eyebrow">業界のしくみ</p>
      <h2>この画面の使い方</h2>
      <p className="summary">
        建物は、たくさんの会社が「上から下へ」仕事を渡していくことでできています。その中で、あなた（青い印）がどこにいるかを、次の順番で見ていきましょう。
      </p>
      <button type="button" className="primary usage-start" onClick={onUsage}>
        ガイドで使い方を見る（{USAGE_TOUR.steps.length}ステップ）
      </button>
      <ol className="usage">
        {USAGE.map((u, i) => (
          <li key={u.title}>
            <span className="num-badge">{i + 1}</span>
            <div>
              <strong>{u.title}</strong>
              <p>{u.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="logi">
        <div className="logi-mech">
          <dt>今の発注方式</dt>
          <dd>
            <strong>{m.label}</strong>：{m.note}
          </dd>
        </div>
      </div>
      <p className="howto">矢印の色</p>
      <ul className="legend ind-legend">
        {FLOWS.filter((f) => f.id !== 'none').map((f) => (
          <li key={f.id}>
            <span style={{ background: f.color }} />
            {f.label}
          </li>
        ))}
      </ul>
    </aside>
  );
}
