import { create } from 'zustand';
import { router } from 'expo-router';
import { groupRepository } from '../repositories/groupRepository';
import { DataSuccess } from '../utils/DataResult';
import type {
  Group,
  CreateGroupPayload,
  JoinGroupPayload,
  CreateBulkTagsPayload,
  CreateBulkTasksPayload,
  StarterPack,
  Tag,
  Task,
} from '../types';

interface GroupState {
  groups: Group[];
  currentGroup: Group | null;
  searchResults: Group[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;

  // Starter pack flow
  showGroupCreatedModal: boolean;
  showStarterPackTagsModal: boolean;
  showStarterPackTasksModal: boolean;
  createdGroupData: { group: Group; starterPack: StarterPack } | null;
  createdGroupId: number | null;

  // Actions
  fetchGroupById: (id: number) => Promise<void>;
  createGroup: (payload: CreateGroupPayload) => Promise<boolean>;
  getUserGroups: (userId: number) => Promise<void>;
  searchGroupsByName: (nom: string) => Promise<void>;
  joinGroup: (payload: JoinGroupPayload) => Promise<boolean>;
  leaveGroup: (groupId: number) => Promise<boolean>;
  updateGroup: (id: number, payload: Partial<CreateGroupPayload>) => Promise<boolean>;
  navigateToGroup: (groupId: number) => void;
  clearSearchResults: () => void;

  // Starter pack flow
  startStarterPackSetup: () => void;
  skipGroupSetup: () => void;
  afterTagsCreated: () => void;
  finishGroupSetup: () => void;
  closeModals: () => void;
  createBulkTags: (
    groupId: number,
    payload: CreateBulkTagsPayload,
  ) => Promise<Tag[]>;
  createBulkTasks: (
    groupId: number,
    payload: CreateBulkTasksPayload,
  ) => Promise<Task[]>;
  reset: () => void;
}

export const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  searchResults: [],
  isLoading: false,
  isSearching: false,
  error: null,
  showGroupCreatedModal: false,
  showStarterPackTagsModal: false,
  showStarterPackTasksModal: false,
  createdGroupData: null,
  createdGroupId: null,

  fetchGroupById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.getGroupById(id);
      if (result instanceof DataSuccess) {
        set({ currentGroup: result.data.group, isLoading: false });
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch {
      set({ error: 'Erreur lors du chargement du groupe', isLoading: false });
    }
  },

  createGroup: async (payload: CreateGroupPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.createGroup(payload);
      if (result instanceof DataSuccess) {
        const { group, starterPack } = result.data;
        set({
          createdGroupData: { group, starterPack },
          createdGroupId: group.id,
          showGroupCreatedModal: true,
          isLoading: false,
        });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur lors de la création du groupe', isLoading: false });
      return false;
    }
  },

  getUserGroups: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.getUserGroups(userId);
      if (result instanceof DataSuccess) {
        set({ groups: result.data.groups, isLoading: false });
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch {
      set({ error: 'Erreur lors du chargement des groupes', isLoading: false });
    }
  },

  searchGroupsByName: async (nom: string) => {
    if (!nom.trim()) {
      set({ searchResults: [] });
      return;
    }
    set({ isSearching: true });
    try {
      const result = await groupRepository.searchGroupsByName(nom);
      if (result instanceof DataSuccess) {
        set({ searchResults: result.data.groups, isSearching: false });
      } else {
        set({ isSearching: false });
      }
    } catch {
      set({ isSearching: false });
    }
  },

  joinGroup: async (payload: JoinGroupPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.joinGroup(payload);
      if (result instanceof DataSuccess) {
        set({ isLoading: false });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur pour rejoindre le groupe', isLoading: false });
      return false;
    }
  },

  leaveGroup: async (groupId: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.leaveGroup(groupId);
      if (result instanceof DataSuccess) {
        set((state) => ({
          groups: state.groups.filter((g) => g.id !== groupId),
          isLoading: false,
        }));
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur pour quitter le groupe', isLoading: false });
      return false;
    }
  },

  updateGroup: async (id: number, payload: Partial<CreateGroupPayload>) => {
    set({ isLoading: true, error: null });
    try {
      const result = await groupRepository.updateGroup(id, payload);
      if (result instanceof DataSuccess) {
        set({ isLoading: false });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur de mise à jour du groupe', isLoading: false });
      return false;
    }
  },

  navigateToGroup: (groupId: number) => {
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
      createdGroupData: null,
    });
    if (createdGroupId) {
      router.push(`/(app)/group/${createdGroupId}/(tabs)`);
    }
  },

  afterTagsCreated: () =>
    set({ showStarterPackTagsModal: false, showStarterPackTasksModal: true }),

  finishGroupSetup: () => {
    const { createdGroupId } = get();
    set({
      showStarterPackTasksModal: false,
      createdGroupData: null,
    });
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

  createBulkTags: async (groupId: number, payload: CreateBulkTagsPayload) => {
    try {
      const result = await groupRepository.createBulkTags(groupId, payload);
      if (result instanceof DataSuccess) return result.data.tags;
      return [];
    } catch {
      return [];
    }
  },

  createBulkTasks: async (groupId: number, payload: CreateBulkTasksPayload) => {
    try {
      const result = await groupRepository.createBulkTasks(groupId, payload);
      if (result instanceof DataSuccess) return result.data.tasks;
      return [];
    } catch {
      return [];
    }
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
      createdGroupData: null,
      createdGroupId: null,
    }),
}));
