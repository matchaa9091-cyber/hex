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
    // Setting initialDataUpdatedAt: 0 tells TanStack Query:
    // Display initialData immediately for 0ms paint, but treat it as needing revalidation,
    // so immediately fetch fresh data from /api/profiles in the background!
    initialDataUpdatedAt: 0,
    staleTime: 30000, // 30s cache once fetched
    refetchOnMount: true, // Always revalidate on mount
    refetchOnWindowFocus: true, // Auto-update when returning to tab after admin edits
    retry: 1,
  });
}
