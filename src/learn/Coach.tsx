import { CHAPTERS, tourLabel, tourOf } from './chapters';

interface Props {
  chapter: number;
  step: number;
  onStep: (step: number) => void;
  onFinish: () => void;
  /** 画面下に工期スライダーがあるか */
  lifted: boolean;
}

/** ガイドのカード（画面の左下） */
export function Coach({ chapter, step, onStep, onFinish, lifted }: Props) {
  const tour = tourOf(chapter);
  const s = tour.steps[step];
  const last = step === tour.steps.length - 1;
  return (
    <aside className={lifted ? 'coach is-lifted' : 'coach'} aria-live="polite">
      <p className="coach-ch">
        {tourLabel(chapter)} ・ {step + 1} / {tour.steps.length}
      </p>
      <div className="coach-dots" aria-hidden="true">
        {tour.steps.map((_, i) => (
          <i key={i} className={i <= step ? 'on' : undefined} />
        ))}
      </div>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <footer>
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0}>
          ← 前へ
        </button>
        <button type="button" className="primary" onClick={() => (last ? onFinish() : onStep(step + 1))}>
          {!last
            ? '次へ →'
            : chapter < 0
              ? '使い方ガイドを終える'
              : chapter < CHAPTERS.length - 1
                ? `次の章へ：${CHAPTERS[chapter + 1].title} →`
                : 'ホームに戻る'}
        </button>
      </footer>
    </aside>
  );
}

/** ガイドなしで見ているときのカード */
export function FreeCard({ chapter, onGuide, lifted }: { chapter: number; onGuide: () => void; lifted: boolean }) {
  return (
    <aside className={lifted ? 'coach is-lifted' : 'coach'}>
      <p className="coach-ch">{tourLabel(chapter)}</p>
      <p>自由に見ています。順番に見るときはガイドを使います。</p>
      <footer>
        <span />
        <button type="button" className="primary" onClick={onGuide}>
          ガイドで見る
        </button>
      </footer>
    </aside>
  );
}
