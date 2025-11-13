"use client";

import { useState } from "react";
import Link from "next/link";
import cn from "classnames";
import styles from "./Join.module.css";

export default function Join() {
  // Тимчасовий стан авторизації (заміни реальним)
  const [isAuth] = useState(false);

  return (
    <section className={cn(styles.section, "container")} id="join">
      <div className={styles.wrapper}>
        {/* Фонова картинка з затемненням */}
        <div className={styles.imageWrapper}>
          <div className={styles.overlay}></div>

          {/* Контент поверх */}
          <div className={styles.content}>
            <h2 className={styles.title}>Приєднуйтесь до нашої спільноти</h2>
            <p className={styles.text}>
              Долучайтеся до мандрівників, які діляться своїми історіями та
              надихають на нові пригоди.
            </p>

            {isAuth ? (
              <Link href="/profile" className={styles.button}>
                Збережені
              </Link>
            ) : (
              <Link href="/auth/register" className={styles.button}>
                Зареєструватися
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

