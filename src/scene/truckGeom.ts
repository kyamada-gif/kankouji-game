export type TruckKind = 'dump' | 'mixer' | 'unic' | 'trailer' | 'flat' | 'small';
export type Cargo =
  | 'soil'
  | 'concrete'
  | 'panels'
  | 'excavator'
  | 'hbeam'
  | 'rebar'
  | 'formwork'
  | 'sleeves'
  | 'chiller'
  | 'pipes'
  | 'board'
  | 'fixtures'
  | 'scrap'
  | 'furniture'
  | 'temp-pipes';

export const TRUCK_LEN: Record<TruckKind, number> = { dump: 190, mixer: 190, unic: 180, trailer: 300, flat: 190, small: 150 };
