import StoriesClient from '@/components/StoriesPage/StoriesPage';
import { mapStory } from '@/types/story';

async function getInitialStories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/stories?page=1&limit=9`,
    );

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || json;
  } catch (e) {
    console.error('Error fetching initial stories:', e);
    return null;
  }
}

export default async function StoriesPage() {
  // 1. Завантажуємо дані на сервері
  const data = await getInitialStories();

  const initialStories = data?.stories || data?.data || [];
  const initialHasMore = data?.hasNextPage || false;

  // 2. Мапимо дані (ApiStory -> Story)
  const mappedStories = initialStories.map(mapStory);

  // 3. Передаємо дані в клієнтський компонент
  return (
    <main>
      <div className="container" style={{ paddingTop: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Всі історії
        </h1>

        <StoriesClient
          initialStories={mappedStories}
          initialHasMore={initialHasMore}
        />
      </div>
    </main>
  );
}
