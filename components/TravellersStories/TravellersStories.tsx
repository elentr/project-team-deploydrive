"use client";

import { useEffect, useState } from "react";
import { Story } from "../TravellersStoriesItem/TravellersStoriesItem";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";
import css from "./TravellersStories.module.css";

interface TravellersStoriesProps {
  stories: Story[];
}

export default function TravellersStories({ stories }: TravellersStoriesProps) {
  const [visibleCount, setVisibleCount] = useState(9); 
  const [loadedStories, setLoadedStories] = useState<Story[]>([]);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(9);
      } else if (window.innerWidth < 1280) {
        setVisibleCount(8);
      } else {
        setVisibleCount(9);
      }
    };

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  useEffect(() => {
    setLoadedStories(stories.slice(0, visibleCount));
  }, [visibleCount, stories]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  const hasMore = loadedStories.length < stories.length;

  return (
    <section>
      <ul className={css.stories__list}>
        {loadedStories.map((story) => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </ul>

      {hasMore && (
        <button className={css.loadMoreBtn} onClick={handleLoadMore}>
          Переглянути всі
        </button>
      )}
    </section>
  );
}
