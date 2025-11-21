'use client';

import { useAuthStore } from '@/lib/store/authStore';

export const useAuthStoreHook = () => {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isAuthReady = useAuthStore(s => s.isAuthReady);

  return { user, isAuthenticated, isAuthReady };
};
