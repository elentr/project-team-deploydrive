"use client";

import css from "./Footer.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Footer() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/auth/register');
    }
  };

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        {/* Main Row - Logo, Social, Navigation */}
        <div className={css.mainRow}>
          {/* Logo - Left */}
          <Link href="/" className={css.logo}>
            <svg width="23" height="23">
              <use href="/icons/icons.svg#icon-logo_plant" />
            </svg>
            <span>Подорожники</span>
          </Link>
          
          {/* Social Media - Center */}
          <ul className={css.social}>
            <li>
              <a 
                href="https://www.facebook.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={css.socialLink}
              >
                <svg width="23" height="23">
                  <use href="/icons/icons.svg#icon-facebook" />
                </svg>
              </a>
            </li>
            <li>
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={css.socialLink}
              >
                <svg width="23" height="23">
                  <use href="/icons/icons.svg#icon-instagram" />
                </svg>
              </a>
            </li>
            <li>
              <a 
                href="https://x.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className={css.socialLink}
              >
                <svg width="23" height="23">
                  <use href="/icons/icons.svg#icon-x" />
                </svg>
              </a>
            </li>
            <li>
              <a 
                href="https://www.youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                className={css.socialLink}
              >
                <svg width="23" height="23">
                  <use href="/icons/icons.svg#icon-youtube" />
                </svg>
              </a>
            </li>
          </ul>

          {/* Navigation - Right */}
          <nav className={css.nav}>
            <ul className={css.navList}>
              <li>
                <Link 
                  href="/" 
                  className={css.link}
                  onClick={(e) => handleNavClick(e, '/')}
                >
                  Головна
                </Link>
              </li>
              <li>
                <Link 
                  href="/stories" 
                  className={css.link}
                  onClick={(e) => handleNavClick(e, '/stories')}
                >
                  Історії
                </Link>
              </li>
              <li>
                <Link 
                  href="/travellers" 
                  className={css.link}
                  onClick={(e) => handleNavClick(e, '/travellers')}
                >
                  Мандрівники
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright - Bottom Row */}
        <div className={css.copyright}>
          <p>© 2025 Подорожники. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}