"use client";

import { useState } from "react";
import TravellerInfo from "@/components/TravellerInfo/TravellerInfo";
import MessageNoStories from "@/components/MessageNoStories/MessageNoStories";
import TravellersStories from "@/components/TravellersStories/TravellersStories";
import css from "./TravellerPage.module.css";
import { toast } from "react-hot-toast";
import { Story, TravellerClientProps } from "@/types/types";

export default function TravellerPageClient({
  travellerId,
  initialTraveller,
  initialStories,
  initialHasNextPage,
}: TravellerClientProps) {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [page, setPage] = useState(2);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [moreLoading, setMoreLoading] = useState(false);

  const fetchMoreStories = async () => {
    if (moreLoading) return;

    setMoreLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_DATA_BASE_URL}/api/users/${travellerId}?page=${page}`
      );

      const json = await res.json();
      const storiesData = json?.data?.stories;
      const newStories = storiesData?.data || [];

      setStories((prevStories) => [...prevStories, ...newStories]);
      setHasNextPage(storiesData?.hasNextPage || false);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message || "Сталася помилка");
    } finally {
      setMoreLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (hasNextPage && !moreLoading) {
      fetchMoreStories();
    }
  };

  return (
    <>
      <TravellerInfo
        traveller={{
          name: initialTraveller.name,
          photo: initialTraveller.avatarUrl,
          info: initialTraveller.description,
        }}
      />

      <div className={css.container}>
        <h2 className={css.title}>Історії Мандрівника</h2>
        {stories.length > 0 ? (
          <>
            <TravellersStories stories={stories} />
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
