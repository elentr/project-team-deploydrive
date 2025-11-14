import { apiClient } from './api';
import type { User } from '@/types/user';

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