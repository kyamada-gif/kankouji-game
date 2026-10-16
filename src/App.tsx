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
import { Coach, FreeCard } from './learn/Coach';
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

// 位置編集（開発用）は URL に ?edit を付けたときだけ出す
const EDIT_ALLOWED = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('edit');

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [ind, setInd] = useState<IndState>(IND_DEFAULT);
  const [tour, setTour] = useState<{ chapter: number; step: number } | null>(null);
  /** 今いる章（ガイドなしで見ているときも保持） */
  const [current, setCurrent] = useState<number | null>(null);
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
    setTour({ chapter, step });
    if (chapter >= 0) setCurrent(chapter);
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

  const screenName = screen === 'industry' ? '構造図' : mode === 'A' ? '職種マップ' : mode === 'B' ? '危険探し' : '搬入・搬出';

  const goHome = () => {
    setTour(null);
    setScreen('home');
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
        </div>
        {screen !== 'home' && (
          <>
            <button type="button" className="home-btn" onClick={goHome}>
              ← ホーム
            </button>
            {tour ? (
              <div className="where">
                <strong>{tourLabel(tour.chapter)}</strong>
                <span className="screen-tag">{screenName}</span>
                <span className="where-bar" aria-hidden="true">
                  {tourOf(tour.chapter).steps.map((_, i) => (
                    <i key={i} className={i <= tour.step ? 'on' : undefined} />
                  ))}
                </span>
                <span className="where-count">
                  {tour.step + 1} / {tourOf(tour.chapter).steps.length}
                </span>
              </div>
            ) : (
              current !== null && (
                <div className="where">
                  <strong>{tourLabel(current)}</strong>
                  <span className="screen-tag">{screenName}</span>
                </div>
              )
            )}
          </>
        )}
        {EDIT_ALLOWED && screen === 'site' && mode === 'B' && (
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
            setCurrent(i);
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

      {screen !== 'home' &&
        (tour ? (
          <Coach
            chapter={tour.chapter}
            step={tour.step}
            lifted={screen === 'site'}
            onStep={(i) => goStep(tour.chapter, i)}
            onFinish={() => finishChapter(tour.chapter)}
          />
        ) : (
          current !== null && <FreeCard chapter={current} lifted={screen === 'site'} onGuide={() => goStep(current, 0)} />
        ))}
    </div>
  );
}
