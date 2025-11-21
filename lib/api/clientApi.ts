import { apiClient } from './api';
import type { User } from '@/types/user';
import type { PaginatedStoriesResponse, Story } from '@/types/story';
import axios from 'axios';

export const authService = {
  async getSession(): Promise<User | null> {
    try {
      const { data } = await apiClient.get('/users/me/profile');
      return data;
    } catch {
      return null;
    }
  },
};

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_BASE_URL ||
  'https://travellers-node.onrender.com';

export const clientApi = axios.create({
  baseURL,
  withCredentials: true,
});

clientApi.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => apiClient.post<User>('/auth/register', data).then(r => r.data);

export const login = (data: { email: string; password: string }) =>
  apiClient.post<User>('/auth/login', data).then(r => r.data);

export const logout = () => apiClient.post('/auth/logout');

export const getMe = (): Promise<User> =>
  apiClient.get<User>('/users/me').then(r => r.data);

export const checkSession = async (): Promise<boolean> => {
  try {
    await apiClient.get('/users/me');
    return true;
  } catch {
    return false;
  }
};

export const getStories = (
  params: Record<string, string | number | undefined> = {}
) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v != null) sp.append(k, String(v));
  });
  return apiClient
    .get<PaginatedStoriesResponse>(`/stories${sp.toString() ? '?' + sp : ''}`)
    .then(r => r.data);
};

export const getPopularStories = (page = 1, limit = 3) =>
  apiClient
    .get<{ stories: Story[] }>(`/stories/popular?page=${page}&limit=${limit}`)
    .then(r => r.data.stories);

export const favouriteAdd = (storyId: string) => {
  return clientApi.post<{ message: string }>(`/favorites/${storyId}`);
};

export const favouriteRemove = (storyId: string) => {
  return clientApi.delete<{ message: string }>(`/favorites/${storyId}`);
};

export const updateStoryLikes = (storyId: string, qty: string) => {
  return clientApi.patch(`/stories/${storyId}/favorite`, { qty });
};

export type AddToFavouriteResponse = { message: string };
export type UpdateFavoriteResponse = { data: { favoriteCount: number } };
