import type { Tool } from './Worker';

export const TOOL_NAMES: Record<Tool, string> = {
  none: '',
  grinder: 'グラインダー',
  clipboard: 'バインダー（書類）',
  tablet: 'タブレット（図面）',
  baton: '誘導灯',
  drill: '電動ドリル',
  shovel: 'スコップ',
  torch: '溶接トーチ',
  hammer: '金づち',
  stakes: '丁張りの杭',
  board: '板材（ボード・合板）',
  staff: '標尺',
  roller: 'ローラー',
  pipe: 'パイプ',
  saw: '丸ノコ（電ノコ）',
  hacker: 'ハッカー（結束用）',
  ratchet: 'ラチェットレンチ',
  wrench: 'パイプレンチ',
  impact: 'インパクトドライバー',
  trowel: 'コテ',
  flashlight: '懐中電灯',
  pliers: 'ペンチ',
  headWrench: 'ヘッドレンチ',
  laptop: 'ノートPC',
  sealant: 'シーリングガン',
  wrap: '保温材',
  duct: 'ダクト',
};

export const BELT_NAMES = { pouch: '腰袋', holster: '工具差し', wire: '結束線のリール' } as const;
