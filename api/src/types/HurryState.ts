export enum HurryState {
  NOPE = 'nope',    // 0-1 action en retard
  MAYBE = 'maybe',  // 2 actions en retard  
  YES = 'yes'       // 3+ actions en retard
}

export interface TaskWithHurry {
  id: number;
  label: string;
  iconUrl?: string;
  frequenceEstimee: number;
  uniteFrequence: string;
  points: number;
  hurryState: HurryState;
  expectedActionsAtDate: number;
  actualActionsThisMonth: number;
  actionsLate: number;
}