import PopularClient from './PopularClient';
import { Story, ApiStory, mapStory } from '@/types/story';

interface PopularProps {
  withPagination?: boolean;
}

async function fetchStoriesServer(page: number, limit: number): Promise<Story[]> {
  const API = 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.API_BASE_URL ||
    'https://travellers-node.onrender.com';
  
  // Видаляємо слеш в кінці, якщо є
  const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
  
  // NEXT_PUBLIC_API_URL має бути без /api, тому завжди додаємо /api/stories/popular
  // Якщо хтось додав /api в кінці (для сумісності), обробляємо це
  const apiPath = baseUrl.endsWith('/api') ? '/stories/popular' : '/api/stories/popular';
  const url = `${baseUrl}${apiPath}?page=${page}&limit=${limit}`;

  try {
    // Додаємо timeout для server-side fetch
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд

    const res = await fetch(url, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return [];

    const data = await res.json();
    let rawStories: ApiStory[] = [];
    
    if (data.stories && Array.isArray(data.stories)) {
      rawStories = data.stories as ApiStory[];
    } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
      rawStories = data.data.data as ApiStory[];
    } else if (data.data && Array.isArray(data.data)) {
      rawStories = data.data as ApiStory[];
    } else if (Array.isArray(data)) {
      rawStories = data as ApiStory[];
    }

    return rawStories.map(mapStory);
  } catch (error) {
    // Не логуємо помилку в production, щоб не засмічувати консоль
    if (process.env.NODE_ENV === 'development') {
      console.error('Помилка отримання історій:', error);
      console.error('URL запиту:', url);
      if (error instanceof Error) {
        console.error('Деталі помилки:', error.message);
      }
    }
    // Повертаємо порожній масив, щоб компонент не падав
    return [];
  }
}

export default async function Popular({ withPagination }: PopularProps) {
  const initialStories = await fetchStoriesServer(1, 4);

  return (
    <PopularClient
      initialStories={initialStories}
      withPagination={withPagination}
      isAuthenticated={false}
    />
  );
}