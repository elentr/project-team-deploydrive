//types/user.ts

export interface User {
  _id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  articlesAmount: number;
  description: string;
  favouriteArticles: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
