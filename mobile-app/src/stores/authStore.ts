import { create } from 'zustand';
import { router } from 'expo-router';
import type { UserResponseDto, RegisterDto, RequestOtpDto, VerifyOtpDto, UpdateUserDto } from '../api/dto';
import {
  registerUseCase,
  requestOtpUseCase,
  verifyOtpUseCase,
  getProfileUseCase,
  updateProfileUseCase,
  initializeAuthUseCase,
  logoutUseCase,
} from '../core/di';

interface AuthState {
  user: UserResponseDto | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  initializeAuth: () => Promise<void>;
  register: (payload: RegisterDto) => Promise<boolean>;
  requestOtp: (payload: RequestOtpDto) => Promise<boolean>;
  verifyOtp: (payload: VerifyOtpDto) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateUserDto) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  initializeAuth: async () => {
    set({ isLoading: true });
    const result = await initializeAuthUseCase.execute();
    if (result.success) {
      set({
        user: result.data.user,
        token: result.data.token,
        isAuthenticated: result.data.isAuthenticated,
        isLoading: false,
      });
    } else {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await registerUseCase.execute(payload);
    if (result.success) {
      set({ isLoading: false });
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  requestOtp: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await requestOtpUseCase.execute(payload);
    if (result.success) {
      set({ isLoading: false });
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  verifyOtp: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await verifyOtpUseCase.execute(payload);
    if (result.success) {
      set({
        token: result.data.token,
        user: result.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  logout: async () => {
    await logoutUseCase.execute();
    set({ user: null, token: null, isAuthenticated: false, error: null });
    router.replace('/(auth)/login');
  },

  updateProfile: async (payload) => {
    set({ isLoading: true, error: null });
    const result = await updateProfileUseCase.execute(payload);
    if (result.success) {
      set({ user: result.data, isLoading: false });
      return true;
    }
    set({ error: result.error, isLoading: false });
    return false;
  },

  clearError: () => set({ error: null }),
}));
