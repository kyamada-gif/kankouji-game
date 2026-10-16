export type StageId = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Mode = 'A' | 'B' | 'C';

export interface Stage {
  id: StageId;
  name: string;
  summary: string;
  /** 差し替え用の背景画像（public/ からのパス）。未指定なら SVG で描く。 */
  image?: string;
}

export interface Hotspot {
  x: number;
  y: number;
  r: number;
}

export interface Hazard extends Hotspot {
  id: string;
  stage: StageId;
  title: string;
  /** 1. 何が危ないか */
  danger: string;
  /** 2. 正しい状態 */
  correct: string;
  /** 3-1. 今すぐ止めるべき場面か */
  urgent: boolean;
  /** 3-2. 本人への声かけ例 */
  callout: string;
  /** 4. この場面での「誰に言うか」の手がかり */
  whoClue: string;
  /** 法令・数値など専門家確認が必要な点 */
  provisional?: string;
}

/** 拡大図の引き出し線。actor+at で人物の部位、x/y で場所を指す */
export interface Mark {
  actor?: string;
  at?: import('./scene/workerGeom').Anchor;
  x?: number;
  y?: number;
  text: string;
}
