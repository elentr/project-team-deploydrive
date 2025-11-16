import { apiClient } from './api';
import type { User } from '@/types/user';
import axios from "axios";

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
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "https://travellers-node.onrender.com";

export const clientApi = axios.create({
  baseURL,
});

clientApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
