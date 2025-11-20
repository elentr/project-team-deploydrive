//lib/api/api.ts

import axios from 'axios';

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = nextServer
      .post('/auth/refresh')
      .then(res => {
        const token = res.data.data?.accessToken;
        if (!token) throw new Error('Invalid refresh response');

        localStorage.setItem('accessToken', token);
        return token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

nextServer.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ЛОВИМ 401/498 И ОБНОВЛЯЕМ ТОКЕН
nextServer.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // 498 — токен устарел
    // 401 — токен плохой
    if (
      (error.response?.status === 498 || error.response?.status === 401) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return nextServer(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
