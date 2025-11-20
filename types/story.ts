//types/story.ts

import { User } from './user';

// Основная сущность истории
export interface Story {
  _id: string;
  title: string;
  category: Category;
  article: string;
  img: string;
  ownerId: Owner;
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
