"use client";

import Link from "next/link";
import { ProfileGrid } from "@/components/profiles/ProfileGrid";
import { useAllProfiles } from "@/hooks/use-all-profiles";
import { getProfileType, PROFILE_TYPE_OPTIONS, PROFILE_TYPE_PAGES } from "@/lib/profile-type";
import type { ProfileCategoryType, ProfileType } from "@/types/profile";

interface ProfileTypePageProps {
  profileType: ProfileCategoryType;
  initialProfiles?: ProfileType[];
  shuffleSeed?: string;
}

const ProfileTypePage = ({ profileType, initialProfiles = [], shuffleSeed }: ProfileTypePageProps) => {
  const page = PROFILE_TYPE_PAGES[profileType];
  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = queryProfiles && queryProfiles.length > 0 ? queryProfiles : initialProfiles;
  const matchingProfiles = allProfiles.filter((profile) => getProfileType(profile) === profileType);

  return (
    <div className="pt-[76px] sm:pt-[84px] lg:pt-6 min-h-screen bg-black">
      <div className="container mx-auto px-4">
        <div className="mb-8 rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-500/10 to-transparent p-8 text-center">
          <h1 className="mb-4 text-3xl font-bold text-pink-500 lg:text-5xl">{page.heading}</h1>
          <p className="mx-auto max-w-2xl text-gray-400">{page.intro}</p>
        </div>

        <ProfileGrid
          profiles={matchingProfiles}
          title={page.gridTitle}
          loading={allProfiles.length === 0}
        />

        {allProfiles.length > 0 && matchingProfiles.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-xl text-pink-500/60">{page.empty}</p>
            <Link href="/directory" prefetch={false} className="mt-4 inline-block text-primary hover:underline">
              Browse the full directory
            </Link>
          </div>
        )}

        <section className="mt-12 rounded-2xl border border-gray-800 bg-gray-950/60 p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Browse by profile type</h2>
          <div className="flex flex-wrap gap-2">
            {PROFILE_TYPE_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={PROFILE_TYPE_PAGES[option.value].path}
                prefetch={false}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  option.value === profileType
                    ? "border-pink-500 bg-pink-600 text-white"
                    : "border-gray-800 bg-gray-900 text-gray-300 hover:border-pink-500/40 hover:text-pink-300"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileTypePage;
