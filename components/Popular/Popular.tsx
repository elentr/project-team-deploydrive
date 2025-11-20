'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import styles from './Popular.module.css';
import { Story } from '@/types/story';
import { Traveller } from '@/types/traveller';

export default function Popular() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [limit, setLimit] = useState(3);

  const [travellers, setTravellers] = useState<Traveller[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLimit(3); // Мобільна
      } else if (width >= 768 && width < 1280) {
        setLimit(4); // Планшет
      } else {
        setLimit(3); // Десктоп
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchStories = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_URL) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/stories/popular?page=${page}&perPage=${limit}`,
        { credentials: 'include' }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const incoming: Story[] = data?.data?.stories || [];
      const authors: Traveller[] = data?.data?.authors || [];

      setStories(prev => {
        const newStories = incoming.filter(
          newStory => !prev.some(s => s._id === newStory._id)
        );
        return [...prev, ...newStories];
      });

      if (authors.length) setTravellers(prev => [...prev, ...authors]);

      setHasMore(data?.data?.hasNextPage ?? false);
    } catch (error) {
      console.error('Помилка завантаження популярних історій:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const travellersMap = useMemo(() => {
    return new Map(travellers.map(t => [t._id, t]));
  }, [travellers]);

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage(prev => prev + 1);
  };

  if (!loading && stories.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Популярні історії</h2>

      {loading && stories.length === 0 && <p>Завантаження...</p>}

      <ul className={styles.grid}>
        {stories.map(story => (
          <li key={story._id} className={styles.listItem}>
            <TravellersStoriesItem
              story={story}
              travellersMap={travellersMap}
            />
          </li>
        ))}
      </ul>

      {hasMore && (
        <button
          type="button"
          className={styles.buttonLoad}
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? 'Завантаження...' : 'Переглянути ще'}
        </button>
      )}
    </section>
  );
}
