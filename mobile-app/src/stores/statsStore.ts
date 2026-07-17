import { create } from 'zustand';
import { getOverviewUseCase } from '../core/di';

interface StatsState {
  isLoading: boolean;
  error: string | null;
  overview: Record<string, unknown> | null;

  fetchOverview: (groupId: number) => Promise<void>;
  clearStats: () => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  isLoading: false,
  error: null,
  overview: null,

  fetchOverview: async (groupId) => {
    set({ isLoading: true, error: null });
    const result = await getOverviewUseCase.execute(groupId);
    if (result.success) {
      set({ overview: result.data as Record<string, unknown>, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  clearStats: () => set({ overview: null, isLoading: false, error: null }),
}));
