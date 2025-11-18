'use client';

import { useState, useEffect, useCallback } from 'react';
import TravellersStoriesItem from '../TravellersStoriesItem/TravellersStoriesItem';
import styles from './Popular.module.css';

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
  const [loading, setLoading] = useState(true);

  const API_URL = 'https://travellers-node.onrender.com';

  const fetchStories = useCallback(async () => {
    //   try {
    //     const res = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/api/stories/popular?page=${page}&limit=${LIMIT}`
    //     );

    //     const data = await res.json();
    //     const incoming: Story[] = data.stories;

    //     setStories(prev => [...prev, ...incoming]);

    //     if (incoming.length < LIMIT) {
    //       setHasMore(false);
    //     }
    //   } catch (error) {
    //     console.error('Помилка завантаження:', error);
    //   }
    // }, [page]);
    if (!API_URL) {
      console.error('API_URL не задано');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${API_URL}/api/stories/popular?page=${page}&limit=${LIMIT}`,
        { credentials: 'include' }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      let incoming: Story[] = [];

      if (data && typeof data === 'object') {
        if (Array.isArray(data)) {
          incoming = data;
        } else if (Array.isArray(data.stories)) {
          incoming = data.stories;
        } else if (Array.isArray(data.data)) {
          incoming = data.data;
        } else if (data.data && Array.isArray(data.data.stories)) {
          incoming = data.data.stories;
        }
      }

      // const incoming: Story[] = rawStories;
      if (page === 1) {
        setStories(incoming);
      } else {
        setStories(prev => [...prev, ...incoming]);
      }

      setHasMore(incoming.length === LIMIT);
    } catch (error) {
      console.error('Помилка завантаження популярних історій:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [API_URL, page]);

  // useEffect(() => {
  //   let isMounted = true;

  //   Promise.resolve().then(() => {
  //     if (isMounted) fetchStories();
  //   });

  //   return () => {
  //     isMounted = false;
  //   };
  // }, [fetchStories]);

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Популярні історії</h2>

      {loading && stories.length === 0 && <p>Завантаження...</p>}

      <div className={styles.list}>
        {stories.map(story => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </div>

      {hasMore && (
        <button className={styles.button} onClick={handleLoadMore}>
          {loading ? 'Завантажуємо...' : 'Переглянути всі'}
        </button>
      )}
    </section>
  );
}
