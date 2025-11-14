"use client";

import css from "./TravellersList.module.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
  description: string;
}

export default function ShowMTravellersListClientore({
  initialTravellers,
  totalItems,
}: {
  initialTravellers: Traveller[];
  totalItems: number;
}) {
  const [travellers, setTravellers] = useState(initialTravellers);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [initialLimit, setInitialLimit] = useState(12);
  const router = useRouter();

  useEffect(() => {
    const width = window.innerWidth;
    const limit = width < 1440 ? 8 : 12;
    setInitialLimit(limit);
    setDisplayLimit(limit);
  }, []);

  const handleShowMore = async () => {
    const nextPage = page + 1;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users?page=${nextPage}&perPage=4`
      );

      if (res.data?.data?.data && Array.isArray(res.data.data.data)) {
        setTravellers((prev) => [...prev, ...res.data.data.data]);
        setPage(nextPage);

        setDisplayLimit((prev) => prev + 4);

        setTimeout(() => {
          const items = document.querySelectorAll(`.${css.item}`);
          const lastItem = items[items.length - 1];
          lastItem?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 50);
      }
    } catch (err) {
      console.error("Could not load more travellers:", err);
    } finally {
      setLoading(false);
    }
  };

  const displayedTravellers = travellers.slice(0, displayLimit);
  const hasMore =
    travellers.length < totalItems || displayedTravellers.length < totalItems;

  return (
    <>
      <ul className={css.list}>
        {displayedTravellers.length > 0 ? (
          displayedTravellers.map((t: Traveller, index: number) => (
            <li key={`${t._id}-${index}`} className={css.item}>
              {t.avatarUrl ? (
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  width={112}
                  height={112}
                  className={css.photo}
                />
              ) : (
                <img
                  src="/default-user-icon.png"
                  alt={t.name}
                  width={112}
                  height={112}
                  className={css.photo}
                />
              )}
              <div className={css.itemDiv}>
                <h4 className={css.itemTitle}>{t.name}</h4>
                <p className={css.itemText}>{t.description || "Без опису"}</p>
                <button
                  type="button"
                  className={css.itemBtn}
                  onClick={() => router.push(`/profile/${t._id}`)}
                >
                  Переглянути профіль
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>Немає мандрівників</li>
        )}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={css.btn}
          onClick={handleShowMore}
          disabled={loading}
        >
          {loading ? "Завантаження..." : "Показати ще"}
        </button>
      )}
    </>
  );
}
