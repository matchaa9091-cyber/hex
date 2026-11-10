"use client";

import { ProfileType } from "@/types/profile";
import { useQuery } from "@tanstack/react-query";
import { sortAndShuffleProfiles } from "@/data/allProfiles";

async function fetchLiveProfiles(seed?: string): Promise<ProfileType[]> {
  const res = await fetch("/api/profiles", {
    signal: AbortSignal.timeout(6000),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch profiles: ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No profiles returned from API");
  }
  return seed ? sortAndShuffleProfiles(data, seed) : data;
}

export function useAllProfiles(initialData?: ProfileType[], seed?: string) {
  const hasInitial = Array.isArray(initialData) && initialData.length > 0;

  return useQuery<ProfileType[]>({
    queryKey: ["all-profiles", seed],
    queryFn: () => fetchLiveProfiles(seed),
    initialData: hasInitial ? initialData : undefined,
    // Treat SSR data as fresh so client doesn't immediately double-render/lag on mount
    initialDataUpdatedAt: hasInitial ? () => Date.now() : 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnMount: !hasInitial, // Only fetch on mount if no initial SSR data was provided
    refetchOnWindowFocus: false, // Prevent UI stuttering when switching tabs
    retry: 1,
  });
}
