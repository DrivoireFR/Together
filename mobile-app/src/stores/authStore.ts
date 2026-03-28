import { create } from 'zustand';
import { router } from 'expo-router';
import { authRepository } from '../repositories/authRepository';
import { StorageUtil } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import { DataSuccess } from '../utils/DataResult';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  initializeAuth: () => Promise<void>;
  login: (payload: LoginPayload) => Promise<boolean>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<boolean>;
  resendConfirmation: (email: string) => Promise<boolean>;
  changePassword: (payload: ChangePasswordPayload) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await StorageUtil.getItem<string>(STORAGE_KEYS.TOKEN);
      const userJson = await StorageUtil.getItem<User>(STORAGE_KEYS.USER);

      if (token && userJson) {
        set({ token, user: userJson, isAuthenticated: true });
        const result = await authRepository.getProfile();
        if (result instanceof DataSuccess) {
          const user = result.data.user;
          set({ user });
          await StorageUtil.setItem(STORAGE_KEYS.USER, user);
        }
      }
    } catch {
      await StorageUtil.removeItem(STORAGE_KEYS.TOKEN);
      await StorageUtil.removeItem(STORAGE_KEYS.USER);
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (payload: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authRepository.login(payload);
      if (result instanceof DataSuccess) {
        const { token, user } = result.data;
        await StorageUtil.setItem(STORAGE_KEYS.TOKEN, token);
        await StorageUtil.setItem(STORAGE_KEYS.USER, user);
        set({ token, user, isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur de connexion', isLoading: false });
      return false;
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authRepository.register(payload);
      if (result instanceof DataSuccess) {
        set({ isLoading: false });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: "Erreur lors de l'inscription", isLoading: false });
      return false;
    }
  },

  logout: async () => {
    await StorageUtil.removeItem(STORAGE_KEYS.TOKEN);
    await StorageUtil.removeItem(STORAGE_KEYS.USER);
    set({ user: null, token: null, isAuthenticated: false, error: null });
    router.replace('/(auth)/login');
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authRepository.updateProfile(payload);
      if (result instanceof DataSuccess) {
        const user = result.data.user;
        await StorageUtil.setItem(STORAGE_KEYS.USER, user);
        set({ user, isLoading: false });
        return true;
      }
      set({ error: result.message, isLoading: false });
      return false;
    } catch {
      set({ error: 'Erreur de mise à jour du profil', isLoading: false });
      return false;
    }
  },

  resendConfirmation: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authRepository.resendConfirmation(email);
      set({ isLoading: false });
      return result instanceof DataSuccess;
    } catch {
      set({ error: "Erreur lors de l'envoi", isLoading: false });
      return false;
    }
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authRepository.changePassword(payload);
      set({ isLoading: false });
      if (result instanceof DataSuccess) return true;
      set({ error: result.message });
      return false;
    } catch {
      set({ error: 'Erreur de changement de mot de passe', isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
