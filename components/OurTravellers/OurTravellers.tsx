"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import TravellersList from "../TravellersList/TravellersList";
import styles from "./OurTravellers.module.css";
import cn from "classnames";
import type { Traveller } from "@/types/traveller";
import Loader from "../Loader/Loader";


const INITIAL = 4; // первые 4 мандрівники
const LOAD = 3;    // подгружаем по 3

export default function OurTravellers() {
    const [travellers, setTravellers] = useState<Traveller[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchTravellers = async () => {
        if (!hasMore || loading) return;

        try {
        setLoading(true);

        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
            {
                params: {
                    page,
                    perPage: page === 1 ? INITIAL : LOAD,
                },
            }
        );

        const { data, hasNextPage } = res.data.data;

        setTravellers((prev) => {
            const seen = new Set(prev.map((t) => t._id));
            const unique = [...prev];

            data.forEach((item: Traveller) => {
                if (!seen.has(item._id)) {
                    unique.push(item);
                    seen.add(item._id);
                }
            });

            return unique;
        });
      
        setHasMore(hasNextPage);

        setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Travellers fetch error:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTravellers();
  }, []);

  return (
    <section className={cn(styles.section, "container")}>
      <h2 className={styles.title}>Наші Мандрівники</h2>

      {/* <TravellersList travellers={travellers} /> */}

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
      {loading && <p className={styles.loading}>Завантаження...</p>}
    </section>
  );
}