import axios from 'axios';

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '',
});

import { apiClient } from './api';
// import type { Story } from "@/types/story";
import type { User } from '@/types/user';
import { cookies } from 'next/headers';

// === АВТЕНТИФІКАЦІЯ ===
export const getCurrentUser = async (): Promise<User | null> => {
  const cookieStore = await cookies();
  try {
    const { data } = await apiClient.get<User>('/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch {
    return null;
  }
};

export const checkServerSession = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};

// === ІСТОРІЇ ===
// export interface PaginatedStoriesResponse {
//   data: Story[];
//   totalPages: number;
//   totalItems: number;
//   page: number;
//   perPage: number;
//   hasNextPage?: boolean;
//   hasPreviousPage?: boolean;
// }

// interface GetStoriesParams {
//   page?: number;
//   perPage?: number;
//   category?: string;
//   authorId?: string;
// }

// export const getStoriesServer = async ({
//   page = 1,
//   perPage = 9,
//   category,
//   authorId,
// }: GetStoriesParams = {}): Promise<PaginatedStoriesResponse> => {
//   const cookieStore = await cookies();

//   const params: Record<string, string | number> = { page, perPage };
//   if (category) params.category = category;
//   if (authorId) params.authorId = authorId;

//   const { data } = await apiClient.get<PaginatedStoriesResponse>("/stories", {
//     params,
//     headers: {
//       Cookie: cookieStore.toString(),
//     },
//   });

//   return data;
// };

// interface GetPopularParams {
//   page?: number;
//   limit?: number;
// }

// export const getPopularStoriesServer = async ({
//   page = 1,
//   limit = 3,
// }: GetPopularParams = {}): Promise<Story[]> => {
//   const cookieStore = await cookies();

//   const { data } = await apiClient.get<{ stories: Story[] }>(
//     "/stories/popular",
//     {
//       params: { page, limit },
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     }
//   );

//   return data.stories;
// };

// export const getStoryByIdServer = async (id: string): Promise<Story | null> => {
//   const cookieStore = await cookies();
//   try {
//     const { data } = await apiClient.get<Story>(`/stories/${id}`, {
//       headers: {
//         Cookie: cookieStore.toString(),
//       },
//     });
//     return data;
//   } catch {
//     return null;
//   }
// };
