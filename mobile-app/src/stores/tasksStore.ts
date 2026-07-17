import { create } from 'zustand';
import { router } from 'expo-router';
import type { CreateTaskDto, UpdateTaskDto, CreateTagDto, UpdateTagDto, CreateActionDto, UpdateUserTaskStateDto, ActionDetailDto } from '../api/dto';
import {
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  getTasksUseCase,
  createActionUseCase,
  getRecentActionsUseCase,
  deleteActionUseCase,
  createTagUseCase,
  updateTagUseCase,
  deleteTagUseCase,
  getTagsByGroupUseCase,
  userTaskStateRepository,
} from '../core/di';
import { DataSuccess } from '../utils/DataResult';

export interface TaskData {
  id: number;
  label: string;
  frequenceEstimee: number;
  uniteFrequence: string;
  points: number;
  tag?: { id: number; label: string; color: string } | null;
  [key: string]: unknown;
}

export interface TagData {
  id: number;
  label: string;
  color: string;
  icon?: string;
}

interface TasksState {
  tasks: TaskData[];
  tags: TagData[];
  actions: ActionDetailDto[];
  selectedTagFilter: TagData | null;
  isLoading: boolean;
  loadingTaskIds: Set<number>;
  error: string | null;

  setTasks: (tasks: TaskData[]) => void;
  setTags: (tags: TagData[]) => void;

  fetchTasks: () => Promise<void>;
  createTask: (payload: CreateTaskDto) => Promise<boolean>;
  updateTask: (id: number, payload: UpdateTaskDto) => Promise<boolean>;
  deleteTask: (id: number) => Promise<boolean>;

  fetchTagsByGroup: (groupId: number) => Promise<void>;
  createTag: (payload: CreateTagDto) => Promise<boolean>;
  updateTag: (id: number, payload: UpdateTagDto) => Promise<boolean>;
  deleteTag: (id: number) => Promise<boolean>;

  fetchRecentActions: (groupId: number) => Promise<void>;
  createAction: (payload: CreateActionDto) => Promise<boolean>;
  deleteAction: (id: number) => Promise<boolean>;

  updateUserTaskState: (taskId: number, payload: UpdateUserTaskStateDto) => Promise<boolean>;

  setTagFilter: (tag: TagData | null) => void;
  onModifyTag: (tag: TagData, groupId: number) => void;
  filteredTasks: () => TaskData[];
  clearData: () => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  tags: [],
  actions: [],
  selectedTagFilter: null,
  isLoading: false,
  loadingTaskIds: new Set(),
  error: null,

  setTasks: (tasks) => set({ tasks }),
  setTags: (tags) => set({ tags }),

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    const result = await getTasksUseCase.execute();
    if (result.success) {
      const data = result.data as TaskData[] | { tasks: TaskData[] };
      const tasks = Array.isArray(data) ? data : (data as { tasks: TaskData[] }).tasks ?? [];
      set({ tasks, isLoading: false });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  createTask: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await createTaskUseCase.execute(payload);
    if (result.success) {
      const data = result.data as TaskData | { task: TaskData };
      const task = 'task' in (data as object) ? (data as { task: TaskData }).task : (data as TaskData);
      if (!task?.id) {
        set({ isLoading: false });
        return false;
      }
      set((state) => ({ tasks: [...state.tasks, task], isLoading: false }));
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  updateTask: async (id, payload) => {
    set({ isLoading: true, error: null });
    const result = await updateTaskUseCase.execute({ id, payload });
    if (result.success) {
      const data = result.data as TaskData | { task: TaskData };
      const task = 'task' in (data as object) ? (data as { task: TaskData }).task : (data as TaskData);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...task } : t)),
        isLoading: false,
      }));
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  deleteTask: async (id) => {
    const result = await deleteTaskUseCase.execute(id);
    if (result.success) {
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
      return true;
    }
    return false;
  },

  fetchTagsByGroup: async (groupId) => {
    const result = await getTagsByGroupUseCase.execute(groupId);
    if (result.success) {
      const data = result.data as TagData[] | { tags: TagData[] };
      const tags = Array.isArray(data) ? data : (data as { tags: TagData[] }).tags ?? [];
      set({ tags });
    }
  },

  createTag: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await createTagUseCase.execute(payload);
    if (result.success) {
      const data = result.data as TagData | { tag: TagData };
      const tag = 'tag' in (data as object) ? (data as { tag: TagData }).tag : (data as TagData);
      set((state) => ({ tags: [...state.tags, tag], isLoading: false }));
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  updateTag: async (id, payload) => {
    set({ isLoading: true, error: null });
    const result = await updateTagUseCase.execute({ id, payload });
    if (result.success) {
      const data = result.data as TagData | { tag: TagData };
      const tag = 'tag' in (data as object) ? (data as { tag: TagData }).tag : (data as TagData);
      set((state) => ({
        tags: state.tags.map((t) => (t.id === id ? { ...t, ...tag } : t)),
        isLoading: false,
      }));
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  deleteTag: async (id) => {
    const result = await deleteTagUseCase.execute(id);
    if (result.success) {
      set((state) => ({
        tags: state.tags.filter((t) => t.id !== id),
        selectedTagFilter: state.selectedTagFilter?.id === id ? null : state.selectedTagFilter,
      }));
      return true;
    }
    return false;
  },

  fetchRecentActions: async (groupId) => {
    const result = await getRecentActionsUseCase.execute(groupId);
    if (result.success) {
      set({ actions: result.data });
    }
  },

  createAction: async (payload) => {
    const taskId = payload.taskId;
    set((state) => ({
      loadingTaskIds: new Set([...state.loadingTaskIds, taskId]),
    }));
    const result = await createActionUseCase.execute(payload);
    set((state) => {
      const newSet = new Set(state.loadingTaskIds);
      newSet.delete(taskId);
      return { loadingTaskIds: newSet };
    });
    return result.success;
  },

  deleteAction: async (id) => {
    const result = await deleteActionUseCase.execute(id);
    if (result.success) {
      set((state) => ({ actions: state.actions.filter((a) => a.id !== id) }));
      return true;
    }
    return false;
  },

  updateUserTaskState: async (taskId, payload) => {
    const result = await userTaskStateRepository.update(taskId, payload);
    return result instanceof DataSuccess;
  },

  setTagFilter: (tag) => set({ selectedTagFilter: tag }),

  onModifyTag: (tag, groupId) => {
    set({ selectedTagFilter: tag });
    router.push(`/(app)/group/${groupId}/edit/tag`);
  },

  filteredTasks: () => {
    const { tasks, selectedTagFilter } = get();
    let filtered = tasks;
    if (selectedTagFilter) {
      filtered = filtered.filter((t) => t.tag?.id === selectedTagFilter.id);
    }
    return filtered;
  },

  clearData: () =>
    set({
      tasks: [],
      tags: [],
      actions: [],
      selectedTagFilter: null,
      isLoading: false,
      loadingTaskIds: new Set(),
      error: null,
    }),
}));
