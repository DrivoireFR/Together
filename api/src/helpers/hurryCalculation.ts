import { HurryState } from '../types/HurryState';
import { FrequencyUnit } from '../entities/Task';

/**
 * Convertit une fréquence en nombre d'actions nécessaires par mois
 */
export function frequencyToMonthly(frequenceEstimee: number, uniteFrequence: FrequencyUnit): number {
  if (!frequenceEstimee || !uniteFrequence) return 0;
  
  switch (uniteFrequence) {
    case FrequencyUnit.JOUR:
      return frequenceEstimee * 30; // 30 jours dans un mois
    case FrequencyUnit.SEMAINE:
      return frequenceEstimee * 4.33; // ~4.33 semaines dans un mois (plus précis)
    case FrequencyUnit.MOIS:
      return frequenceEstimee; // déjà mensuel
    default:
      return 0;
  }
}

/**
 * Calcule le ratio d'avancement dans le mois (0.0 à 1.0)
 */
export function getMonthProgressRatio(currentDate: Date = new Date()): number {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Premier jour du mois
  const firstDay = new Date(year, month, 1);
  
  // Dernier jour du mois
  const lastDay = new Date(year, month + 1, 0);
  
  // Ratio d'avancement
  const dayOfMonth = currentDate.getDate();
  const totalDaysInMonth = lastDay.getDate();
  
  return dayOfMonth / totalDaysInMonth;
}

/**
 * Calcule le nombre d'actions attendues à la date actuelle
 */
export function getExpectedActionsAtDate(
  frequenceEstimee: number,
  uniteFrequence: FrequencyUnit,
  currentDate: Date = new Date()
): number {
  const monthlyFrequency = frequencyToMonthly(frequenceEstimee, uniteFrequence);
  const progressRatio = getMonthProgressRatio(currentDate);
  
  return Math.floor(monthlyFrequency * progressRatio);
}

/**
 * Détermine le HurryState basé sur le retard
 */
export function calculateHurryState(
  expectedActions: number,
  actualActions: number
): { hurryState: HurryState; actionsLate: number } {
  const actionsLate = Math.max(0, expectedActions - actualActions);
  
  let hurryState: HurryState;
  if (actionsLate <= 1) {
    hurryState = HurryState.NOPE;
  } else if (actionsLate === 2) {
    hurryState = HurryState.MAYBE;
  } else {
    hurryState = HurryState.YES;
  }
  
  return { hurryState, actionsLate };
}

/**
 * Calcule le HurryState complet pour une tâche
 */
export function calculateTaskHurryState(
  taskId: number,
  frequenceEstimee: number,
  uniteFrequence: FrequencyUnit,
  actualActionsThisMonth: number,
  currentDate: Date = new Date()
): {
  hurryState: HurryState;
  expectedActionsAtDate: number;
  actualActionsThisMonth: number;
  actionsLate: number;
} {
  const expectedActionsAtDate = getExpectedActionsAtDate(
    frequenceEstimee,
    uniteFrequence,
    currentDate
  );
  
  const { hurryState, actionsLate } = calculateHurryState(
    expectedActionsAtDate,
    actualActionsThisMonth
  );
  
  return {
    hurryState,
    expectedActionsAtDate,
    actualActionsThisMonth,
    actionsLate
  };
}