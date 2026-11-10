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
    // Treat SSR data as stale immediately so client fetches fresh data on mount
    // (needed so admin boost/unboost changes show up without 5-min cache delay)
    initialDataUpdatedAt: 0,
    staleTime: 0, // Always stale — always fetch fresh on mount
    refetchOnMount: true, // Always fetch on mount (SSR data is just a placeholder)
    refetchOnWindowFocus: true, // Refetch when switching back from admin panel to homepage
    retry: 1,
  });
}
