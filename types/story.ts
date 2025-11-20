//types/story.ts

import { User } from './user';

// Основная сущность истории
export interface Story {
  _id: string;
  title: string;
  category: Category;
  article: string;
  img: string;
  owner: Owner;
  date: string;
  favoriteCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Пагинация для историй
export interface StoriesResponse {
  data: Story[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Ответ на добавление в избранное
export interface StoryFavoriteResponse {
  user: User;
  story: Story;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Категория
export interface Category {
  _id: string;
  name: string;
}

// Владелец истории
export interface Owner {
  _id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ApiStory {
  _id: string;
  title: string;
  article: string;
  img: string;

  date?: string;
  createdAt?: string;
  updatedAt?: string;

  favoriteCount?: number;

  category?: {
    _id: string;
    name: string;
  };

  owner?: {
    _id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export function mapStory(apiStory: ApiStory): Story {
  return {
    _id: apiStory._id,
    title: apiStory.title,
    article: apiStory.article,
    img: apiStory.img,
    date: apiStory.date || apiStory.createdAt || '',
    favoriteCount: apiStory.favoriteCount ?? 0,

    category: {
      _id: apiStory.category?._id || '',
      name: apiStory.category?.name || '',
    },

    owner: {
      _id: apiStory.owner?._id || '',
      name: apiStory.owner?.name || '',
      avatarUrl: apiStory.owner?.avatarUrl || null,
    },

    createdAt: apiStory.createdAt,
    updatedAt: apiStory.updatedAt,
  };
}

export type CreateStoryResponse = {
  id: string;
};
