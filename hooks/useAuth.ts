// hooks/useAuth.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/clientApi";

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    isError,
  };
};
