import Link from "next/link";
import styles from "./AuthProfileEditProvider.module.css";

interface AuthProfileEditProviderProps {
  children: React.ReactNode;
}

const AuthProfileEditProvider = ({
  children,
}: AuthProfileEditProviderProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.providercontainer}>
        <header className={styles.logowrapper}>
          <Link className={styles.link} href={"/"}>
            <svg className={styles.logo} width="23" height="23">
              <use href="/icons.svg#icon-logo_plant"></use>
            </svg>
            <p className={styles.text}>Подорожники</p>
          </Link>
        </header>

        <main className={styles.content}>{children}</main>

        <footer className={styles.textwrapper}>© 2025 Подорожники</footer>
      </div>
    </div>
  );
};

export default AuthProfileEditProvider;
