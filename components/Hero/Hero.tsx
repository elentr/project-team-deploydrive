import styles from "./Hero.module.css";
import cn from "classnames";

export default function Hero() {
  return (
    <section className={styles.hero}>
        <div className={cn(styles.container, "container")}>
        <div className={styles.overlay}></div>

        <div className={styles.content}>
          <h1 className={styles.title}>Відкрийте світ подорожей з нами!</h1>
          <p className={styles.text}>Приєднуйтесь до нашої спільноти мандрівників, де ви зможете ділитися своїми історіями та отримувати натхнення для нових пригод.
            Відкрийте для себе нові місця та знайдіть однодумців!</p>
          <a href="#join" className={styles.button}>Доєднатись</a>
        </div>
      </div>
    </section>
  );
}
