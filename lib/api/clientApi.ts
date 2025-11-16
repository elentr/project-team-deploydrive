import { apiClient } from "./api";
import type { User } from "@/types/user";

export const authService = {
  async getSession(): Promise<User | null> {
    try {
      const { data } = await apiClient.get("/users/me/profile");
      return data;
    } catch {
      return null;
    }
  },
};

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export const checkSession = async () => {
  const response = await apiClient.get<CheckSessionRequest>("/auth/session");
  return response.data.success;
};

export const register = async (data: RegisterRequest): Promise<User> => {
  const response = await apiClient.post<User>("/auth/register", data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const response = await apiClient.post<User>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const getMe = async () => {
  const { data } = await apiClient.get<User>("/users/me");
  return data;
};
