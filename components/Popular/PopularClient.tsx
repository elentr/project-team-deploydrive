'use client';

import { useState, useEffect } from 'react';
import TravellersStories from '../TravellersStories/TravellersStories';
import css from './PopularClient.module.css';
import { Story, ApiStory, mapStory, Category } from '@/types/story';
import Loader from '@/components/Loader/Loader';

interface PopularClientProps {
  initialStories: Story[];
  withPagination?: boolean;
  isAuthenticated?: boolean;
}

export default function PopularClient({
  initialStories,
  withPagination = true,
  isAuthenticated = false,
}: PopularClientProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [page, setPage] = useState(1);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_URL;
        if (!API) return;

        const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
        const apiPath = baseUrl.endsWith('/api') ? '/categories' : '/api/categories';
        const url = `${baseUrl}${apiPath}`;

        const res = await fetch(url, { credentials: 'include' });
        if (!res.ok) return;

        const data = await res.json();
        let categories: Category[] = [];
        
        if (Array.isArray(data)) {
          categories = data;
        } else if (data.data && Array.isArray(data.data)) {
          categories = data.data;
        } else if (data.categories && Array.isArray(data.categories)) {
          categories = data.categories;
        }
        
        const map = new Map<string, string>();
        categories.forEach((cat: Category) => {
          if (cat.id && cat.name) {
            map.set(cat.id, cat.name);
          }
        });
        setCategoryMap(map);
      } catch (error) {
        console.error('Помилка отримання категорій:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile === null) return;

    let count = initialStories.length;
    if (window.innerWidth >= 768 && window.innerWidth < 1440)
      count = Math.min(initialStories.length, 4);
    else count = Math.min(initialStories.length, 3);

    setStories(initialStories.slice(0, count));
  }, [initialStories, isMobile]);

  useEffect(() => {
    if (categoryMap.size === 0 || isMobile === null) return;

    setStories(prevStories => {
      return prevStories.map(story => {
        const categoryValue = story.category;
        if (categoryValue && categoryMap.has(categoryValue)) {
          const categoryName = categoryMap.get(categoryValue);
          if (categoryName && categoryName !== categoryValue) {
            return { ...story, category: categoryName };
          }
        }
        return story;
      });
    });
  }, [categoryMap, isMobile]);

  if (isMobile === null) return null;

  const perPage = window.innerWidth >= 768 && window.innerWidth < 1440 ? 4 : 3;

  const handleLoadMore = async () => {
    if (!withPagination) return;
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const API = process.env.NEXT_PUBLIC_API_URL;
      if (!API) {
        setHasMore(false);
        return;
      }
      
      const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
      const apiPath = baseUrl.endsWith('/api') ? '/stories/popular' : '/api/stories/popular';
      const url = `${baseUrl}${apiPath}?page=${nextPage}&limit=${perPage}`;
      
      const res = await fetch(url, { credentials: 'include' });
      
      if (!res.ok) {
        setHasMore(false);
        return;
      }
      
      const data = await res.json();
      let rawStories: ApiStory[] = [];
      
      if (data.data && data.data.stories && Array.isArray(data.data.stories)) {
        rawStories = data.data.stories as ApiStory[];
      } else if (data.stories && Array.isArray(data.stories)) {
        rawStories = data.stories as ApiStory[];
      } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
        rawStories = data.data.data as ApiStory[];
      } else if (data.data && Array.isArray(data.data)) {
        rawStories = data.data as ApiStory[];
      } else if (Array.isArray(data)) {
        rawStories = data as ApiStory[];
      }
      
      if (rawStories.length === 0) {
        setHasMore(false);
      } else {
        const mappedStories = rawStories.map(s => {
          const categoryName = s.category ? categoryMap.get(s.category) : undefined;
          return mapStory(s, baseUrl, categoryName);
        });
        setStories(prev => [...prev, ...mappedStories]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Помилка отримання історій:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="stories">
      <div className="container">
        <h2 className={css.stories__title}>Популярні історії</h2>
        <TravellersStories
          stories={stories}
          isAuthenticated={isAuthenticated}
        />
        {withPagination && hasMore && (
          <div className={css.stories__footer}>
            {loading ? (
              <Loader />
            ) : (
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className={css.stories__more}
              >
                Переглянути всі
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

