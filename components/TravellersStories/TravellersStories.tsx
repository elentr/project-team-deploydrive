"use client";

import { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./TravellersStories.module.css";
import TravellersStoriesItem, {
  Story,
} from "../TravellersStoriesItem/TravellersStoriesItem";
import Loader from "../Loader/Loader";

/**
 * Визначаємо розмір порції карток за шириною екрана:
 * - mobile (<768px)   → 9
 * - tablet (768–1439) → 8
 * - desktop (≥1440px) → 9
 */
function getPageSizeByWidth(width: number): number {
  if (width >= 1440) return 9;
  if (width >= 768) return 8;
  return 9;
}

export default function TravellersStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Визначаємо pageSize тільки на клієнті
  useEffect(() => {
    if (typeof window === "undefined") return;
    const width = window.innerWidth;
    const size = getPageSizeByWidth(width);
    setPageSize(size);
  }, []);

  // Початкове завантаження першої сторінки
  useEffect(() => {
    if (pageSize === null) return;
    void fetchStories(1, pageSize, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  /**
   * Функція запиту до бекенду
   */
  const fetchStories = async (
    targetPage: number,
    limit: number,
    replace: boolean
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

      const res = await fetch(
        `${baseUrl}/api/stories?page=${targetPage}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Не вдалося завантажити історії");
      }

      const data = await res.json();

      // Підлаштовуємося під можливі формати відповіді:
      // { stories: [...] } або { data: [...] }
      const incoming: Story[] = Array.isArray(data.stories)
        ? data.stories
        : Array.isArray(data.data)
        ? data.data
        : [];

      if (!Array.isArray(incoming)) {
        throw new Error("Невірний формат даних від сервера");
      }

      setStories(prev =>
        replace ? incoming : [...prev, ...incoming]
      );

      // Якщо прийшло менше, ніж limit — далі немає що вантажити
      if (incoming.length < limit) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      setPage(targetPage);
    } catch (err: unknown) {
      console.error("Помилка завантаження історій:", err);
      setError("Сталася помилка під час завантаження історій.");
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setInitialLoading(false);
    }
  };

  /**
   * Обробник кнопки "Переглянути всі"
   */
  const handleLoadMore = () => {
    if (!pageSize || isLoading || !hasMore) return;
    const nextPage = page + 1;
    void fetchStories(nextPage, pageSize, false);
  };

  return (
    <section className={cn(styles.section, "container")}>
      <h2 className={styles.title}>Історії мандрівників</h2>

      {/* Початковий лоадер */}
      {initialLoading && isLoading && (
        <div className={styles.loaderWrap}>
          <Loader />
        </div>
      )}

      {/* Повідомлення про помилку */}
      {error && !isLoading && (
        <p className={styles.error}>{error}</p>
      )}

      {/* Порожній стан, якщо історій немає */}
      {!initialLoading &&
        !isLoading &&
        !error &&
        stories.length === 0 && (
          <p className={styles.empty}>Історій поки що немає.</p>
        )}

      {/* Список карток */}
      <div className={styles.grid}>
        {stories.map(story => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </div>

      {/* Кнопка "Переглянути всі" — тільки якщо ще є що вантажити */}
      {hasMore && !isLoading && stories.length > 0 && (
        <div className={styles.buttonWrap}>
          <button
            type="button"
            className={styles.button}
            onClick={handleLoadMore}
          >
            Переглянути всі
          </button>
        </div>
      )}

      {/* Лоадер під час догрузки наступних порцій */}
      {isLoading && !initialLoading && (
        <div className={styles.loaderInline}>
          <Loader />
        </div>
      )}
    </section>
  );
}