export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  date: string;
  favoriteCount: number;
}

export interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string;
  description: string;
}

export interface TravellerClientProps {
  travellerId: string;
  initialTraveller: Traveller;
  initialStories: Story[];
  initialHasNextPage: boolean;
}
