// lib/api/clientApi.ts
import { apiClient } from "./api";
import type { User } from "@/types/user";

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => apiClient.post<User>("/auth/register", data).then((r) => r.data);

export const login = (data: { email: string; password: string }) =>
  apiClient.post<User>("/auth/login", data).then((r) => r.data);

export const logout = () => apiClient.post("/auth/logout");

export const getMe = (): Promise<User> =>
  apiClient.get<User>("/users/me").then((r) => r.data);

export const checkSession = async (): Promise<boolean> => {
  try {
    await apiClient.get("/users/me");
    return true;
  } catch {
    return false;
  }
};
