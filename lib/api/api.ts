import axios from 'axios';
import { clientApi } from "./clientApi";
import type { Category, CreateStoryResponse } from "@/types/story";

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function createStory(formData: FormData): Promise<CreateStoryResponse> {
  const { data } = await clientApi.post<CreateStoryResponse>("/api/stories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await clientApi.get("/api/categories");
  return data as Category[];
}