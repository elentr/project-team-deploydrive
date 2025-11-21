'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { getCurrentUser } from '@/lib/api/clientApi';

interface Props {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore(s => s.setUser);
  const logout = useAuthStore(s => s.logout);
  const setIsAuthReady = useAuthStore(s => s.setIsAuthReady);

  useEffect(() => {
    let ignore = false;

    async function loadUser() {
      try {
        const user = await getCurrentUser();

        if (!ignore && user) {
          setUser(user);
        }
      } catch (err) {
        // Ошибка → выходим из аккаунта
        if (!ignore) {
          logout();
        }
      } finally {
        // Очень ВАЖНО — ставим флажок, чтобы UI мог рендериться
        if (!ignore) {
          setIsAuthReady(true);
        }
      }
    }

    loadUser();

    return () => {
      ignore = true;
    };
  }, [setUser, logout, setIsAuthReady]);

  return <>{children}</>;
};

export default AuthProvider;
