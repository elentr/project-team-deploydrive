// components/Header/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import cn from "classnames";
import styles from './Header.module.css';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import Icon from '../Icon/Icon';

interface User {
  name: string;
  avatarUrl?: string | null;
}

export default function Header () {
  const pathname = usePathname();
  const type = pathname === "/" ? "secondary" : "primary";

  const cleanPath = pathname.split("?")[0];
  const authPage = ["/auth/login", "/auth/register"].includes(cleanPath);

    // временная авторизация
    const [isAuth, setIsAuth] = useState(false);
    const [user] = useState<User>({
      name: "Імʼя",
      avatarUrl: null,
    });
    
  const [menuOpen, setMenuOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Блокировка прокрутки при открытом меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <header className={cn(
      styles.header, 
      type === "secondary" ? styles.secondary : styles.primary,
      menuOpen && styles.primary, menuOpen && styles.open
      )}>
      <div className={cn(styles.container, "container")}>
        {/* Логотип */}
        <Link href="/" className={styles.logo}>
          <Icon name="icon-logo_plant"  width={23} height={23} />
          Подорожники
        </Link>

        {/* Навигация */}
        {!authPage && <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
          <ul className={styles.list}>
            <li className={styles.navItem}>
              <Link href="/" onClick={closeMenu}>Головна</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/stories" onClick={closeMenu}>Історії</Link>
            </li>
            <li className={styles.navItem}>
              <Link href="/travelers" onClick={closeMenu}>Мандрівники</Link>
            </li>

            {isAuth ? (
              <>
                <li className={styles.navItem}>
                  <Link href="/profile" onClick={closeMenu}>Мій профіль</Link>
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
                      src={user.avatarUrl || "/icons/avatar.svg"} 
                      alt="Avatar"
                      width={32} 
                      height={32} 
                      className={styles.avatarIcon} 
                    />
                    <span>{user.name}</span>
                    <Icon 
                      name="icon-logout"
                      width={18} 
                      height={19}
                      className={cn(
                        menuOpen
                          ? styles.menuPrimary
                          : type === "primary"
                          ? styles.menuPrimary 
                          : styles.menuSecondary 
                        
                      )} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfirm(true); 
                      }}
                    />
                  </button>
                </li>
              </>
            ) : (
              <li className={styles.authBtns}>
                <Link className={styles.btn_2} href="/auth/login" onClick={closeMenu}>
                  Вхід
                </Link>
                <Link className={styles.btn_1} href="/auth/register" onClick={closeMenu}>
                  Реєстрація
                </Link>
              </li>
            )}
          </ul>
        </nav> }
        

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
        {!authPage && <button
          className={`${styles.burger} ${menuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? (
            <Icon 
              name="icon-close"
              width={24}
              height={24}
              className={cn(
                type === "primary" 
                ? styles.menuPrimary 
                : menuOpen ? styles.menuPrimary
                : styles.menuSecondary
              )} 
            />
          ) : ( 
            <Icon
              name="icon-menu"
              width={24}
              height={24}
              className={cn(
                type === "primary" 
                ? styles.menuPrimary 
                : styles.menuSecondary
              )} 
            />
          )}
        </button>}
      </div>

      {menuOpen && <div onClick={closeMenu}></div>}

       {/* Confirm logout */}
       {showConfirm && (
        <ConfirmModal
          title="Ви точно хочете вийти?"
          message="Ми будемо сумувати за вами!"
          confirmButtonText="Вийти"
          cancelButtonText="Відмінити"
          onConfirm={() => setShowConfirm(false)}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </header>
  );
}