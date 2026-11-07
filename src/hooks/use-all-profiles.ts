"use client";

import { ProfileType } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import { sortAndShuffleProfiles } from "@/data/allProfiles";

async function fetchLiveProfiles(seed?: string): Promise<ProfileType[]> {
  try {
    const res = await fetch("/api/profiles", {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return [];
    return seed ? sortAndShuffleProfiles(data, seed) : data;
  } catch (err) {
    console.warn("fetchLiveProfiles error:", err);
    return [];
  }
}

export function useAllProfiles(initialData?: ProfileType[], seed?: string) {
  const hasInitial = Array.isArray(initialData) && initialData.length > 0;

  return useQuery<ProfileType[]>({
    queryKey: ["all-profiles", seed],
    queryFn: () => fetchLiveProfiles(seed),
    initialData: hasInitial ? initialData : undefined,
    staleTime: 60000, // 1 minute in-memory cache
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
