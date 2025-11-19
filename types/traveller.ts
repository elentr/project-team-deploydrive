import { Story } from './story';

export interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  description: string;
  articlesAmount: number;
}

export interface TravellerClientProps {
  travellerId: string;
  initialTraveller: Traveller;
  initialStories: Story[];
  initialHasNextPage: boolean;
}
