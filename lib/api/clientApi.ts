// lib/api/clientApi.ts
'use client';

import type { User } from '@/types/user';
import type { Traveller, TravellersPage } from '@/types/traveller';
import type {
  Story,
  StoriesResponse,
  StoryFavoriteResponse,
  Category,
} from '@/types/story';
import type { ApiResponse } from '@/types/api';

import { nextServer } from '@/lib/api/api';
import { NextServer } from 'next/dist/server/next';

type VerifyEmailResponse = {
  message: string;
};

// AUTH TYPES
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  user: User;
}

// AUTH LOGIC

export const register = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<ApiResponse<AuthResponseData>>(
    '/auth/register',
    data
  );

  const payload = res.data.data;
  if (!payload) throw new Error('Invalid register response');

  localStorage.setItem('accessToken', payload.accessToken);

  return payload.user;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<ApiResponse<AuthResponseData>>(
    '/auth/login',
    data
  );

  const payload = res.data.data;
  if (!payload) throw new Error('Invalid login response');

  localStorage.setItem('accessToken', payload.accessToken);

  return payload.user;
};

export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout');
  localStorage.removeItem('accessToken');
};

export const refreshSession = async (): Promise<string | null> => {
  try {
    const res =
      await nextServer.post<ApiResponse<{ accessToken: string }>>(
        '/auth/refresh'
      );

    const token = res.data.data?.accessToken;
    if (!token) return null;

    localStorage.setItem('accessToken', token);
    return token;
  } catch {
    return null;
  }
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const res = await nextServer.post('/auth/refresh');
    const token = res.data.data?.accessToken;

    if (token) {
      localStorage.setItem('accessToken', token);
    }

    return true;
  } catch {
    return false;
  }
};

// USER API

export const getMe = async (): Promise<User> => {
  const res = await nextServer.get<ApiResponse<User>>('/users/me');

  if (!res.data.data) throw new Error('User not found');
  return res.data.data;
};

// Get travellers list
export const getAllTravelers = async (): Promise<Traveller[]> => {
  const response = await nextServer.get<ApiResponse<TravellersPage>>('/users', {
    params: { page: 1 },
  });

  return response.data.data.data ?? [];
};

export const updateUserProfile = async (formData: FormData): Promise<User> => {
  const res = await nextServer.patch<ApiResponse<User>>('/users/me', formData);

  if (!res.data.data) {
    throw new Error('Update failed');
  }

  return res.data.data;
};

export const sendVerifyEmail = async (newEmail: string): Promise<string> => {
  const res = await nextServer.post<ApiResponse<VerifyEmailResponse>>(
    '/auth/email/verify-change',
    { email: newEmail }
  );

  return res.data.data.message;
};

// STORIES API

export const createStory = async (formData: FormData): Promise<Story> => {
  const res = await nextServer.post<ApiResponse<Story>>('/stories', formData);

  if (!res.data.data) throw new Error('Create story failed');
  return res.data.data;
};

export const updateStory = async (
  storyId: string,
  formData: FormData
): Promise<Story> => {
  const res = await nextServer.patch<ApiResponse<Story>>(
    `/stories/${storyId}`,
    formData
  );

  if (!res.data.data) throw new Error('Update story failed');
  return res.data.data;
};

export const getStory = async (storyId: string): Promise<Story> => {
  const res = await nextServer.get<ApiResponse<Story>>(`/stories/${storyId}`);

  if (!res.data.data) throw new Error('Story not found');
  return res.data.data;
};

export const getAllStories = async (
  page: number,
  perPage: number,
  category?: string,
  sortOrder?: string,
  sortBy?: string
): Promise<ApiResponse<StoriesResponse>> => {
  const response = await nextServer.get<ApiResponse<StoriesResponse>>(
    '/stories',
    {
      params: {
        page,
        perPage,
        filter: category ? { category } : { category: 'ALL' },
        sortOrder: sortOrder || '',
        sortBy: sortBy || '',
      },
    }
  );

  return response.data;
};

// CATEGORIES
export const getCategories = async (): Promise<Category[]> => {
  const res = await nextServer.get<ApiResponse<Category[]>>('/categories');
  return res.data.data ?? [];
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await nextServer.get<ApiResponse<User>>('/users/me');
  return res.data.data as User;
};

// Добавить историю в избранное
export const addStoryToSave = async (storyId: string) => {
  const response = await nextServer.post(`/users/me/saved/${storyId}`);
  return response.data;
};

// Удалить историю из избранного
export const removeStoryFromSave = async (storyId: string) => {
  const response = await nextServer.delete(`/users/me/saved/${storyId}`);
  return response.data;
};

// Добавить историю в избранное
export async function favouriteAdd(storyId: string): Promise<Story> {
  const r = await nextServer.post(`/stories/${storyId}/favorite`);
  return r.data.data.story;
}

// Убрать историю из избранного
export async function favouriteRemove(storyId: string): Promise<Story> {
  const r = await nextServer.delete(`/stories/${storyId}/favorite`);
  return r.data.data.story;
}

// Обновить количество лайков (используется в UI)
export async function updateStoryLikes(
  storyId: string,
  likes: string
): Promise<Story> {
  const r = await nextServer.patch(`/stories/${storyId}/likes`, {
    favoriteCount: likes,
  });
  return r.data.data;
}
