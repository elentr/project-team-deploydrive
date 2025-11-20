"use client";

import Image from "next/image";
import styles from "./StoryDetails.module.css";
import { Story } from "@/types/story";
import { useState } from "react";

export default function StoryDetails({ story }: { story: Story }) {
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/stories/${story._id}`, {
        method: "PATCH",
      });

      if (res.ok) setSaved(true);
    } catch (e) {
      console.error("Помилка збереження:", e);
    }
  };

  return (
    <article className={styles.wrapper}>
      <div className={styles.meta}>
        <span>Автор статті: {story.author}</span>
        <span>Опубліковано: {story.date}</span>
      </div>

      <div className={styles.imageBox}>
        <Image
          src={story.img}
          alt={story.title}
          width={900}
          height={600}
          className={styles.image}
        />
      </div>

      <p className={styles.text}>{story.description}</p>

      <div className={styles.saveBox}>
        <h3>Збережіть собі історію</h3>
        <p>Вона буде доступна у вашому профілі у розділі збережене.</p>

        <button className={styles.saveBtn} onClick={handleSave}>
          {saved ? "Збережено ✓" : "Зберегти"}
        </button>
      </div>
    </article>
  );
}
