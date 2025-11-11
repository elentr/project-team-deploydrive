"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import MessageNoStories from "@/components/MessageNoStories/MessageNoStories";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import css from "./TravellerPage.module.css";

interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  date: string;
  favoriteCount: number;
}

interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string;
  description: string;
}

export default function TravellerPage() {
  const params = useParams();
  const travellerId = params?.travellerId;

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [traveller, setTraveller] = useState<Traveller | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    if (!travellerId) {
      setInitialLoading(false);
      return;
    }

    async function fetchData() {
      if (page === 1) {
        setInitialLoading(true);
      } else {
        setMoreLoading(true);
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/users/${travellerId}?page=${page}`
        );

        if (!res.ok) {
          throw new Error("Мандрівника або історії не знайдено");
        }

        const json = await res.json();

        if (page === 1) {
          setTraveller(json?.data?.user || null);
        }

        const storiesData = json?.data?.stories;
        const newStories = storiesData?.data || [];

        setStories((prevStories) => [...prevStories, ...newStories]);
        setHasNextPage(storiesData?.hasNextPage || false);
      } catch (err) {
        console.error(err);
        if (page === 1) {
          setTraveller(null);
          setStories([]);
        }
      } finally {
        setInitialLoading(false);
        setMoreLoading(false);
      }
    }

    fetchData();
  }, [travellerId, page]);

  const handleLoadMore = () => {
    if (hasNextPage && !moreLoading) {
      setPage((prev) => prev + 1);
    }
  };

  if (initialLoading) {
    return <p>Завантаження...</p>;
  }

  if (!traveller) {
    return <p>Мандрівник не знайдений</p>;
  }

  return (
    <>
      <TravellerInfo
        traveller={{
          name: traveller.name,
          photo: traveller.avatarUrl,
          info: traveller.description,
        }}
      />

      <div className={css.container}>
        <h2 className={css.title}>Історії Мандрівника</h2>
        {stories && stories.length > 0 ? (
          <>
            <TravellersStories stories={stories} />

            {hasNextPage && (
              <button onClick={handleLoadMore} disabled={moreLoading}>
                {moreLoading ? "Завантаження..." : "Завантажити ще"}
              </button>
            )}
          </>
        ) : (
          <MessageNoStories
            text="Цей користувач ще не публікував історій"
            buttonText="Назад до історій"
            route="/stories"
          />
        )}
      </div>
    </>
  );
}
