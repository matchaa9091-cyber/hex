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
  const isSpa = profileType === "spa";
  const isAgency = profileType === "agency";
  const theme = (spaClass: string, agencyClass: string, fallback: string) =>
    isSpa ? spaClass : isAgency ? agencyClass : fallback;
  const pillClass = (value: ProfileCategoryType) => {
    if (isSpa) {
      return value === profileType ? "spa-executive-pill-active" : "spa-executive-pill";
    }
    if (isAgency) {
      return value === profileType ? "agency-executive-pill-active" : "agency-executive-pill";
    }
    return value === profileType
      ? "border-pink-500 bg-pink-600 text-white"
      : "border-gray-800 bg-gray-900 text-gray-300 hover:border-pink-500/40 hover:text-pink-300";
  };
  const { data: queryProfiles } = useAllProfiles(initialProfiles, shuffleSeed);
  const allProfiles = queryProfiles && queryProfiles.length > 0 ? queryProfiles : initialProfiles;
  const matchingProfiles = allProfiles.filter((profile) => getProfileType(profile) === profileType);

  return (
    <div className={`pt-[76px] sm:pt-[84px] lg:pt-6 min-h-screen ${theme("spa-executive-surface", "agency-executive-surface", "bg-black")}`}>
      <div className="container mx-auto px-4">
        <div className={`mb-8 rounded-2xl border p-8 text-center ${theme("spa-executive-hero", "agency-executive-hero", "border-pink-500/20 bg-gradient-to-b from-pink-500/10 to-transparent")}`}>
          <h1 className={`mb-4 text-3xl font-bold lg:text-5xl ${theme("spa-executive-title", "agency-executive-title", "text-pink-500")}`}>{page.heading}</h1>
          <p className={`mx-auto max-w-2xl ${theme("spa-executive-lede", "agency-executive-lede", "text-gray-400")}`}>{page.intro}</p>
        </div>

        <ProfileGrid
          profiles={matchingProfiles}
          title={page.gridTitle}
          loading={allProfiles.length === 0}
        />

        {allProfiles.length > 0 && matchingProfiles.length === 0 && (
          <div className="py-20 text-center">
            <p className={`text-xl ${theme("spa-executive-empty", "agency-executive-empty", "text-pink-500/60")}`}>{page.empty}</p>
            <Link href="/directory" prefetch={false} className="mt-4 inline-block text-primary hover:underline">
              Browse the full directory
            </Link>
          </div>
        )}

        <section className={`mt-12 rounded-2xl border p-6 ${theme("spa-executive-panel", "agency-executive-panel", "border-gray-800 bg-gray-950/60")}`}>
          <h2 className={`mb-4 text-lg font-bold ${theme("spa-executive-heading", "agency-executive-heading", "text-white")}`}>Browse by profile type</h2>
          <div className="flex flex-wrap gap-2">
            {PROFILE_TYPE_OPTIONS.map((option) => (
              <Link
                key={option.value}
                href={PROFILE_TYPE_PAGES[option.value].path}
                prefetch={false}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${pillClass(option.value)}`}
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
