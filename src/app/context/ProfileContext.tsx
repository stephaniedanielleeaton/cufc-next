"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
  } from "react";
  import { useUser } from "@auth0/nextjs-auth0";
  import { MemberProfileFormInput } from "@/components/ProfileForm"; // Or your canonical type
  
  type MemberProfileContextType = {
    profile: MemberProfileFormInput | null;
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
  
  export function MemberProfileProvider({ children }: { children: ReactNode }) {
    const { user } = useUser();
    const [profile, setProfile] = useState<MemberProfileFormInput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    const fetchProfile = useCallback(async () => {
      console.log("Current user:", user);
      if (!user) {
        setProfile(null);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/member/me");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        console.log("Fetched profile data:", data);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }, [user]);
  
    useEffect(() => {
      fetchProfile();
    }, [fetchProfile, user]);
  
    return (
      <MemberProfileContext.Provider
        value={{
          profile,
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