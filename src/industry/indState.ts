import type { DispatchTo, FlowType, Method } from './graph';
import type { PanelState } from './IndustryPanel';

export interface IndState {
  method: Method;
  flow: FlowType;
  dispatchTo: DispatchTo;
  building: boolean;
  panel: PanelState;
}

export const IND_DEFAULT: IndState = { method: 'lump', flow: 'none', dispatchTo: 'mech', building: false, panel: { type: 'intro' } };
