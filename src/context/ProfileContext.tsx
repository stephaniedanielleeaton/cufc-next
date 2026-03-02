"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { MemberProfileFormInput } from "@/types/MemberProfileFormInput";
import type { MemberProfileDTO } from "@/types/MemberProfile";

type MemberProfileContextType = {
  profile: MemberProfileFormInput | null;
  profiles: MemberProfileDTO[];
  activeProfileId: string | null;
  setActiveProfileId: (id: string) => void;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  setProfile: React.Dispatch<React.SetStateAction<MemberProfileFormInput | null>>;
};

const MemberProfileContext = createContext<MemberProfileContextType | undefined>(undefined);

export function useMemberProfile() {
  const ctx = useContext(MemberProfileContext);
  if (!ctx) throw new Error("useMemberProfile must be used within a MemberProfileProvider");
  return ctx;
}

function toFormInput(p: MemberProfileDTO): MemberProfileFormInput {
  return { ...p, profileId: String(p._id) } as MemberProfileFormInput;
}

export function MemberProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const [profile, setProfile] = useState<MemberProfileFormInput | null>(null);
  const [profiles, setProfiles] = useState<MemberProfileDTO[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfiles([]);
      setActiveProfileId(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members/me");
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      const fetchedProfiles: MemberProfileDTO[] = data.profiles ?? [];
      setProfiles(fetchedProfiles);
      setActiveProfileId((prev) => {
        if (prev && fetchedProfiles.some((p) => String(p._id) === prev)) return prev;
        return fetchedProfiles[0] ? String(fetchedProfiles[0]._id) : null;
      });
      const primary = fetchedProfiles[0] ?? null;
      setProfile(primary ? toFormInput(primary) : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setProfile(null);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!activeProfileId || profiles.length === 0) return;
    const active = profiles.find((p) => String(p._id) === activeProfileId);
    if (active) setProfile(toFormInput(active));
  }, [activeProfileId, profiles]);

  return (
    <MemberProfileContext.Provider
      value={{
        profile,
        profiles,
        activeProfileId,
        setActiveProfileId,
        loading,
        error,
        refreshProfile: fetchProfile,
        setProfile,
      }}
    >
      {children}
    </MemberProfileContext.Provider>
  );
}
