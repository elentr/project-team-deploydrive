//import css from "./TravellersStories.module.css";

// export default function TravellersStories() {
//   return (
//     <section>
//       <h3>TravellersStories</h3>
//     </section>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Story } from "@/types/stories";
import TravellersStoriesItem from "../TravellersStoriesItem/TravellersStoriesItem";

export default function TravellersStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const STORIES_PER_PAGE = 3;

  async function fetchStories(page: number, limit: number): Promise<Story[]> {
    const res = await fetch(`/api/stories?page=${page}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to fetch stories");
    const data = await res.json();
    return data.stories;
  }

  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const newStories = await fetchStories(page, STORIES_PER_PAGE);
      if (newStories.length < STORIES_PER_PAGE) setHasMore(false);
      setStories(prev => [...prev, ...newStories]);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error(error);
      setHasMore(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1312px] w-full">
        {stories.map(story => (
          <TravellersStoriesItem key={story._id} story={story} />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={loadStories}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Переглянути всі
        </button>
      )}
    </div>
  );
}

