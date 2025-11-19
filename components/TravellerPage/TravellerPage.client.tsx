'use client';

import css from './TravellerPage.module.css';
import { TravellerClientProps } from '@/types/traveller';
import TravellerInfo from '../TravellerInfo/TravellerInfo';
import MessageNoStories from '../MessageNoStories/MessageNoStories';
import TravellersStories, {
  FetchResult,
} from '../TravellersStories/TravellersStories';
import axios from 'axios';
import { mapStory } from '@/types/story';

export default function TravellerPageClient({
  travellerId,
  initialTraveller,
  initialStories,
  initialHasNextPage,
}: TravellerClientProps) {
  const travellers = [initialTraveller];

  const loadTravellerStories = async (
    page: number,
    limit: number
  ): Promise<FetchResult | null> => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/${travellerId}`,
        { params: { page, perPage: limit } }
      );

      const storiesData = res.data.data.stories;

      return {
        data: storiesData.data.map(mapStory),
        hasNextPage: storiesData.hasNextPage,
      };
    } catch (error) {
      console.error('Failed to load traveller stories:', error);
      return null;
    }
  };

  return (
    <>
      <TravellerInfo
        traveller={{
          name: initialTraveller.name,
          photo: initialTraveller.avatarUrl ?? '/images/avatar.webp.webp',
          info: initialTraveller.description,
        }}
      />

      <div className={css.container}>
        <h2 className={css.title}>Історії Мандрівника</h2>

        {initialStories.length > 0 ? (
          <TravellersStories
            initialStories={initialStories}
            initialHasMore={initialHasNextPage}
            travellers={travellers}
            fetchNextPage={loadTravellerStories}
          />
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
