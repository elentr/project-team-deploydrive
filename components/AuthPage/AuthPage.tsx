// components/AuthPage/AuthPage.tsx

import styles from './AuthPage.module.css';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// динамические client-компоненты
const LoginForm = dynamic(() => import('./LoginForm'));
const RegistrationForm = dynamic(() => import('./RegistrationForm'));

export default function AuthPage({ type }: { type: 'login' | 'register' }) {
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
