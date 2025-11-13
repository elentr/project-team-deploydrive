"use client";

import css from "./TravellersList.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
  description: string;
}

export default function ShowMore({ travellers }: { travellers: Traveller[] }) {
  const [displayCount, setDisplayCount] = useState(2);

  const router = useRouter();
  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 1);

    setTimeout(() => {
      const items = document.querySelectorAll(`.${css.item}`);
      const lastItem = items[items.length - 1];
      lastItem?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 50);
  };

  const displayedTravellers = travellers.slice(0, displayCount);
  const hasMore = displayCount < travellers.length;

  return (
    <>
      <ul className={css.list}>
        {travellers.length > 0 ? (
          displayedTravellers.map((t: Traveller) => (
            <li key={t._id} className={css.item}>
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
        <button type="button" className={css.btn} onClick={handleShowMore}>
          Показати ще
        </button>
      )}
    </>
  );
}
