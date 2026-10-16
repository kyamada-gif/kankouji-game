import { useMemo, useState } from 'react';
import type { Hotspot, Mode, StageId } from './types';
import { HAZARDS } from './data/hazards';
import { ACTORS } from './data/actors';
import { TRUCKS } from './data/trucks';
import { STAGES } from './data/stages';
import { Scene } from './components/Scene';
import { HazardPanel } from './components/HazardPanel';
import { HotspotEditor } from './components/HotspotEditor';
import { RolePanel } from './components/RolePanel';
import type { MeTab } from './components/RolePanel';
import { Timeline } from './components/Timeline';
import { TruckPanel } from './components/TruckPanel';
import { IndustryView } from './industry/IndustryView';
import type { IndState } from './industry/indState';
import { IND_DEFAULT } from './industry/indState';
import { Home } from './learn/Home';
import { Coach } from './learn/Coach';
import { CHAPTERS, tourLabel, tourOf } from './learn/chapters';
import type { Apply } from './learn/chapters';

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

const DONE_KEY = 'kankouji:done';

function loadDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(DONE_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function saveDone(d: Set<string>) {
  try {
    localStorage.setItem(DONE_KEY, JSON.stringify([...d]));
  } catch {
    /* 保存できなくても動作は続ける */
  }
}

type Screen = 'home' | 'site' | 'industry';

const MODES: { id: Mode; label: string; ready: boolean }[] = [
  { id: 'A', label: '職種マップ', ready: true },
  { id: 'B', label: '危険探し', ready: true },
  { id: 'C', label: '搬入・搬出', ready: true },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [ind, setInd] = useState<IndState>(IND_DEFAULT);
  const [tour, setTour] = useState<{ chapter: number; step: number; open: boolean } | null>(null);
  const [done, setDone] = useState(loadDone);
  const [focus, setFocus] = useState<{ cx: number; cy: number; w: number } | null>(null);
  const [focusKey, setFocusKey] = useState('');
  const [mode, setMode] = useState<Mode>('A');
  const [stageId, setStageId] = useState<StageId>(1);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [hazardId, setHazardId] = useState<string | null>(null);
  const [actorId, setActorId] = useState<string | null>(null);
  const [truckId, setTruckId] = useState<string | null>(null);
  const [meTab, setMeTab] = useState<MeTab>('overview');
  const [reveal, setReveal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [overrides, setOverrides] = useState(loadOverrides);

  const stage = STAGES[stageId - 1];
  const actors = useMemo(() => ACTORS.filter((a) => a.stage === stageId), [stageId]);
  const trucks = useMemo(() => TRUCKS.filter((t) => t.stage === stageId), [stageId]);
  const selectedTruck = trucks.find((t) => t.id === truckId) ?? null;
  const hazards = useMemo(
    () =>
      HAZARDS.filter((h) => h.stage === stageId).map((h) => ({
        ...h,
        ...overrides[h.id],
      })),
    [stageId, overrides],
  );
  const selectedHazard = hazards.find((h) => h.id === hazardId) ?? null;
  const selectedActor = actors.find((a) => a.id === actorId) ?? null;
  const flow =
    mode === 'A' && selectedActor?.role === 'me' && (meTab === 'hvac' || meTab === 'plumbing' || meTab === 'fire') ? meTab : null;

  const changeStage = (id: StageId) => {
    setStageId(id);
    setHazardId(null);
    setTruckId(null);
    // 自分を選んでいたら、次の段階でも自分を選んだままにする
    const meNext = ACTORS.find((a) => a.stage === id && a.role === 'me');
    setActorId(selectedActor?.role === 'me' && meNext ? meNext.id : null);
    setReveal(false);
  };

  const pickActor = (id: string | null) => {
    setActorId(id);
    setMeTab('overview');
  };

  /** ガイドのステップに合わせて画面を切り替える */
  const apply = (a: Apply, key: string) => {
    setScreen(a.screen);
    setEditing(false);
    if (a.screen === 'industry') {
      setInd({ ...IND_DEFAULT, ...a.ind });
      return;
    }
    setMode(a.mode ?? 'A');
    setStageId(a.stage ?? 1);
    setActorId(a.actor ?? null);
    setMeTab(a.meTab ?? 'overview');
    setTruckId(a.truck ?? null);
    setHazardId(a.hazard ?? null);
    if (a.hazard) setFound((f) => new Set(f).add(a.hazard!));
    setReveal(false);
    setFocus(a.focus ?? null);
    setFocusKey(key);
  };

  const goStep = (chapter: number, step: number) => {
    setTour({ chapter, step, open: true });
    apply(tourOf(chapter).steps[step].apply, `${chapter}-${step}-${Date.now()}`);
  };

  const finishChapter = (chapter: number) => {
    if (chapter < 0) {
      setTour(null);
      setInd(IND_DEFAULT);
      return;
    }
    const next = new Set(done).add(CHAPTERS[chapter].id);
    setDone(next);
    saveDone(next);
    if (chapter < CHAPTERS.length - 1) goStep(chapter + 1, 0);
    else {
      setTour(null);
      setScreen('home');
    }
  };

  const patchHotspot = (id: string, patch: Partial<Hotspot>) => {
    const base = hazards.find((h) => h.id === id);
    if (!base) return;
    const next = {
      ...overrides,
      [id]: { x: base.x, y: base.y, r: base.r, ...patch },
    };
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
        <div className="sections" role="tablist" aria-label="画面の切替">
          <button type="button" role="tab" aria-selected={screen === 'home'} onClick={() => setScreen('home')}>
            ホーム<small>学ぶ順番</small>
          </button>
          <button type="button" role="tab" aria-selected={screen === 'industry'} onClick={() => setScreen('industry')}>
            業界のしくみ<small>構造図</small>
          </button>
          <button type="button" role="tab" aria-selected={screen === 'site'} onClick={() => setScreen('site')}>
            現場の流れ<small>断面図</small>
          </button>
        </div>
        {screen === 'site' && (
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
        )}
        {tour && (
          <div className="crumb">
            <span>
              ガイド：{tourLabel(tour.chapter)}（{tour.step + 1}/{tourOf(tour.chapter).steps.length}）
            </span>
            {!tour.open && (
              <button type="button" onClick={() => goStep(tour.chapter, tour.step)}>
                ガイドに戻る
              </button>
            )}
            <button type="button" className="crumb-end" onClick={() => setTour(null)} aria-label="ガイドを終了">
              終了
            </button>
          </div>
        )}
        <p className="disclaimer">※ 安全ルール・法令の数値、説明の文言は専門家の確認前の仮の内容です</p>
        {screen === 'site' && mode === 'B' && (
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

      {screen === 'home' ? (
        <Home
          done={done}
          onStart={(i) => goStep(i, 0)}
          onFree={(i) => {
            setTour(null);
            apply(CHAPTERS[i].steps[0].apply, `free-${i}-${Date.now()}`);
          }}
        />
      ) : screen === 'industry' ? (
        <IndustryView state={ind} onChange={(patch) => setInd((cur) => ({ ...cur, ...patch }))} onUsage={() => goStep(-1, 0)} />
      ) : (
        <>
          <main className="stage-area">
            <Scene
              mode={mode}
              stage={stage}
              actors={actors}
              trucks={trucks}
              hazards={hazards}
              found={found}
              reveal={reveal}
              editing={editing}
              selectedId={mode === 'A' ? actorId : mode === 'C' ? truckId : hazardId}
              flow={flow}
              focus={focus}
              focusKey={focusKey}
              onHit={(id) => {
                setFound((f) => new Set(f).add(id));
                setHazardId(id);
              }}
              onPickActor={pickActor}
              onPickTruck={setTruckId}
              onSelect={setHazardId}
              onMove={(id, x, y) => patchHotspot(id, { x, y })}
            />
            {mode === 'C' ? (
              <TruckPanel stage={stage} trucks={trucks} selected={selectedTruck} onSelect={setTruckId} />
            ) : mode === 'A' ? (
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
                : mode === 'A'
                  ? (id) => (ACTORS.some((a) => a.stage === id && a.role === 'me') ? '● あなた' : null)
                  : (id) => `${TRUCKS.filter((t) => t.stage === id).length}台`
            }
          />
        </>
      )}

      {tour?.open && screen !== 'home' && (
        <Coach
          chapter={tour.chapter}
          step={tour.step}
          lifted={screen === 'site'}
          onStep={(i) => goStep(tour.chapter, i)}
          onFinish={() => finishChapter(tour.chapter)}
          onClose={() => setTour({ ...tour, open: false })}
        />
      )}
    </div>
  );
}
