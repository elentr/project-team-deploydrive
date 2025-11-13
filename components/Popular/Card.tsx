import Image from "next/image";
import styles from "./Card.module.css";

interface CardProps {
  id: number;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  img: string;
}

export default function Card({
  category,
  title,
  description,
  author,
  date,
  readTime,
  img,
}: CardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={img}
          alt={title}
          width={400}
          height={260}
          className={styles.image}
        />
      </div>

      <div className={styles.box}>
        <span className={styles.category}>{category}</span>

        <h3 className={styles.title}>{title}</h3>

        <p className={styles.text}>{description}</p>

        <div className={styles.authorBox}>
          <Image
            src="/images/avatar.png"
            alt={author}
            width={32}
            height={32}
            className={styles.avatar}
          />
          <span className={styles.author}>{author}</span>
          <span className={styles.date}>{date}</span>
          <span>•</span>
          <span>{readTime} хв</span>
        </div>

        <button className={styles.button}>Переглянути статтю</button>
      </div>
    </article>
  );
}
