import { HurryState } from '../types/hurry-state.type';
import { FrequencyUnit } from '../../tasks/entities/task.entity';

/**
 * Convertit une fréquence en nombre d'actions nécessaires par mois
 */
export function frequencyToMonthly(
  frequenceEstimee: number,
  uniteFrequence: FrequencyUnit | string,
): number {
  if (!frequenceEstimee || !uniteFrequence) return 0;

  switch (uniteFrequence) {
    case FrequencyUnit.JOUR:
    case 'jour':
      return frequenceEstimee * 30;
    case FrequencyUnit.SEMAINE:
    case 'semaine':
      return frequenceEstimee * 4.33;
    case FrequencyUnit.MOIS:
    case 'mois':
      return frequenceEstimee;
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

  const lastDay = new Date(year, month + 1, 0);

  const dayOfMonth = currentDate.getDate();
  const totalDaysInMonth = lastDay.getDate();

  return dayOfMonth / totalDaysInMonth;
}

/**
 * Calcule le nombre d'actions attendues à la date actuelle
 */
export function getExpectedActionsAtDate(
  frequenceEstimee: number,
  uniteFrequence: FrequencyUnit | string,
  currentDate: Date = new Date(),
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
  actualActions: number,
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
  uniteFrequence: FrequencyUnit | string,
  actualActionsThisMonth: number,
  currentDate: Date = new Date(),
): {
  hurryState: HurryState;
  expectedActionsAtDate: number;
  actualActionsThisMonth: number;
  actionsLate: number;
} {
  const expectedActionsAtDate = getExpectedActionsAtDate(
    frequenceEstimee,
    uniteFrequence,
    currentDate,
  );

  const { hurryState, actionsLate } = calculateHurryState(
    expectedActionsAtDate,
    actualActionsThisMonth,
  );

  return {
    hurryState,
    expectedActionsAtDate,
    actualActionsThisMonth,
    actionsLate,
  };
}
