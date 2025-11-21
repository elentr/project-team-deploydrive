import StoriesClient from '@/components/StoriesPage/StoriesPage'; 
import { mapStory } from '@/types/story';
import css from './Page.module.css';

export const dynamic = 'force-dynamic';

async function getInitialStories(category: string) {
  try {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/stories`);
    url.searchParams.set('page', '1');
    url.searchParams.set('limit', '9');
    if (category) url.searchParams.set('category', category);

    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error fetching stories:', e);
    return null;
  }
}

async function getCategories() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, { 
      cache: 'force-cache' 
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || []; 
  } catch (e) {
    return [];
  }
}


interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function StoriesPage({ searchParams }: PageProps) {
  const category = typeof searchParams?.category === 'string' ? searchParams.category : '';

  const [storiesData, categoriesData] = await Promise.all([
    getInitialStories(category),
    getCategories()
  ]);

  let initialStories = [];
  let initialHasMore = false;

  if (storiesData) {
    if (Array.isArray(storiesData?.stories)) {
       initialStories = storiesData.stories;
    } else if (Array.isArray(storiesData?.data)) {
       initialStories = storiesData.data;
    } else if (storiesData?.data?.stories && Array.isArray(storiesData.data.stories)) {
       initialStories = storiesData.data.stories;
    } else if (Array.isArray(storiesData)) {
       initialStories = storiesData;
    }
    
    if (storiesData.hasNextPage) initialHasMore = storiesData.hasNextPage;
    else if (storiesData.data?.hasNextPage) initialHasMore = storiesData.data.hasNextPage;
  }

  console.log('--- SERVER DEBUG ---');
  console.log('Category:', category || 'ALL');
  console.log('Found stories count:', initialStories.length);

  const mappedStories = initialStories.map(mapStory);

  return (
    <main>
      <div className="container" style={{ paddingTop: '40px' }}>
        <h1 className={css.title}>
          Історії Мандрівників
        </h1>
        <p className={css.category}>Категорії</p>

        <StoriesClient
          initialStories={mappedStories}
          initialHasMore={initialHasMore}
          initialCategory={category}
          categories={categoriesData || []}
        />
      </div>
    </main>
  );
}