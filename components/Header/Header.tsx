// components/Header/Header.tsx

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import cn from "classnames";
import styles from './Header.module.css';
import Image from 'next/image';
import BurgerMenuImg from "../../public/icons/burgermenu.svg"
import CloseButtonImg from "../../public/icons/closebutton.svg"
import AvatarIcon from "../../public/icons/avatar.svg";
import LogoutIcon from "../../public/icons/logout.svg";

interface IProp {
  type?: "primary" | "secondary";
}

export default function Header({ type = "primary" }: IProp) {
  const [isAuth, setIsAuth] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // Блокировка прокрутки при открытом меню
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
  }, [menuOpen]);

  return (
    <header className={cn(styles.header, type === "secondary" && styles.secondary)}>
      <div className={cn(styles.container, "container")}>
        {/* Логотип */}
        <Link href="/" className={styles.logo}>
          <Image src="/icons/companylogo.svg" alt="Logo" width={23} height={23} />
          Подорожники
        </Link>

        {/* Навигация */}
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
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
                    <AvatarIcon width={32} height={32} className={styles.avatarIcon} />
                    <span>Імʼя</span>
                    <LogoutIcon 
                      width={18} 
                      height={19}
                      className={cn(type === "primary" ? styles.menuPrimary : styles.menuSecondary)} 
                      onClick={(e: { stopPropagation: () => void; }) => {
                        e.stopPropagation(); // блокирует клик по всей кнопке
                        alert("Confirm logout"); //логика выхода
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
        </nav>

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
        <button
          className={`${styles.burger} ${menuOpen ? styles.active : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {menuOpen ? (
            <CloseButtonImg 
              className={cn(type === "primary" ? styles.menuPrimary : styles.menuSecondary)} 
            />
          ) : ( 
            <BurgerMenuImg 
              className={cn(type === "primary" ? styles.menuPrimary : styles.menuSecondary)} 
            />
          )}
        </button>
      </div>

      {menuOpen && <div onClick={closeMenu}></div>}
    </header>
  );
}