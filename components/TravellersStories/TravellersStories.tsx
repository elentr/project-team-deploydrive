'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './TravellersStories.module.css';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import { Story } from '@/types/story';
import { Traveller } from '@/types/traveller';

export type FetchResult = {
  data: Story[];
  hasNextPage: boolean;
};

interface Props {
  initialStories: Story[];
  initialHasMore: boolean;
  travellers?: Traveller[];
  fetchNextPage: (page: number, limit: number) => Promise<FetchResult | null>;
}

export default function TravellersStories({
  initialStories,
  initialHasMore,
  fetchNextPage,
  travellers = [],
}: Props) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const getResponsiveLimit = () => {
    if (typeof window === 'undefined') return 9;
    if (window.innerWidth < 768) return 4;
    if (window.innerWidth < 1440) return 6;
    return 9;
  };

  const [limit, setLimit] = useState(9);

  const travellersMap = useMemo(() => {
    return new Map(travellers.map(t => [t._id, t]));
  }, [travellers]);

  useEffect(() => {
    const handleResize = () => {
      const newLimit = getResponsiveLimit();
      setLimit(newLimit);
      if (page === 1) {
        setStories(initialStories.slice(0, newLimit));
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [page, initialStories]);

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const result = await fetchNextPage(page + 1, limit);

      if (result) {
        setStories(prev => {
          const existingIds = new Set(prev.map(s => s._id));
          const uniqueNewStories = result.data.filter(
            newStory => !existingIds.has(newStory._id)
          );
          return [...prev, ...uniqueNewStories];
        });

        setPage(prev => prev + 1);
        setHasMore(result.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <ul className={styles.travellerList}>
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
      </div>
    </section>
  );
}
