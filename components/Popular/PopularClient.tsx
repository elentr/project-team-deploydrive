'use client';

import { useState, useEffect } from 'react';
import TravellersStories from '../TravellersStories/TravellersStories';
import css from './PopularClient.module.css';
import { Story, ApiStory, mapStory } from '@/types/story';
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
      
      // Видаляємо слеш в кінці, якщо є
      const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
      
      // NEXT_PUBLIC_API_URL має бути без /api, тому завжди додаємо /api/stories/popular
      // Якщо хтось додав /api в кінці (для сумісності), обробляємо це
      const apiPath = baseUrl.endsWith('/api') ? '/stories/popular' : '/api/stories/popular';
      const url = `${baseUrl}${apiPath}?page=${nextPage}&limit=${perPage}`;
      
      const res = await fetch(url, { credentials: 'include' });
      
      if (!res.ok) {
        setHasMore(false);
        return;
      }
      
      const data = await res.json();
      let rawStories: ApiStory[] = [];
      
      if (data.stories && Array.isArray(data.stories)) {
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
        const mappedStories = rawStories.map(mapStory);
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

