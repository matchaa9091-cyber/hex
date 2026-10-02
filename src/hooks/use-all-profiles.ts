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
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
