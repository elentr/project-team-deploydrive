"use client";

import { useState, useEffect, useCallback } from "react";
import Loader from "../Loader/Loader";
import TravellersStories from "../TravellersStories/TravellersStories";
import styles from "./Popular.module.css";
import type { Story, ApiStory } from "@/types/story";
import { mapStory } from "@/types/story";

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
      
      let rawStories: ApiStory[] = [];
      
      if (data.stories && Array.isArray(data.stories)) {
        rawStories = data.stories;
      } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
        rawStories = data.data.data;
      } else if (data.data && Array.isArray(data.data)) {
        rawStories = data.data;
      } else if (Array.isArray(data)) {
        rawStories = data;
      }

      const incoming: Story[] = rawStories.map(mapStory);

      if (page === 1) {
        setStories(incoming);
        setHasMore(incoming.length >= LIMIT);
      } else {
        setStories((prev) => [...prev, ...incoming]);
        if (incoming.length < LIMIT) {
          setHasMore(false);
        }
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
        <TravellersStories
          stories={[]}
          showFilters={false}
          title="Популярні історії"
          isAuthenticated={isAuthenticated}
          hasMore={false}
          loading={false}
        />
        <p className={styles.emptyState}>
          Додайте NEXT_PUBLIC_API_URL до файлу .env.local, щоб відобразити
          історії.
        </p>
      </section>
    );
  }

  if (isInitialLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.loaderWrapper}>
          <Loader size={80} label="Завантажуємо історії..." />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <TravellersStories
        stories={stories}
        showFilters={false}
        title="Популярні історії"
        isAuthenticated={isAuthenticated}
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        loading={loading}
      />
      {loading && stories.length > 0 && (
        <div className={styles.loaderBottom}>
          <Loader size={40} label="Завантажуємо ще..." />
        </div>
      )}
    </section>
  );
}
