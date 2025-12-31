import { FrequencyUnit } from '../../tasks/entities/task.entity';

export function frequencyToMonthly(
  frequenceEstimee: number,
  uniteFrequence: FrequencyUnit | string,
): number {
  if (!frequenceEstimee || !uniteFrequence) return 0;
  switch (uniteFrequence) {
    case 'jour':
    case FrequencyUnit.JOUR:
      return frequenceEstimee * 30;
    case 'semaine':
    case FrequencyUnit.SEMAINE:
      return frequenceEstimee * 4;
    case 'mois':
    case FrequencyUnit.MOIS:
      return frequenceEstimee;
    default:
      return 0;
  }
}
