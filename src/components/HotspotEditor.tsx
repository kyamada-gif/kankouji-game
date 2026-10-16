import { useState } from 'react';
import type { Hazard, Hotspot } from '../types';

interface Props {
  hazards: Hazard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onChange: (id: string, patch: Partial<Hotspot>) => void;
  onClear: () => void;
}

/** 画像差し替え後に危険の位置を合わせる開発用パネル */
export function HotspotEditor({ hazards, selectedId, onSelect, onChange, onClear }: Props) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(
    Object.fromEntries(hazards.map((h) => [h.id, { x: h.x, y: h.y, r: h.r }])),
    null,
    2,
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <aside className="panel editor">
      <p className="eyebrow">開発用</p>
      <h2>位置編集</h2>
      <p className="howto">円をドラッグして動かします。半径は下で調整。変更はこのブラウザに保存されます。確定したら JSON を src/data/hazards.ts に反映してください。</p>
      <ul className="editor-list">
        {hazards.map((h) => (
          <li key={h.id} className={h.id === selectedId ? 'is-selected' : undefined}>
            <button type="button" onClick={() => onSelect(h.id)}>
              {h.id}
            </button>
            <span>
              x {h.x} / y {h.y}
            </span>
            <label>
              r
              <input type="range" min={12} max={120} value={h.r} onChange={(e) => onChange(h.id, { r: Number(e.target.value) })} />
              {h.r}
            </label>
          </li>
        ))}
      </ul>
      <textarea readOnly value={json} rows={10} />
      <div className="panel-actions">
        <button type="button" onClick={copy}>
          {copied ? 'コピーしました' : 'JSONをコピー'}
        </button>
        <button type="button" onClick={onClear}>
          編集を破棄
        </button>
      </div>
    </aside>
  );
}
