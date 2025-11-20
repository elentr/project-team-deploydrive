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
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://travellers-node.onrender.com';
  const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
  const apiPath = baseUrl.endsWith('/api') ? '/stories' : '/api/stories';
  const url = `${baseUrl}${apiPath}`;
  
  const { data } = await clientApi.post<CreateStoryResponse>(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchCategories(): Promise<Category[]> {
  const API = process.env.NEXT_PUBLIC_API_URL || 'https://travellers-node.onrender.com';
  const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
  const apiPath = baseUrl.endsWith('/api') ? '/categories' : '/api/categories';
  const url = `${baseUrl}${apiPath}`;
  
  const { data } = await clientApi.get(url);
  
  if (Array.isArray(data)) {
    return data as Category[];
  } else if (data.data && Array.isArray(data.data)) {
    return data.data as Category[];
  } else if (data.categories && Array.isArray(data.categories)) {
    return data.categories as Category[];
  }
  
  return [];
}