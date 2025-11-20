"use server";

import StoryDetails from "@/components/StoryDetails/StoryDetails";
import { mapStory } from "@/types/story";
import Link from "next/link";
import css from "./page.module.css";

interface StoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  try {
    // Основна історія
    const resStory = await fetch(`${baseUrl}/api/stories/${id}`, { cache: "no-store" });
    if (!resStory.ok) {
      return (
        <main className="container py-10">
          <h1>Статтю не знайдено</h1>
        </main>
      );
    }
    const storyData = await resStory.json();

    // Популярні історії
    const resPopular = await fetch(`${baseUrl}/api/stories/popular`, { cache: "no-store" });
    let popularStories: any[] = [];
    if (resPopular.ok) {
      const popularData = await resPopular.json();
      popularStories = popularData.stories?.filter((s: any) => s._id !== id).slice(0, 3) || [];
    }

    return (
      <main className="container mx-auto px-4 py-10 flex flex-col gap-16">
        {/* Основна історія */}
        <h1 className="text-3xl font-bold">{storyData.title}</h1>
        <StoryDetails story={mapStory(storyData)} />

        {/* Популярні історії */}
        {popularStories.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Популярні історії</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {popularStories.map((story: any) => (
                <Link
                  key={story._id}
                  href={`/stories/${story._id}`}
                  className="border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  {story.img && (
                    <img
                      src={story.img}
                      alt={story.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{story.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {story.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    );
  } catch (err) {
    console.error("Error loading story:", err);
    return (
      <main className="container py-10">
        <h1>Помилка при завантаженні статті</h1>
      </main>
    );
  }
}
