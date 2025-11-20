//types/traveller.ts

export interface Traveller {
  _id: string;
  name: string;
  avatarUrl: string | null;
  description: string;
  articlesAmount: number;
}

export interface TravellersPage {
  data: Traveller[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const emptyTravelersPage: TravellersPage = {
  data: [],
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};
