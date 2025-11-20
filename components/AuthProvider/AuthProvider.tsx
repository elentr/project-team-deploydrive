// components/AuthProvider/AuthProvider.tsx

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);
  const setIsAuthReady = useAuthStore(s => s.setIsAuthReady);
  const isAuthReady = useAuthStore(s => s.isAuthReady);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const user = await getCurrentUser();
        if (!ignore) setUser(user);
      } catch {
        if (!ignore) logout();
      } finally {
        if (!ignore) setIsAuthReady(true);
      }
    }

    loadUser();
    return () => {
      ignore = true;
    };
  }, [setUser, logout, setIsAuthReady]);

  if (!isAuthReady) return null;

  return <>{children}</>;
}
