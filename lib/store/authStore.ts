// lib/store/authStore.ts

import { create } from 'zustand';
import type { User } from '@/types/user';

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setUser: (u: User | null) => void;
  logout: () => void;
  setIsAuthReady: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isAuthReady: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),

  setIsAuthReady: v => set({ isAuthReady: v }),
}));

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.authStore = useAuthStore;
}
