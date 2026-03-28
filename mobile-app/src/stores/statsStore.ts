import { create } from 'zustand';
import { statsRepository } from '../repositories/statsRepository';
import { DataSuccess } from '../utils/DataResult';
import type { Overview, PersonalGoal, User } from '../types';

interface StatsState {
  isLoading: boolean;
  error: string | null;
  overview: Overview | null;

  fetchOverview: (groupId: number) => Promise<void>;
  clearStats: () => void;

  // Computed helpers
  totalMonthlyPoints: () => number;
  completionPercentage: () => number;
  personalGoals: () => PersonalGoal[];
}

export const useStatsStore = create<StatsState>((set, get) => ({
  isLoading: false,
  error: null,
  overview: null,

  fetchOverview: async (groupId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await statsRepository.getOverview(groupId);
      if (result instanceof DataSuccess) {
        set({ overview: result.data.overview, isLoading: false });
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch {
      set({ error: 'Erreur lors du chargement des statistiques', isLoading: false });
    }
  },

  clearStats: () => set({ overview: null, isLoading: false, error: null }),

  totalMonthlyPoints: () => {
    const { overview } = get();
    if (!overview) return 0;
    return overview.tasks.reduce((total, task) => {
      const freq = task.frequenceEstimee || 1;
      return total + task.points * freq;
    }, 0);
  },

  completionPercentage: () => {
    const { overview } = get();
    if (!overview || overview.totalTasksVolume === 0) return 0;
    return Math.round((overview.totalDone / overview.totalTasksVolume) * 100);
  },

  personalGoals: () => {
    const { overview } = get();
    if (!overview) return [];
    return overview.users.map((user) => ({
      user: user as User,
      doneThisMonth: user.actions?.length ?? 0,
    }));
  },
}));
