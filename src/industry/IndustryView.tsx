import type { DispatchTo, FlowType, LayerId, Method } from './graph';
import { FLOWS, METHODS } from './graph';
import { RULES } from './rules';
import { Diagram } from './Diagram';
import { BuildingTree } from './BuildingTree';
import { IndustryPanel } from './IndustryPanel';
import type { PanelState } from './IndustryPanel';
import type { IndState } from './indState';

export function IndustryView({
  state,
  onChange,
  onUsage,
}: {
  state: IndState;
  onChange: (patch: Partial<IndState>) => void;
  /** 使い方ガイドを始める */
  onUsage: () => void;
}) {
  const { method, flow, dispatchTo, building, panel } = state;
  const setMethod = (method: Method) => onChange({ method });
  const setFlow = (flow: FlowType) => onChange({ flow });
  const setDispatchTo = (dispatchTo: DispatchTo) => onChange({ dispatchTo });
  const setBuilding = (building: boolean) => onChange({ building });
  const setPanel = (panel: PanelState) => onChange({ panel });

  const rule = panel.type === 'rule' ? RULES.find((r) => r.id === panel.id)! : null;
  const highlight = rule ? rule.highlight(method, dispatchTo) : null;
  const selectedLayer = panel.type === 'layer' ? panel.id : panel.type === 'company' ? panel.from : null;
  const pickLayer = (id: LayerId) => setPanel({ type: 'layer', id });

  return (
    <div className="industry">
      <div className="ind-toolbar">
        <button type="button" className="usage-btn" onClick={onUsage}>
          ？ 使い方ガイド
        </button>
        <p className="ind-step-hint">
          <Num n={1} />
          図の層や会社の箱を押す
        </p>
        <div className="seg" role="group" aria-label="あなたの派遣先">
          <span className="seg-label">
            <Num n={2} />
            あなたの派遣先
          </span>
          <button type="button" aria-pressed={dispatchTo === 'gc'} onClick={() => setDispatchTo('gc')}>
            ゼネコン
          </button>
          <button type="button" aria-pressed={dispatchTo === 'mech'} onClick={() => setDispatchTo('mech')}>
            サブコン
          </button>
        </div>
        <div className="seg" role="group" aria-label="流れ">
          <span className="seg-label">
            <Num n={3} />
            流れ
          </span>
          {FLOWS.map((f) => (
            <button key={f.id} type="button" aria-pressed={flow === f.id} onClick={() => setFlow(f.id)} disabled={building}>
              {f.id !== 'none' && <i style={{ background: f.color }} />}
              {f.label}
            </button>
          ))}
        </div>
        <div className="seg" role="group" aria-label="発注方式">
          <span className="seg-label">
            <Num n={4} />
            発注方式
          </span>
          {METHODS.map((m) => (
            <button key={m.id} type="button" aria-pressed={method === m.id} onClick={() => setMethod(m.id)} disabled={building}>
              {m.label}
            </button>
          ))}
        </div>
        <button type="button" className="building-btn" aria-pressed={building} onClick={() => setBuilding(!building)}>
          {building ? (
            '← 構造図に戻る'
          ) : (
            <>
              <Num n={6} />
              このビルの施工体系図
            </>
          )}
        </button>
      </div>

      <nav className="ind-rules" aria-label="ルール">
        <p className="eyebrow">
          <Num n={5} />
          ルール
        </p>
        <ul>
          {RULES.map((r) => (
            <li key={r.id}>
              <button
                type="button"

                aria-pressed={rule?.id === r.id}
                onClick={() => {
                  setBuilding(false);
                  setPanel(rule?.id === r.id ? { type: 'intro' } : { type: 'rule', id: r.id });
                }}
              >
                <strong>{r.name}</strong>
                <span>{r.summary}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="provisional">※ 法令の内容は仮です（要確認）</p>
      </nav>

      <div className="ind-canvas">
        {building ? (
          <BuildingTree dispatchTo={dispatchTo} onPickLayer={pickLayer} />
        ) : (
          <Diagram
            method={method}
            flow={flow}
            dispatchTo={dispatchTo}
            highlight={highlight}
            selectedLayer={selectedLayer}
            onPickLayer={pickLayer}
          />
        )}
      </div>

      <IndustryPanel state={panel} method={method} onChange={setPanel} onUsage={onUsage} />
    </div>
  );
}

function Num({ n }: { n: number }) {
  return <span className="num-badge">{n}</span>;
}
