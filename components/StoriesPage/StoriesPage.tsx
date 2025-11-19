'use client';

import axios from 'axios';
import TravellersStories, {
  FetchResult,
} from '@/components/TravellersStories/TravellersStories';
import { Story, mapStory } from '@/types/story';

interface Props {
  initialStories: Story[];
  initialHasMore: boolean;
}

export default function StoriesClient({
  initialStories,
  initialHasMore,
}: Props) {
  const loadAllStories = async (
    page: number,
    limit: number
  ): Promise<FetchResult | null> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_DATA_URL}/api/stories`,
        { params: { page, limit } } 
      );

      const data = res.data.data || res.data;
      const storiesList = data.stories || data.data || [];

      return {
        data: storiesList.map(mapStory),
        hasNextPage: data.hasNextPage,
      };
    } catch (error) {
      console.error('Failed to load stories:', error);
      return null;
    }
  };

  return (
    <TravellersStories
      initialStories={initialStories}
      initialHasMore={initialHasMore}
      fetchNextPage={loadAllStories}
    />
  );
}
