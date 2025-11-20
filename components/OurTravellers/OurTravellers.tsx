'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import OurTravellersList from '../OurTravellers/OurTravellersList';
import styles from './OurTravellers.module.css';
import cn from 'classnames';
import type { Traveller } from '@/types/traveller';
import Loader from '../Loader/Loader';

const INITIAL = 4;
const LOAD = 3;

export default function OurTravellers() {
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'https://travellers-node.onrender.com';

  const fetchTravellers = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        params: {
          page,
          perPage: page === 1 ? INITIAL : LOAD,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        },
      });

      let data = res.data.data.data;
      const hasNextPage = res.data.data.hasNextPage;

      if (page > 1) {
        const lastPrev = travellers[travellers.length - 1]?._id;
        const firstOfNew = data[0]?._id;

        if (firstOfNew === lastPrev) {
          console.warn('Duplicate detected → removing only first item');
          data = data.slice(1);
        }
      }

      setTravellers(prev => {
        const all = [...prev, ...data];
        const unique = Array.from(new Map(all.map(t => [t._id, t])).values());
        return unique;
      });

      setHasMore(hasNextPage);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Travellers fetch error:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravellers();
  }, []);

  return (
    <section className={cn(styles.section, 'container')}>
      <h2 className={styles.title}>Наші Мандрівники</h2>

      <OurTravellersList travellers={travellers} />

      {/* Кнопка загрузки */}
      {hasMore && !loading && (
        <button
          className={styles.button}
          onClick={fetchTravellers}
          type="button"
        >
          Переглянути всіх
        </button>
      )}

      {loading && <Loader />}
    </section>
  );
}
