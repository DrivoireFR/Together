import { create } from 'zustand';
import { router } from 'expo-router';
import { taskRepository } from '../repositories/taskRepository';
import { DataSuccess } from '../utils/DataResult';
import type {
  Task,
  Tag,
  Action,
  UserTaskState,
  CreateTaskPayload,
  UpdateTaskPayload,
  CreateTagPayload,
  UpdateTagPayload,
  CreateActionPayload,
  CreateActionForMemberPayload,
  UpdateUserTaskStatePayload,
  ActionAcknowledgment,
} from '../types';
import { HurryState } from '../types';

interface TasksState {
  tasks: Task[];
  tags: Tag[];
  actions: Action[];
  selectedTagFilter: Tag | null;
  showUrgentOnly: boolean;
  isLoading: boolean;
  loadingTaskIds: Set<number>;
  error: string | null;

  // Acknowledgment
  pendingAcknowledgments: ActionAcknowledgment[];
  tasksToAcknowledge: Task[];
  showTaskAcknowledgmentModal: boolean;
  showActionAcknowledgmentModal: boolean;

  // Data setters
  setTasks: (tasks: Task[]) => void;
  setTags: (tags: Tag[]) => void;

  // CRUD Tasks
  createTask: (payload: CreateTaskPayload) => Promise<boolean>;
  updateTask: (id: number, payload: UpdateTaskPayload) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;

  // CRUD Tags
  createTag: (payload: CreateTagPayload) => Promise<boolean>;
  updateTag: (id: number, payload: UpdateTagPayload) => Promise<boolean>;
  deleteTag: (id: number) => Promise<boolean>;

  // Actions
  fetchRecentActionsByGroupId: (groupId: number) => Promise<void>;
  createActionForTask: (payload: CreateActionPayload) => Promise<boolean>;
  createActionForMember: (payload: CreateActionForMemberPayload) => Promise<boolean>;
  deleteAction: (id: number) => Promise<boolean>;

  // User task states
  updateUserTaskState: (
    taskId: number,
    payload: UpdateUserTaskStatePayload,
  ) => Promise<boolean>;
  fetchUserTaskStates: (groupId: number) => Promise<void>;

  // Acknowledgment
  fetchPendingActionAcknowledgment: () => Promise<void>;
  acceptActionAcknowledgment: (ackId: number) => Promise<boolean>;
  rejectActionAcknowledgment: (ackId: number) => Promise<boolean>;

  // Filters
  setTagFilter: (tag: Tag | null) => void;
  toggleUrgentFilter: () => void;

  // Navigation helpers
  onModifyTag: (tag: Tag, groupId: number) => void;

  // Computed
  filteredTasks: () => Task[];

  clearData: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  tags: [],
  actions: [],
  selectedTagFilter: null,
  showUrgentOnly: false,
  isLoading: false,
  loadingTaskIds: new Set(),
  error: null,
  pendingAcknowledgments: [],
  tasksToAcknowledge: [],
  showTaskAcknowledgmentModal: false,
  showActionAcknowledgmentModal: false,

  setTasks: (tasks: Task[]) => set({ tasks }),
  setTags: (tags: Tag[]) => set({ tags }),

