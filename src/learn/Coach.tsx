import { CHAPTERS } from './chapters';

interface Props {
  chapter: number;
  step: number;
  onStep: (step: number) => void;
  onFinish: () => void;
  onClose: () => void;
  /** 画面下に工期スライダーがあるか */
  lifted: boolean;
}

/** ガイドのカード（画面の左下に出る） */
export function Coach({ chapter, step, onStep, onFinish, onClose, lifted }: Props) {
  const c = CHAPTERS[chapter];
  const s = c.steps[step];
  const last = step === c.steps.length - 1;
  return (
    <aside className={lifted ? 'coach is-lifted' : 'coach'} aria-live="polite">
      <header>
        <span className="coach-ch">
          {chapter + 1}. {c.title}
        </span>
        <span className="coach-count">
          {step + 1} / {c.steps.length}
        </span>
        <button type="button" className="coach-close" onClick={onClose} aria-label="ガイドを閉じて自由に見る">
          ×
        </button>
      </header>
      <div className="coach-dots" aria-hidden="true">
        {c.steps.map((_, i) => (
          <i key={i} className={i <= step ? 'on' : undefined} />
        ))}
      </div>
      <h3>{s.title}</h3>
      <p>{s.text}</p>
      <footer>
        <button type="button" onClick={() => onStep(step - 1)} disabled={step === 0}>
          ← 前へ
        </button>
        {last ? (
          <button type="button" className="primary" onClick={onFinish}>
            {chapter < CHAPTERS.length - 1 ? `この章を終えて次へ（${chapter + 2}. ${CHAPTERS[chapter + 1].title}）` : 'この章を終える'}
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => onStep(step + 1)}>
            次へ →
          </button>
        )}
      </footer>
    </aside>
  );
}
