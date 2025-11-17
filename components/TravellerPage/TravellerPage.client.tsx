'use client';

import css from './TravellerPage.module.css';
import { TravellerClientProps } from '@/types/traveller';
import TravellerInfo from '../TravellerInfo/TravellerInfo';
import MessageNoStories from '../MessageNoStories/MessageNoStories';
import TravellersStories from '../TravellersStories/TravellersStories';

export default function TravellerPageClient({
  initialTraveller,
  initialStories,
}: TravellerClientProps) {
  return (
    <>
      <TravellerInfo
        traveller={{
          name: initialTraveller.name,
          photo: initialTraveller.avatarUrl ?? '/images/avatar.png',
          info: initialTraveller.description,
        }}
      />

      <div className={css.container}>
        <h2 className={css.title}>Історії Мандрівника</h2>

        {initialStories.length > 0 ? (
          <TravellersStories stories={initialStories} />
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
