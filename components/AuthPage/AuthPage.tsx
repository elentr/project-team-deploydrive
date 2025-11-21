'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import styles from './AuthPage.module.css';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

export default function AuthPage({ type }: { type: 'login' | 'register' }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isAuthReady = useAuthStore(s => s.isAuthReady);

  useEffect(() => {
    if (!isAuthReady) return;
    if (isAuthenticated) router.replace('/');
  }, [isAuthenticated, isAuthReady, router]);

  if (!isAuthReady) return null;

  return (
    <section>
      <div className="container">
        <div className={styles.authWrapper}>
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

          {type === 'login' ? <LoginForm /> : <RegistrationForm />}
        </div>
      </div>
    </section>
  );
}
