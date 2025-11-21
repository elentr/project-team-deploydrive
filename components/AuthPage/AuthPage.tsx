// components/AuthPage/AuthPage.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { checkSession } from '@/lib/api/clientApi';
import Link from 'next/link';
import styles from './AuthPage.module.css';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

export default function AuthPage({ type }: { type: 'login' | 'register' }) {
  const router = useRouter();

  // Перевірка, чи вже залогінений
  const { data: isAuthenticated, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: checkSession,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isAuthenticated === true) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  if (isLoading) return null;

  return (
    <section>
      <div className="container">
        <div className={styles.authWrapper}>
          {/* Табы */}
          <div className={styles.tabsWrapper}>
            <Link
              href="/auth/register"
              className={`${styles.tab} ${type === 'register' ? styles.active : ''}`}
            >
              Реєстрація
            </Link>
            <Link
              href="/auth/login"
              className={`${styles.tab} ${type === 'login' ? styles.active : ''}`}
            >
              Вхід
            </Link>
          </div>

          {/* Заголовки */}
          {type === 'login' ? (
            <>
              <h2 className={styles.authTitle}>Вхід</h2>
              <p className={styles.authSubtitle}>Ласкаво просимо назад!</p>
            </>
          ) : (
            <>
              <h2 className={styles.authTitle}>Реєстрація</h2>
              <p className={styles.authSubtitle}>
                Раді вас бачити у спільноті мандрівників!
              </p>
            </>
          )}

          {/* Форма */}
          {type === 'login' ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>
    </section>
  );
}
