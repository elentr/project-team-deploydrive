import { User } from "@/types/user";
import { create } from "zustand";

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,

  setUser: (user: User) => {
    set(() => ({
      user,
      isAuthenticated: true,
      isLoading: false,
    }));
  },

  clearUser: () => {
    set(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }));
  },

  setLoading: (loading: boolean) => {
    set(() => ({ isLoading: loading }));
  },
}));
