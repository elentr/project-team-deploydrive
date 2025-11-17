import { Traveller } from './traveller';

export type Category = {
  id: string;
  name: string;
};

export type CreateStoryResponse = {
  id: string;
};

export interface Story {
  _id: string;
  category: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: number;
  img: string;
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
