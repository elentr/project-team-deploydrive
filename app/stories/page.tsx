'use client';

import React, { useEffect, useState } from "react";
import { clientApi } from "@/lib/api/clientApi";
import type { PaginatedStoriesResponse, Story } from "@/types/story";

const CATEGORIES = [
  { id: "all", name: "Всі історії" },
  { id: "europe", name: "Європа" },
  { id: "asia", name: "Азія" },
  { id: "deserts", name: "Пустелі" },
  { id: "africa", name: "Африка" },
];

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchStories() {
    try {
      setLoading(true);
      const { data } = await clientApi.get<PaginatedStoriesResponse>("/stories", {
        params: { page, perPage, category },
      });
      setStories(data.data);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Помилка при завантаженні історій");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStories();
  }, [page, category]);

  return (
    <main className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-semibold mb-8">Історії мандрівників</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id === "all" ? undefined : cat.id)}
            className={`px-4 py-2 rounded border ${
              category === cat.id || (!category && cat.id === "all")
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading && <p>Завантаження...</p>}
      {error && <p className="text-red-500">Помилка: {error}</p>}

      {!loading && !error && (
        <>
          <ul className="space-y-4">
            {stories.map((story) => (
              <li key={story._id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p>{story.description}</p>
              </li>
            ))}
          </ul>

          <div className="flex justify-center mt-6 gap-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Назад
            </button>
            <span className="px-2 py-2">{page} / {totalPages}</span>
            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Вперед
            </button>
          </div>
        </>
      )}
    </main>
  );
}
