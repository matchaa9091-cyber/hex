"use client";

import { ProfileType } from "@/types/profile";
import { fetchAllProfiles } from "@/data/allProfiles";
import { useQuery } from "@tanstack/react-query";

export function useAllProfiles(initialData?: ProfileType[], seed?: string) {
  return useQuery({
    queryKey: ["all-profiles", seed],
    queryFn: async () => {
      return fetchAllProfiles(seed);
    },
    initialData,
    staleTime: 60000, // 1 minute in-memory cache for silky smooth instant navigation
    refetchOnWindowFocus: false,
  });
}
