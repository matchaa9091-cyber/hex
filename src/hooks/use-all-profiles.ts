"use client";

import { ProfileType } from "@/types/profile";
import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { sortAndShuffleProfiles, getGlobalShuffleSeed } from "@/data/allProfiles";
import { useState, useEffect, useMemo } from "react";

// One page-level watcher for all consumers of the profiles query. It polls a
// tiny worker endpoint (no Next.js render, no D1) and refetches only when a
// profile write bumps the Durable Object generation.
let generationWatcherStarted = false;
let lastGeneration: number | null = null;

function startGenerationWatcher(queryClient: QueryClient) {
  if (generationWatcherStarted || typeof window === "undefined") return;
  generationWatcherStarted = true;

  const check = async () => {
    try {
      const res = await fetch("/api/cache-generation", {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return;
      const { generation } = await res.json();
      const value = Number(generation);
      if (!Number.isFinite(value)) return;
      if (lastGeneration !== null && value !== lastGeneration) {
        queryClient.invalidateQueries({ queryKey: ["all-profiles-raw"] });
      }
      lastGeneration = value;
    } catch {
      // Offline or transient worker hiccup: try again on the next tick.
    }
  };

  void check();
  setInterval(check, 3000);
}

async function fetchLiveProfiles(): Promise<ProfileType[]> {
  if (typeof window === "undefined") return [];
  const res = await fetch("/api/profiles", {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch profiles: ${res.status}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No profiles returned from API");
  }
  return data;
}

export function useAllProfiles(initialData?: ProfileType[], seed?: string) {
  const [currentSeed, setCurrentSeed] = useState(seed || getGlobalShuffleSeed());
  const hasInitial = Array.isArray(initialData) && initialData.length > 0;
  const queryClient = useQueryClient();

  useEffect(() => {
    startGenerationWatcher(queryClient);
  }, [queryClient]);

  // Global 12-hour reshuffle timer: continuously syncs with the worldwide 12-hour block
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSeed = getGlobalShuffleSeed();
      setCurrentSeed(prev => (prev !== nextSeed ? nextSeed : prev));
    }, 1000 * 60); // Check every 60s if the 12-hour window flipped
    return () => clearInterval(interval);
  }, []);

  const query = useQuery<ProfileType[]>({
    queryKey: ["all-profiles-raw"],
    queryFn: fetchLiveProfiles,
    initialData: hasInitial ? initialData : undefined,
    initialDataUpdatedAt: hasInitial ? Date.now() : 0,
    staleTime: 1000 * 3, // short: rely on the generation watcher for near-instant writes
    refetchOnWindowFocus: "always",
    refetchOnReconnect: true,
    retry: 1,
  });

  const baseProfiles = (query.data && query.data.length > 0) ? query.data : (initialData || []);

  // Compute shuffled order in-memory using the deterministic seed — 0 CPU, 0 network requests!
  const shuffledProfiles = useMemo(() => {
    return sortAndShuffleProfiles(baseProfiles, currentSeed);
  }, [baseProfiles, currentSeed]);

  return {
    data: shuffledProfiles,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
