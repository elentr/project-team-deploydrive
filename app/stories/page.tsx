import TravellersStories from "@/components/TravellersStories/TravellersStories";
import { Story, ApiStory, mapStory, Category } from '@/types/story';

async function fetchCategories(baseUrl: string): Promise<Map<string, string>> {
  try {
    const apiPath = baseUrl.endsWith('/api') ? '/categories' : '/api/categories';
    const url = `${baseUrl}${apiPath}`;
    
    const res = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) return new Map();

    const data = await res.json();
    let categories: Category[] = [];
    
    if (Array.isArray(data)) {
      categories = data;
    } else if (data.data && Array.isArray(data.data)) {
      categories = data.data;
    } else if (data.categories && Array.isArray(data.categories)) {
      categories = data.categories;
    }
    
    const categoryMap = new Map<string, string>();
    categories.forEach((cat: Category) => {
      if (cat.id && cat.name) {
        categoryMap.set(cat.id, cat.name);
      }
    });

    return categoryMap;
  } catch (error) {
    return new Map();
  }
}

async function fetchStories(): Promise<Story[]> {
  const API = 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.API_BASE_URL ||
    'https://travellers-node.onrender.com';
  
  const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
  const apiPath = baseUrl.endsWith('/api') ? '/stories' : '/api/stories';
  const url = `${baseUrl}${apiPath}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
    
    if (data.data && data.data.stories && Array.isArray(data.data.stories)) {
      rawStories = data.data.stories as ApiStory[];
    } else if (data.stories && Array.isArray(data.stories)) {
      rawStories = data.stories as ApiStory[];
    } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
      rawStories = data.data.data as ApiStory[];
    } else if (data.data && Array.isArray(data.data)) {
      rawStories = data.data as ApiStory[];
    } else if (Array.isArray(data)) {
      rawStories = data as ApiStory[];
    }

    const categoryMap = await fetchCategories(baseUrl);
    const mappedStories = rawStories.map(s => {
      const categoryName = s.category ? categoryMap.get(s.category) : undefined;
      return mapStory(s, baseUrl, categoryName);
    });

    return mappedStories;
  } catch (error) {
    return [];
  }
}

export default async function StoriesPage() {
  const stories = await fetchStories();

  return (
    <TravellersStories 
      stories={stories} 
      isAuthenticated={false}
    />
  );
}