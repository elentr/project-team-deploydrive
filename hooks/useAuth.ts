"use client";

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/lib/api/clientApi';

export const useAuth = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: authService.getSession,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 хвилин
  });

  return {
    isAuthenticated: !!user,
    loading: isLoading,
    user,
  };
};