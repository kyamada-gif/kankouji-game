import { useEffect, useRef, useState } from 'react';
import type { RuleId } from './rules';
import { RULES } from './rules';

interface Props {
  selected: RuleId | null;
  onPick: (id: RuleId | null) => void;
}

/** ⑤ ルールのドロップダウン。押すと下に一覧が開く */
export function RuleMenu({ selected, onPick }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = RULES.find((r) => r.id === selected);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="rule-menu" ref={ref}>
      <button type="button" className="rule-menu-btn" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((o) => !o)}>
        <span className="num-badge">5</span>
        ルール{current ? `：${current.name}` : ''}
        <span className="caret" aria-hidden="true">
          ▾
        </span>
      </button>
      {open && (
        <div className="rule-menu-list" role="listbox" aria-label="ルール">
          <ul>
            {RULES.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={r.id === selected}
                  onClick={() => {
                    onPick(r.id === selected ? null : r.id);
                    setOpen(false);
                  }}
                >
                  <strong>{r.name}</strong>
                  <span>{r.summary}</span>
                </button>
              </li>
            ))}
          </ul>
          {selected && (
            <button
              type="button"
              className="rule-menu-clear"
              onClick={() => {
                onPick(null);
                setOpen(false);
              }}
            >
              ルールの表示を消す
            </button>
          )}
          <p className="provisional">※ 法令の内容は仮です（要確認）</p>
        </div>
      )}
    </div>
  );
}
