import { create } from 'zustand';
import { router } from 'expo-router';
import type { CreateGroupDto, JoinGroupDto, AddTagsDto, AddTasksDto } from '../api/dto';
import { useAuthStore } from './authStore';
import {
  createGroupUseCase,
  getGroupUseCase,
  searchGroupsUseCase,
  joinGroupUseCase,
  leaveGroupUseCase,
  updateGroupUseCase,
  addTagsToGroupUseCase,
  addTasksToGroupUseCase,
} from '../core/di';
import { unwrapGroupFromResponse } from '../utils/groupResponse';
import { useTasksStore, type TagData, type TaskData } from './tasksStore';

function syncGroupToTasksStore(group: GroupData): void {
  const { setTasks, setTags } = useTasksStore.getState();
  setTasks(Array.isArray(group.tasks) ? (group.tasks as TaskData[]) : []);
  if (Array.isArray(group.tags)) {
    setTags(group.tags as TagData[]);
  }
}

export interface GroupData {
  id: number;
  nom: string;
  code: string;
  users?: { id: number; pseudo: string; avatar?: string | null }[];
  tasks?: unknown[];
  [key: string]: unknown;
}

interface GroupState {
  groups: GroupData[];
  currentGroup: GroupData | null;
  searchResults: GroupData[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  createdGroupId: number | null;
  showGroupCreatedModal: boolean;
  showStarterPackTagsModal: boolean;
  showStarterPackTasksModal: boolean;

  fetchGroupById: (id: number) => Promise<void>;
  refreshGroupById: (id: number) => Promise<void>;
  createGroup: (payload: CreateGroupDto) => Promise<boolean>;
  searchGroupsByName: (nom: string) => Promise<void>;
  joinGroup: (groupId: number, payload: JoinGroupDto) => Promise<boolean>;
  leaveGroup: (groupId: number) => Promise<boolean>;
  updateGroup: (id: number, payload: Partial<CreateGroupDto>) => Promise<boolean>;
  navigateToGroup: (groupId: number) => void;
  clearSearchResults: () => void;

  startStarterPackSetup: () => void;
  skipGroupSetup: () => void;
  afterTagsCreated: () => void;
  finishGroupSetup: () => void;
  closeModals: () => void;
  createBulkTags: (groupId: number, payload: AddTagsDto) => Promise<unknown[]>;
  createBulkTasks: (groupId: number, payload: AddTasksDto) => Promise<unknown[]>;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  createdGroupId: null,
  showGroupCreatedModal: false,
  showStarterPackTagsModal: false,
  showStarterPackTasksModal: false,

  fetchGroupById: async (id) => {
    set({ isLoading: true, error: null });
    const result = await getGroupUseCase.execute(id);
    if (result.success) {
      const group = unwrapGroupFromResponse(result.data);
      set({ currentGroup: group, isLoading: false });
      syncGroupToTasksStore(group);
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  refreshGroupById: async (id) => {
    const result = await getGroupUseCase.execute(id);
    if (result.success) {
      const group = unwrapGroupFromResponse(result.data);
      set({ currentGroup: group });
      syncGroupToTasksStore(group);
    }
  },

  createGroup: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await createGroupUseCase.execute(payload);
    if (result.success) {
      const group = unwrapGroupFromResponse(result.data);
      set({
        createdGroupId: group.id,
        showGroupCreatedModal: true,
        isLoading: false,
      });
      await useAuthStore.getState().initializeAuth();
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  searchGroupsByName: async (nom) => {
    if (!nom.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    const result = await searchGroupsUseCase.execute(nom);
    if (result.success) {
      const data = result.data as GroupData[] | { groups: GroupData[] };
      const groups = Array.isArray(data) ? data : (data as { groups: GroupData[] }).groups ?? [];
      set({ searchResults: groups, isSearching: false });
    } else {
      set({ isSearching: false });
    }
  },

  joinGroup: async (groupId, payload) => {
    set({ isLoading: true, error: null });
    const result = await joinGroupUseCase.execute({ groupId, payload });
    if (result.success) {
      set({ isLoading: false });
      await useAuthStore.getState().initializeAuth();
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  leaveGroup: async (groupId) => {
    set({ isLoading: true, error: null });
    const result = await leaveGroupUseCase.execute(groupId);
    if (result.success) {
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== groupId),
        isLoading: false,
      }));
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  updateGroup: async (id, payload) => {
    set({ isLoading: true, error: null });
    const result = await updateGroupUseCase.execute({ id, payload });
    if (result.success) {
      set({ isLoading: false });
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  navigateToGroup: (groupId) => {
    router.push(`/(app)/group/${groupId}/(tabs)`);
  },

  clearSearchResults: () => set({ searchResults: [] }),

  startStarterPackSetup: () =>
    set({ showGroupCreatedModal: false, showStarterPackTagsModal: true }),

  skipGroupSetup: () => {
    const { createdGroupId } = get();
    set({
      showGroupCreatedModal: false,
      showStarterPackTagsModal: false,
      showStarterPackTasksModal: false,
    });
    if (createdGroupId) {
      router.push(`/(app)/group/${createdGroupId}/(tabs)`);
    }
  },

  afterTagsCreated: () =>
    set({ showStarterPackTagsModal: false, showStarterPackTasksModal: true }),

  finishGroupSetup: () => {
    const { createdGroupId } = get();
    set({ showStarterPackTasksModal: false });
    if (createdGroupId) {
      router.push(`/(app)/group/${createdGroupId}/(tabs)`);
    }
  },

  closeModals: () =>
    set({
      showGroupCreatedModal: false,
      showStarterPackTagsModal: false,
      showStarterPackTasksModal: false,
    }),

  createBulkTags: async (groupId, payload) => {
    const result = await addTagsToGroupUseCase.execute({ groupId, payload });
    if (result.success) {
      const data = result.data as { tags?: unknown[] };
      return data.tags ?? [];
    }
    return [];
  },

  createBulkTasks: async (groupId, payload) => {
    const result = await addTasksToGroupUseCase.execute({ groupId, payload });
    if (result.success) {
      const data = result.data as { tasks?: unknown[] };
      return data.tasks ?? [];
    }
    return [];
  },

  reset: () =>
    set({
      groups: [],
      currentGroup: null,
      searchResults: [],
      isLoading: false,
      isSearching: false,
      error: null,
      showGroupCreatedModal: false,
      showStarterPackTagsModal: false,
      showStarterPackTasksModal: false,
      createdGroupId: null,
    }),
}));
