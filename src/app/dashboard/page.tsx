"use client";

import { useMemberProfile } from "@/app/context/ProfileContext";
import { DashboardWelcomeCard } from "./DashboardWelcomeCard";
import { DashboardPaymentOptionsCard } from "./DashboardPaymentOptionsCard";
import { DashboardIntroCourseCard } from "./DashboardIntroCourseCard";
import { LastCheckInCard } from "./LastCheckInCard";

export default function MemberDashboard() {
  const { profile, loading, error } = useMemberProfile();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6 text-red-600">No profile found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6 space-y-10 divide-y divide-gray-200">
        <DashboardWelcomeCard profile={profile} />
        {profile.profileComplete && (
          profile.hasCompletedIntro ? (
            <DashboardPaymentOptionsCard />
          ) : (
            <DashboardIntroCourseCard />
          )
        )}
        <LastCheckInCard />
      </div>
    </div>
  );
}
