import { 
  frequencyToMonthly, 
  getMonthProgressRatio, 
  getExpectedActionsAtDate,
  calculateHurryState,
  calculateTaskHurryState 
} from '../helpers/hurryCalculation';
import { FrequencyUnit } from '../entities/Task';
import { HurryState } from '../types/HurryState';

describe('Hot Actions Calculation', () => {
  describe('frequencyToMonthly', () => {
    it('should convert daily frequency correctly', () => {
      expect(frequencyToMonthly(1, FrequencyUnit.JOUR)).toBe(30);
      expect(frequencyToMonthly(2, FrequencyUnit.JOUR)).toBe(60);
    });

    it('should convert weekly frequency correctly', () => {
      expect(frequencyToMonthly(1, FrequencyUnit.SEMAINE)).toBeCloseTo(4.33, 2);
      expect(frequencyToMonthly(2, FrequencyUnit.SEMAINE)).toBeCloseTo(8.66, 2);
    });

    it('should handle monthly frequency', () => {
      expect(frequencyToMonthly(1, FrequencyUnit.MOIS)).toBe(1);
      expect(frequencyToMonthly(3, FrequencyUnit.MOIS)).toBe(3);
    });
  });

  describe('getMonthProgressRatio', () => {
    it('should calculate correct ratio for beginning of month', () => {
      const firstDay = new Date(2024, 0, 1); // 1er janvier 2024
      const ratio = getMonthProgressRatio(firstDay);
      expect(ratio).toBeCloseTo(1/31, 2); // ~0.032
    });

    it('should calculate correct ratio for middle of month', () => {
      const midMonth = new Date(2024, 0, 15); // 15 janvier 2024
      const ratio = getMonthProgressRatio(midMonth);
      expect(ratio).toBeCloseTo(15/31, 2); // ~0.484
    });

    it('should calculate correct ratio for end of month', () => {
      const lastDay = new Date(2024, 0, 31); // 31 janvier 2024
      const ratio = getMonthProgressRatio(lastDay);
      expect(ratio).toBe(1); // 100%
    });
  });

  describe('getExpectedActionsAtDate', () => {
    it('should calculate expected actions correctly for daily tasks', () => {
      const date = new Date(2024, 0, 15); // 15 janvier 2024 (mi-mois)
      const expected = getExpectedActionsAtDate(1, FrequencyUnit.JOUR, date);
      
      // 1 action/jour * 30 jours/mois * (15/31) = ~14.5 => 14 actions attendues
      expect(expected).toBe(14);
    });

    it('should calculate expected actions correctly for weekly tasks', () => {
      const date = new Date(2024, 0, 15); // 15 janvier 2024 (mi-mois)
      const expected = getExpectedActionsAtDate(1, FrequencyUnit.SEMAINE, date);
      
      // 1 action/semaine * 4.33 semaines/mois * (15/31) = ~2.09 => 2 actions attendues
      expect(expected).toBe(2);
    });
  });

  describe('calculateHurryState', () => {
    it('should return NOPE when on track or slightly behind', () => {
      expect(calculateHurryState(10, 10)).toEqual({
        hurryState: HurryState.NOPE,
        actionsLate: 0
      });

      expect(calculateHurryState(10, 9)).toEqual({
        hurryState: HurryState.NOPE,
        actionsLate: 1
      });
    });

    it('should return MAYBE when 2 actions behind', () => {
      expect(calculateHurryState(10, 8)).toEqual({
        hurryState: HurryState.MAYBE,
        actionsLate: 2
      });
    });

    it('should return YES when 3+ actions behind', () => {
      expect(calculateHurryState(10, 7)).toEqual({
        hurryState: HurryState.YES,
        actionsLate: 3
      });

      expect(calculateHurryState(10, 5)).toEqual({
        hurryState: HurryState.YES,
        actionsLate: 5
      });
    });

    it('should handle cases where user is ahead', () => {
      expect(calculateHurryState(5, 10)).toEqual({
        hurryState: HurryState.NOPE,
        actionsLate: 0
      });
    });
  });

  describe('calculateTaskHurryState (integration)', () => {
    it('should calculate complete hurry state correctly', () => {
      const date = new Date(2024, 0, 15); // 15 janvier 2024
      
      const result = calculateTaskHurryState(
        1, // taskId
        1, // 1 action par jour
        FrequencyUnit.JOUR,
        10, // 10 actions réalisées ce mois
        date
      );

      expect(result.expectedActionsAtDate).toBe(14); // ~14 actions attendues
      expect(result.actualActionsThisMonth).toBe(10);
      expect(result.actionsLate).toBe(4);
      expect(result.hurryState).toBe(HurryState.YES);
    });

    it('should handle weekly tasks correctly', () => {
      const date = new Date(2024, 0, 28); // 28 janvier 2024 (fin de mois)
      
      const result = calculateTaskHurryState(
        2, // taskId
        1, // 1 action par semaine
        FrequencyUnit.SEMAINE,
        4, // 4 actions réalisées ce mois
        date
      );

      expect(result.expectedActionsAtDate).toBe(3); // ~3.9 => 3 actions attendues
      expect(result.actualActionsThisMonth).toBe(4);
      expect(result.actionsLate).toBe(0); // En avance
      expect(result.hurryState).toBe(HurryState.NOPE);
    });
  });
});