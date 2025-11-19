"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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

interface TravellersStoriesProps {
  stories?: Story[];
  showFilters?: boolean;
  title?: string;
  isAuthenticated?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
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

export default function TravellersStories({
  stories: externalStories,
  showFilters = true,
  title = "Історії мандрівників",
  isAuthenticated = false,
  onLoadMore,
  hasMore: externalHasMore,
  loading: externalLoading,
}: TravellersStoriesProps) {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("all");
  const [hasMore, setHasMore] = useState(true);

  // ----------- FETCH PAGE -------------
  const fetchPage = useCallback(async (pageNumber: number) => {
    const API = process.env.NEXT_PUBLIC_API_URL;
    if (!API) return;

    const res = await fetch(
      `${API}/api/stories?page=${pageNumber}&limit=${SERVER_PER_PAGE}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error("Не вдалося завантажити історії");
    }

    const data = await res.json();
    const items = data.data.data.map(mapStory);

    setAllStories(prev => [...prev, ...items]);
    setHasMore(data.data.hasNextPage);
  }, []);

  // ----------- INITIAL LOAD -----------
  useEffect(() => {
    if (externalStories !== undefined) {
      return;
    }
    (async () => {
      await fetchPage(1);
    })();
  }, [fetchPage, externalStories]);

  // ----------- UPDATE VISIBLE LIST -----------
  const visibleStories = useMemo(() => {
    if (externalStories !== undefined) {
      return externalStories;
    }

    const filtered =
      activeCategory === "all"
        ? allStories
        : allStories.filter(s => s.category === activeCategory);

    return filtered.slice(0, page * SHOW_PER_PAGE);
  }, [allStories, page, activeCategory, externalStories]);

  // ----------- FILTER BUTTON -----------
  const handleFilter = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  // ----------- LOAD MORE -----------
  const loadMore = async () => {
    if (onLoadMore) {
      onLoadMore();
      return;
    }

    const next = page + 1;
    setPage(next);

    if (allStories.length < next * SHOW_PER_PAGE) {
      await fetchPage(next);
    }
  };

  const displayStories = externalStories !== undefined ? externalStories : visibleStories;
  const displayHasMore = externalHasMore !== undefined ? externalHasMore : hasMore;
  const displayLoading = externalLoading !== undefined ? externalLoading : false;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>

        {showFilters && (
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
        )}

        <div className={styles.stories__list}>
          {displayStories.map(s => (
            <TravellersStoriesItem 
              key={s._id} 
              story={s} 
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        {displayHasMore && !displayLoading && (
          <button className={styles.buttonLoad} onClick={loadMore}>
            Показати ще
          </button>
        )}
      </div>
    </section>
  );
}