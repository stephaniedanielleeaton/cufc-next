"use client";

import { useUser } from "@auth0/nextjs-auth0";
import { useMemberProfile } from "@/app/context/ProfileContext";
import ProfileForm from "@/components/profile/ProfileForm";
import  { ProfileHeader }  from "@/components/profile/ProfileHeader";

export default function ProfilePage() {
  const { user, isLoading: userLoading } = useUser();
  const { profile, loading, error } = useMemberProfile();

  if (userLoading || loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <p>Please log in to view your profile.</p>
        <a href="/auth/login" className="text-blue-600 underline">Log In</a>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  if (!profile) {
    return <div className="p-6 text-red-600">No profile found for your account.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <ProfileHeader />
        <ProfileForm member={profile} />
      </div>
    </div>
  );
}
