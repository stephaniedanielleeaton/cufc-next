"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useMemberProfile } from "@/app/context/ProfileContext";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const { profile, loading, error } = useMemberProfile();

  if (userLoading || loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-4">
        <p>Please log in to view your profile.</p>
        <a href="/auth/login" className="text-blue-600 underline">Log In</a>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-4 text-red-600">No profile found for your account.</div>;
  }

  const displayName = profile.displayFirstName && profile.displayLastName
    ? `${profile.displayFirstName} ${profile.displayLastName}`
    : profile.personalInfo?.legalFirstName && profile.personalInfo?.legalLastName
    ? `${profile.personalInfo.legalFirstName} ${profile.personalInfo.legalLastName}`
    : "Your Profile";
    
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <ProfileForm member={profile} />
    </div>
  );
}
