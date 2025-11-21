// hooks/useAuth.ts
'use client';

import { getMe } from '@/lib/api/clientApi';
import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export const useAuthBootstrap = () => {
  const setUser = useAuthStore(s => s.setUser);
  const setIsAuthReady = useAuthStore(s => s.setIsAuthReady);
  const logoutStore = useAuthStore(s => s.logout);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const user = await getMe(); // getMe сам вернёт null без 401
        if (!ignore) setUser(user);
      } catch {
        if (!ignore) logoutStore();
      } finally {
        if (!ignore) setIsAuthReady(true);
      }
    }

    loadUser();
    return () => {
      ignore = true;
    };
  }, [setUser, setIsAuthReady, logoutStore]);
};
