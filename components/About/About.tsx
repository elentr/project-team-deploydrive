'use client';

import styles from './About.module.css';
import cn from "classnames";
import Icon from '../Icon/Icon';

export default function AboutSection() {
  return (
    <section className={cn(styles.section, "container")}>
        <div className={styles.content}>
            {/* Текстовый блок */}
            <div className={styles.textBlock}>
                <h2 className={styles.title}>
                    Проєкт, створений для тих, хто живе подорожами
                </h2>
                <p className={styles.text}>
                    Ми віримо, що кожна подорож — це унікальна історія, варта того, щоб нею поділилися.
                    Наша платформа створена, щоб об&#39;єднати людей, закоханих у відкриття нового.
                    Тут ви можете ділитися власним досвідом, знаходити друзів
                    та надихатися на наступні пригоди разом з нами.
                </p>
            </div>
            <div className={styles.cards}>
                <div className={styles.card}>
                    <Icon
                        name="icon-wand_stars"
                        width={48}
                        height={48}
                    />
                    <h3 className={styles.cardTitle}>Наша місія</h3>
                    <p className={styles.cardText}>
                        Об&#39;єднувати людей через любов до пригод та надихати на нові відкриття.
                    </p>
                </div>

                <div className={styles.card}>
                    <Icon
                        name="icon-travel_bag"
                 
                        width={48}
                        height={48}
                    />
                    <h3 className={styles.cardTitle}>Автентичні історії</h3>
                    <p className={styles.cardText}>
                        Ми цінуємо справжні, нередаговані враження від мандрівників із усього світу.
                    </p>
                </div>

                <div className={styles.card}>
                    <Icon
                        name="icon-communication"
                 
                        width={48}
                        height={48}
                    />
                    <h3 className={styles.cardTitle}>Ваша спільнота</h3>
                    <p className={styles.cardText}>
                        Станьте частиною спільноти, де кожен може бути i автором, i читачем.
                    </p>
                </div>
            </div>
        </div>
    </section>
  );
}