import type { ReactNode } from 'react';
import { Defs } from '../scene/Defs';
import { CHAPTERS } from './chapters';
import { LayersThumb, SceneThumb } from './Thumbs';

interface Props {
  done: Set<string>;
  onStart: (chapter: number) => void;
  onFree: (chapter: number) => void;
}

const THUMBS: Record<string, ReactNode> = {
  overview: <SceneThumb stage={5} crop={[1000, 700, 2000]} />,
  industry: <LayersThumb />,
  stages: <SceneThumb stage={4} crop={[950, 760, 1500]} />,
  people: <SceneThumb stage={6} crop={[820, 800, 900]} />,
  me: <SceneThumb stage={5} crop={[820, 1000, 600]} />,
  goods: <SceneThumb stage={5} crop={[330, 1100, 700]} />,
  safety: <SceneThumb stage={4} crop={[1250, 560, 600]} />,
  rules: <LayersThumb money />,
};

export function Home({ done, onStart, onFree }: Props) {
  const next = CHAPTERS.findIndex((c) => !done.has(c.id));
  return (
    <div className="home">
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <Defs />
      </svg>
      <section className="home-hero">
        <div>
          <p className="eyebrow">この教材の歩き方</p>
          <h2>建物ができる流れの中で、あなたが「いつ・誰と・何を」するのか</h2>
          <p>
            まず全体像をざっと見てから、業界のしくみ → 現場 → あなたの仕事 → 物 → 安全 → ルール、の順に詳しく見ていきます。
            各章はガイドつきで、画面が自動で切り替わります。気になる章から始めてもかまいません。
          </p>
        </div>
        <div className="home-progress">
          <strong>
            {done.size} / {CHAPTERS.length}
          </strong>
          <span>章を見終わりました</span>
          <button type="button" className="primary" onClick={() => onStart(next < 0 ? 0 : next)}>
            {done.size === 0 ? '最初から始める' : next < 0 ? 'もう一度最初から' : `続きから：${next + 1}. ${CHAPTERS[next].title}`}
          </button>
        </div>
      </section>

      <ol className="road">
        {CHAPTERS.map((c, i) => (
          <li key={c.id} className={[done.has(c.id) ? 'is-done' : '', i === next ? 'is-next' : ''].join(' ')}>
            <div className="road-thumb">{THUMBS[c.id]}</div>
            <div className="road-body">
              <p className="road-no">
                <span>{i + 1}</span>
                {done.has(c.id) ? '見終わった' : i === next ? 'おすすめ：次はここ' : `約${c.minutes}分`}
              </p>
              <h3>{c.title}</h3>
              <p className="road-sum">{c.summary}</p>
              <p className="road-where">見る画面：{c.where}</p>
              <div className="road-actions">
                <button type="button" className="primary" onClick={() => onStart(i)}>
                  ガイドで見る（{c.steps.length}ステップ）
                </button>
                <button type="button" onClick={() => onFree(i)}>
                  自由に見る
                </button>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
