"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import styles from "./TravellersStories.module.css";

import type { Story } from "@/types/story";

interface ApiStory {
  _id: string;
  img: string;
  title: string;
  article: string;
  categoryName: string;
  date: string;
  ownerId: string;
  favoriteCount: number;
}

const SHOW_PER_PAGE = 9;
const SERVER_PER_PAGE = 10;

// mapper
function mapStory(api: ApiStory): Story {
  return {
    _id: api._id,
    img: api.img,
    title: api.title,
    category: api.categoryName,
    description: api.article.slice(0, 180) + "...",
    author: "Автор",
    avatar: "/images/avatar.svg",
    date: api.date,
    readTime: 1,
    bookmarksCount: api.favoriteCount,
    isSaved: false,
  };
}

export default function TravellersStories() {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [visibleStories, setVisibleStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hasMore, setHasMore] = useState(true);

  // ----------- FETCH PAGE -------------
  const fetchPage = useCallback(async (pageNumber: number) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stories`,
      { params: { page: pageNumber, limit: SERVER_PER_PAGE } }
    );

    const items = res.data.data.data.map(mapStory);

    // додаємо у глобальний список
    setAllStories(prev => [...prev, ...items]);
    setHasMore(res.data.data.hasNextPage);
  }, []);

  // ----------- INITIAL LOAD -----------
  useEffect(() => {
    (async () => {
      await fetchPage(1);
    })();
  }, [fetchPage]);

  // ----------- UPDATE VISIBLE LIST -----------
  useEffect(() => {
    (async () => {
      const filtered =
        activeCategory === "all"
          ? allStories
          : allStories.filter(s => s.category === activeCategory);

      const slice = filtered.slice(0, page * SHOW_PER_PAGE);

      await Promise.resolve();
      setVisibleStories(slice);
    })();
  }, [allStories, page, activeCategory]);

  // ----------- FILTER BUTTON -----------
  const handleFilter = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
    setVisibleStories([]); // очищаємо перед новим застосуванням
  };

  // ----------- LOAD MORE -----------
  const loadMore = async () => {
    const next = page + 1;
    setPage(next);

    // якщо нам НЕ вистачає карток — догружаємо наступну сторінку
    if (allStories.length < next * SHOW_PER_PAGE) {
      await fetchPage(next);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>Історії мандрівників</h2>

        <div className={styles.filters}>
          {["all", "Європа", "Азія", "Пустелі", "Африка", "Америка", "Гори"].map(id => (
            <button
              key={id}
              className={`${styles.filterBtn} ${
                activeCategory === id ? styles.filterBtnActive : ""
              }`}
              onClick={() => handleFilter(id)}
            >
              {id === "all" ? "Всі історії" : id}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {visibleStories.map(s => (
            <TravellersStoriesItem key={s._id} story={s} />
          ))}
        </div>

        {hasMore && (
          <button className={styles.buttonLoad} onClick={loadMore}>
            Показати ще
          </button>
        )}
      </div>
    </section>
  );
}