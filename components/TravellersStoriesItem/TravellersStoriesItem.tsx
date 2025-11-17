import Image from "next/image";
import styles from "./TravellersStoriesItem.module.css";

export interface Story {
  _id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: number;
  img: string;
  avatar?: string;
}

interface Props {
  story: Story;
}

export default function TravellersStoriesItem({ story }: Props) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={story.img}
          alt={story.title}
          fill
          className={styles.image}
        />

        {/* 🟡 приклад накладеної іконки, якщо треба */}
        <div className={styles.iconOverlay}>
          <Image
            src="/icons/heart.svg"
            alt="like"
            width={28}
            height={28}
            className={styles.icon}
          />
        </div>
      </div>

      <span className={styles.category}>{story.category}</span>
      <h3 className={styles.title}>{story.title}</h3>
      <p className={styles.description}>{story.description}</p>

      <div className={styles.authorBox}>
        <Image
          src={story.avatar || "/images/avatar.png"}
          alt={story.author}
          width={32}
          height={32}
          className={styles.avatar}
        />
        <span>{story.author}</span>
        <span>{story.date}</span>
        <span>•</span>
        <span>{story.readTime} хв</span>
      </div>

      <div className={styles.footer}>
        <button className={styles.button}>Переглянути статтю</button>

        <Image
          src="/icons/bookmark.svg"
          alt="bookmark"
          width={24}
          height={24}
          className={styles.bookmark}
        />
      </div>
    </article>
  );
}