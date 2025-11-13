"use client";

import { useState, useEffect, useCallback } from "react";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import styles from "./Popular.module.css";

export interface Story {
  _id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: number;
  img: string;
  avatar?: string; // ✅ додали
}

const LIMIT = 3;

export default function Popular() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchStories = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/stories/popular?page=${page}&limit=${LIMIT}`
      );

      const data = await res.json();
      const incoming: Story[] = data.stories;

      setStories((prev) => [...prev, ...incoming]);

      if (incoming.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Помилка завантаження:", error);
    }
  }, [page]);

  useEffect(() => {
    let isMounted = true;

    Promise.resolve().then(() => {
      if (isMounted) fetchStories();
    });

    return () => {
      isMounted = false;
    };
  }, [fetchStories]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Популярні історії</h2>

      <div className={styles.list}>
        {stories.map((story) => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </div>

      {hasMore && (
        <button className={styles.button} onClick={handleLoadMore}>
          Переглянути всі
        </button>
      )}
    </section>
  );
}
