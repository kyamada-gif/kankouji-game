import { useMemo, useState } from 'react';
import type { Hotspot, Mode, StageId } from './types';
import { HAZARDS } from './data/hazards';
import { ACTORS } from './data/actors';
import { STAGES } from './data/stages';
import { Scene } from './components/Scene';
import { HazardPanel } from './components/HazardPanel';
import { HotspotEditor } from './components/HotspotEditor';
import { RolePanel } from './components/RolePanel';
import type { MeTab } from './components/RolePanel';
import { Timeline } from './components/Timeline';

const OVERRIDE_KEY = 'kankouji:hotspots';

function loadOverrides(): Record<string, Hotspot> {
  try {
    return JSON.parse(localStorage.getItem(OVERRIDE_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function saveOverrides(o: Record<string, Hotspot>) {
  try {
    localStorage.setItem(OVERRIDE_KEY, JSON.stringify(o));
  } catch {
    /* 保存できなくても動作は続ける */
  }
}

const MODES: { id: Mode; label: string; ready: boolean }[] = [
  { id: 'A', label: '職種マップ', ready: true },
  { id: 'B', label: '危険探し', ready: true },
  { id: 'C', label: '搬入・搬出', ready: false },
];

export default function App() {
  const [mode, setMode] = useState<Mode>('A');
  const [stageId, setStageId] = useState<StageId>(1);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [hazardId, setHazardId] = useState<string | null>(null);
  const [actorId, setActorId] = useState<string | null>(null);
  const [meTab, setMeTab] = useState<MeTab>('overview');
  const [reveal, setReveal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [overrides, setOverrides] = useState(loadOverrides);

  const stage = STAGES[stageId - 1];
  const actors = useMemo(() => ACTORS.filter((a) => a.stage === stageId), [stageId]);
  const hazards = useMemo(
    () => HAZARDS.filter((h) => h.stage === stageId).map((h) => ({ ...h, ...overrides[h.id] })),
    [stageId, overrides],
  );
  const selectedHazard = hazards.find((h) => h.id === hazardId) ?? null;
  const selectedActor = actors.find((a) => a.id === actorId) ?? null;
  const flow =
    mode === 'A' && selectedActor?.role === 'me' && (meTab === 'hvac' || meTab === 'plumbing' || meTab === 'fire') ? meTab : null;

  const changeStage = (id: StageId) => {
    setStageId(id);
    setHazardId(null);
    // 自分を選んでいたら、次の段階でも自分を選んだままにする
    const meNext = ACTORS.find((a) => a.stage === id && a.role === 'me');
    setActorId(selectedActor?.role === 'me' && meNext ? meNext.id : null);
    setReveal(false);
  };

  const pickActor = (id: string | null) => {
    setActorId(id);
    setMeTab('overview');
  };

  const patchHotspot = (id: string, patch: Partial<Hotspot>) => {
    const base = hazards.find((h) => h.id === id);
    if (!base) return;
    const next = { ...overrides, [id]: { x: base.x, y: base.y, r: base.r, ...patch } };
    setOverrides(next);
    saveOverrides(next);
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>現場まるわかり</h1>
          <p>10階建てRC造オフィスビル（試作）</p>
        </div>
        <nav className="modes" aria-label="モード切替">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              disabled={!m.ready}
              onClick={() => {
                setMode(m.id);
                setEditing(false);
              }}
              title={m.ready ? undefined : '準備中'}
            >
              <span className="mode-key">{m.id}</span>
              {m.label}
              {!m.ready && <span className="soon">準備中</span>}
            </button>
          ))}
        </nav>
        <p className="disclaimer">※ 安全ルール・法令の数値、説明の文言は専門家の確認前の仮の内容です</p>
        {mode === 'B' && (
          <button
            type="button"
            className="edit-toggle"
            aria-pressed={editing}
            onClick={() => {
              setEditing((e) => !e);
              setHazardId(null);
            }}
          >
            {editing ? '位置編集を終える' : '位置編集（開発用）'}
          </button>
        )}
      </header>

      <main className="stage-area">
        <Scene
          mode={mode}
          stage={stage}
          actors={actors}
          hazards={hazards}
          found={found}
          reveal={reveal}
          editing={editing}
          selectedId={mode === 'A' ? actorId : hazardId}
          flow={flow}
          onHit={(id) => {
            setFound((f) => new Set(f).add(id));
            setHazardId(id);
          }}
          onPickActor={pickActor}
          onSelect={setHazardId}
          onMove={(id, x, y) => patchHotspot(id, { x, y })}
        />
        {mode === 'A' ? (
          <RolePanel stage={stage} actors={actors} selected={selectedActor} tab={meTab} onSelect={pickActor} onTab={setMeTab} />
        ) : editing ? (
          <HotspotEditor
            hazards={hazards}
            selectedId={hazardId}
            onSelect={setHazardId}
            onChange={patchHotspot}
            onClear={() => {
              setOverrides({});
              saveOverrides({});
            }}
          />
        ) : (
          <HazardPanel
            stage={stage}
            actors={actors}
            hazards={hazards}
            found={found}
            selected={selectedHazard}
            reveal={reveal}
            onSelect={setHazardId}
            onToggleReveal={() => setReveal((r) => !r)}
            onReset={() => {
              setFound((f) => new Set([...f].filter((id) => !hazards.some((h) => h.id === id))));
              setHazardId(null);
            }}
          />
        )}
      </main>

      <Timeline
        value={stageId}
        onChange={changeStage}
        badge={
          mode === 'B'
            ? (id) => {
                const list = HAZARDS.filter((h) => h.stage === id);
                const n = list.filter((h) => found.has(h.id)).length;
                return `${n}/${list.length}`;
              }
            : (id) => (ACTORS.some((a) => a.stage === id && a.role === 'me') ? '● あなた' : null)
        }
      />
    </div>
  );
}
