//lib/api/serverApi.ts

import { cookies } from 'next/headers';
import type { AxiosResponse } from 'axios';
import { nextServer } from '@/lib/api/api';
import type { ApiResponse } from '@/types/api';
import type { StoriesResponse } from '@/types/story';
import type { TravellersPage } from '@/types/traveller';

// REFRESH SESSION (SERVER)
export const refreshSessionOnServer = async (): Promise<AxiosResponse> => {
  const cookieStore = await cookies();

  const res = await nextServer.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  return res;
};

// STORIES — SERVER FETCH

export const getAllStoriesServer = async (
  page: number,
  perPage: number,
  category?: string,
  sortOrder?: string,
  sortBy?: string
): Promise<ApiResponse<StoriesResponse>> => {
  const endPoint = '/stories';

  const params = {
    page,
    perPage,
    filter: category ? { category } : { category: 'all' },
    sortOrder: sortOrder || '',
    sortBy: sortBy || '',
  };

  const cookieStore = await cookies();

  const response = await nextServer.get<ApiResponse<StoriesResponse>>(
    endPoint,
    {
      params,
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  return response.data;
};

// TRAVELERS — SERVER FETCH

export const getAllTravelersServer =
  async (): Promise<TravellersPage | null> => {
    try {
      const response = await nextServer.get<ApiResponse<TravellersPage>>(
        '/users',
        {
          params: { page: 1 },
        }
      );

      return response.data.data ?? null;
    } catch (error) {
      console.error('Error fetching travelers (server):', error);
      return null;
    }
  };
