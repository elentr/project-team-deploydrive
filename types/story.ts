export type Category = {
  id: string;
  name: string;
};

export type CreateStoryResponse = {
  id: string;
};

export type ApiStory = {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount: number;
};

export interface Story {
  _id: string;
  img: string;
  title: string;
  article: string;
  category: string;
  ownerId: string;
  date: string;
  favoriteCount?: number;
  description: string;
  author: string;
  readTime: number;
  avatar?: string;
}

export type PaginatedStoriesResponse = {
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  data: Story[];
};

export const mapStory = (s: ApiStory): Story => ({
  _id: s._id,
  title: s.title,
  img: s.img,
  article: s.article,
  category: s.category,
  date: s.date,
  ownerId: s.ownerId,
  favoriteCount: s.favoriteCount,

  description:
    s.article.length > 200 ? s.article.slice(0, 200) + '...' : s.article,

  author: 'Автор',
  readTime: 1,
  avatar: '/images/avatar.png',
});
