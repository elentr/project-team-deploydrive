// components/Header/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import cn from 'classnames';
import styles from './Header.module.css';
import { usePathname, useRouter } from 'next/navigation';

import Icon from '../Icon/Icon';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

import { useAuthStore } from '@/lib/store/authStore';
import { logout as logoutApi } from '@/lib/api/clientApi';
import toast from 'react-hot-toast';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const type = pathname === '/' ? 'secondary' : 'primary';

  const cleanPath = pathname.split('?')[0];
  const authPage = ['/auth/login', '/auth/register'].includes(cleanPath);

  const isAuth = useAuthStore(s => s.isAuthenticated);
  const user = useAuthStore(s => s.user);
  const logoutStore = useAuthStore(s => s.logout);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      toast.error;
      ('Помилка при виході. Але сесію завершено.');
    } finally {
      localStorage.removeItem('accessToken');
      logoutStore();
      setShowConfirm(false);
      closeMenu();
      router.replace('/');
    }
  };

  return (
    <header
      className={cn(
        styles.header,
        type === 'secondary' ? styles.secondary : styles.primary,
        menuOpen && styles.primary,
        menuOpen && styles.open
      )}
    >
      <div className={cn(styles.container, 'container')}>
        {/* Логотип */}
        <Link href="/" className={styles.logo}>
          <Icon name="icon-logo_plant" width={23} height={23} />
          Подорожники
        </Link>

        {/* Навигация */}
        {!authPage && (
          <nav className={cn(styles.nav, menuOpen && styles.open)}>
            <ul className={styles.list}>
              <li className={styles.navItem}>
                <Link href="/" onClick={closeMenu}>
                  Головна
                </Link>
              </li>

              <li className={styles.navItem}>
                <Link href="/stories" onClick={closeMenu}>
                  Історії
                </Link>
              </li>

              <li className={styles.navItem}>
                <Link href="/travellers" onClick={closeMenu}>
                  Мандрівники
                </Link>
              </li>

              {isAuth ? (
                <>
                  <li className={styles.navItem}>
                    <Link href="/profile" onClick={closeMenu}>
                      Мій профіль
                    </Link>
                  </li>

                  <li className={styles.authUser}>
                    {/* Кнопка "Опубликовать историю" */}
                    <Link
                      className={cn(styles.btn_1, styles.historyBtn)}
                      href="/stories/create"
                      onClick={closeMenu}
                    >
                      Опублікувати історію
                    </Link>

                    {/* Кнопка пользователя с logout */}
                    <button className={styles.logoutBtn}>
                      <Image
                        src={user?.avatarUrl || '/images/headeravatar.webp'}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className={styles.avatarIcon}
                      />
                      <span>{user?.name || 'Ім’я'} </span>
                      <Icon
                        name="icon-logout"
                        width={18}
                        height={19}
                        className={cn(
                          menuOpen
                            ? styles.menuPrimary
                            : type === 'primary'
                              ? styles.menuPrimary
                              : styles.menuSecondary
                        )}
                        onClick={e => {
                          e.stopPropagation();
                          setShowConfirm(true);
                        }}
                      />
                    </button>
                  </li>
                </>
              ) : (
                <li className={styles.authBtns}>
                  <Link
                    className={styles.btn_2}
                    href="/auth/login"
                    onClick={closeMenu}
                  >
                    Вхід
                  </Link>
                  <Link
                    className={styles.btn_1}
                    href="/auth/register"
                    onClick={closeMenu}
                  >
                    Реєстрація
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        )}

        {/* Кнопка "Опубликовать историю" для tablet */}
        {isAuth && (
          <Link
            className={cn(styles.btn_1, styles.historyBtnTablet)}
            href="/stories/create"
            onClick={closeMenu}
          >
            Опублікувати історію
          </Link>
        )}
        {/* Бургер-меню */}
        {!authPage && (
          <button
            className={`${styles.burger} ${menuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Menu"
          >
            {menuOpen ? (
              <Icon
                name="icon-close"
                width={24}
                height={24}
                className={cn(
                  type === 'primary'
                    ? styles.menuPrimary
                    : menuOpen
                      ? styles.menuPrimary
                      : styles.menuSecondary
                )}
              />
            ) : (
              <Icon
                name="icon-menu"
                width={24}
                height={24}
                className={cn(
                  type === 'primary' ? styles.menuPrimary : styles.menuSecondary
                )}
              />
            )}
          </button>
        )}
      </div>

      {menuOpen && <div onClick={closeMenu}></div>}

      {/* Confirm logout */}
      {showConfirm && (
        <ConfirmModal
          title="Ви точно хочете вийти?"
          message="Ми будемо сумувати за вами!"
          confirmButtonText="Вийти"
          cancelButtonText="Відмінити"
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </header>
  );
}
