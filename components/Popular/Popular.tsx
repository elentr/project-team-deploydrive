"use client";

import { useState, useEffect, useCallback } from "react";
import Loader from "../Loader/Loader";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import styles from "./Popular.module.css";
import type { Story } from "@/types/story";

const LIMIT = 3;

export default function Popular() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchStories = useCallback(async () => {
    if (!API) return;

    setLoading(true);

    try {
      const res = await fetch(
        `${API}/api/stories/popular?page=${page}&limit=${LIMIT}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалося завантажити популярні історії");
      }

      const data = await res.json();
      const incoming: Story[] = data.stories ?? [];

      setStories((prev) => [...prev, ...incoming]);

      if (incoming.length < LIMIT) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setLoading(false);
    }
  }, [API, page]);

  useEffect(() => {
    if (!API) return;

    let ignore = false;
    const controller = new AbortController();

    fetch(`${API}/api/users/current`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => {
        if (!ignore) {
          setIsAuthenticated(res.ok);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [API]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleLoadMore = () => {
    if (loading) return;
    setPage((prev) => prev + 1);
  };
  const isInitialLoading = loading && stories.length === 0;

  if (!API) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <div>
            <p className={styles.overline}>Travellers</p>
            <h2 className={styles.title}>Популярні історії</h2>
            <p className={styles.subtitle}>
              Надихніться подорожами інших та поділіться своєю історією.
            </p>
          </div>
        </div>

        <p className={styles.emptyState}>
          Додайте NEXT_PUBLIC_API_URL до файлу .env.local, щоб відобразити
          історії.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div>
          <p className={styles.overline}>Travellers</p>
          <h2 className={styles.title}>Популярні історії</h2>
          <p className={styles.subtitle}>
            Надихніться подорожами інших та поділіться своєю історією.
          </p>
        </div>
      </div>

      {isInitialLoading && (
        <div className={styles.loaderWrapper}>
          <Loader size={80} label="Завантажуємо історії..." />
        </div>
      )}

      {!isInitialLoading && (
        <>
          <div className={styles.list}>
            {stories.map((story) => (
              <TravellersStoriesItem
                key={story._id}
                story={story}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>

          {stories.length === 0 && (
            <p className={styles.emptyState}>
              Наразі немає популярних історій. Спробуйте пізніше.
            </p>
          )}
        </>
      )}

      {hasMore && !loading && stories.length > 0 && (
        <button className={styles.button} onClick={handleLoadMore}>
          Переглянути всі
        </button>
      )}

      {loading && stories.length > 0 && (
        <div className={styles.loaderBottom}>
          <Loader size={40} label="Завантажуємо ще..." />
        </div>
      )}
    </section>
  );
}