  createTask: async (payload: CreateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await taskRepository.createTask(payload);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tasks: [...state.tasks, result.data.task],
          isLoading: false,
        }));
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur lors de la création de la tâche', isLoading: false });
      return false;
    }
  },

  updateTask: async (id: number, payload: UpdateTaskPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await taskRepository.updateTask(id, payload);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...result.data.task } : t,
          ),
          isLoading: false,
        }));
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur lors de la mise à jour', isLoading: false });
      return false;
    }
  },

  deleteTask: async (id: number) => {
    try {
      const result = await taskRepository.deleteTask(id);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  createTag: async (payload: CreateTagPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await taskRepository.createTag(payload);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tags: [...state.tags, result.data.tag],
          isLoading: false,
        }));
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur lors de la création de la catégorie', isLoading: false });
      return false;
    }
  },

  updateTag: async (id: number, payload: UpdateTagPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await taskRepository.updateTag(id, payload);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tags: state.tags.map((t) =>
            t.id === id ? { ...t, ...result.data.tag } : t,
          ),
          isLoading: false,
        }));
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur lors de la mise à jour de la catégorie', isLoading: false });
      return false;
    }
  },

  deleteTag: async (id: number) => {
    try {
      const result = await taskRepository.deleteTag(id);
      if (result instanceof DataSuccess) {
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
          selectedTagFilter:
            state.selectedTagFilter?.id === id ? null : state.selectedTagFilter,
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  fetchRecentActionsByGroupId: async (groupId: number) => {
    try {
      const result = await taskRepository.getRecentActionsByGroupId(groupId);
      if (result instanceof DataSuccess) {
        set({ actions: result.data.actions });
      }
    } catch {
      // silent
    }
  },

  createActionForTask: async (payload: CreateActionPayload) => {
    const taskId = payload.taskId;
    set((state) => ({
      loadingTaskIds: new Set([...state.loadingTaskIds, taskId]),
    }));
    try {
      const result = await taskRepository.createAction(payload);
      set((state) => {
        const newSet = new Set(state.loadingTaskIds);
        newSet.delete(taskId);
        return { loadingTaskIds: newSet };
      });
      return result instanceof DataSuccess;
    } catch {
      set((state) => {
        const newSet = new Set(state.loadingTaskIds);
        newSet.delete(taskId);
        return { loadingTaskIds: newSet };
      });
      return false;
    }
  },

  createActionForMember: async (payload: CreateActionForMemberPayload) => {
    try {
      const result = await taskRepository.createActionForMember(payload);
      return result instanceof DataSuccess;
    } catch {
      return false;
    }
  },

  deleteAction: async (id: number) => {
    try {
      const result = await taskRepository.deleteAction(id);
      if (result instanceof DataSuccess) {
        set((state) => ({
          actions: state.actions.filter((a) => a.id !== id),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  updateUserTaskState: async (
    taskId: number,
    payload: UpdateUserTaskStatePayload,
  ) => {
    try {
      const result = await taskRepository.updateUserTaskState(taskId, payload);
      return result instanceof DataSuccess;
    } catch {
      return false;
    }
  },

  fetchUserTaskStates: async (groupId: number) => {
    try {
      await taskRepository.getUserTaskStates(groupId);
    } catch {
      // silent
    }
  },

  fetchPendingActionAcknowledgment: async () => {
    try {
      const result = await taskRepository.getPendingActionAcknowledgment();
      if (result instanceof DataSuccess) {
        const acks = result.data.acknowledgments;
        set({
          pendingAcknowledgments: acks,
          showActionAcknowledgmentModal: acks.length > 0,
        });
      }
    } catch {
      // silent
    }
  },

  acceptActionAcknowledgment: async (ackId: number) => {
    try {
      const result = await taskRepository.acceptActionAcknowledgment(ackId);
      if (result instanceof DataSuccess) {
        set((state) => ({
          pendingAcknowledgments: state.pendingAcknowledgments.filter(
            (a) => a.id !== ackId,
          ),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  rejectActionAcknowledgment: async (ackId: number) => {
    try {
      const result = await taskRepository.rejectActionAcknowledgment(ackId);
      if (result instanceof DataSuccess) {
        set((state) => ({
          pendingAcknowledgments: state.pendingAcknowledgments.filter(
            (a) => a.id !== ackId,
          ),
        }));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  setTagFilter: (tag: Tag | null) => set({ selectedTagFilter: tag }),

  toggleUrgentFilter: () =>
    set((state) => ({ showUrgentOnly: !state.showUrgentOnly })),

  onModifyTag: (tag: Tag, groupId: number) => {
    set({ selectedTagFilter: tag });
    router.push(`/(app)/group/${groupId}/edit/tag`);
  },

  filteredTasks: () => {
    const { tasks, selectedTagFilter, showUrgentOnly } = get();
    let filtered = tasks;

    if (selectedTagFilter) {
      filtered = filtered.filter((t) => t.tag?.id === selectedTagFilter.id);
    }

    if (showUrgentOnly) {
      filtered = filtered.filter(
        (t) => t.hurryState === HurryState.YES || t.hurryState === HurryState.MAYBE,
      );
    }

    return filtered.sort((a, b) => {
      const hurryOrder = { [HurryState.YES]: 0, [HurryState.MAYBE]: 1, [HurryState.NO]: 2 };
      const aOrder = hurryOrder[a.hurryState || HurryState.NO] ?? 2;
      const bOrder = hurryOrder[b.hurryState || HurryState.NO] ?? 2;
      return aOrder - bOrder;
    });
  },

  clearData: () =>
    set({
      tasks: [],
      tags: [],
      actions: [],
      selectedTagFilter: null,
      showUrgentOnly: false,
      isLoading: false,
      loadingTaskIds: new Set(),
      error: null,
      pendingAcknowledgments: [],
      tasksToAcknowledge: [],
      showTaskAcknowledgmentModal: false,
      showActionAcknowledgmentModal: false,
    }),
}));
