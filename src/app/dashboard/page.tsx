"use client";

import { useMemberProfile } from "@/app/context/ProfileContext";
import { DashboardHeaderCard } from "./DashboardHeaderCard";
import { DashboardSubscriptionCard } from "./DashboardSubscriptionCard";
import { DashboardToolCard } from "./DashboardToolCard";
import { LastCheckInCard } from "./LastCheckInCard";
import { DashboardIntroCourseCard } from "./DashboardIntroCourseCard";
import { MemberStatus } from "@/lib/types/MemberStatus"

export default function MemberDashboard() {
  const { profile, loading, error } = useMemberProfile();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6 text-red-600">No profile found.</div>;

  const dropInDisabled = !profile.profileComplete || profile.memberStatus !== MemberStatus.New;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <DashboardHeaderCard profile={profile} />

        {/* Section: Class Enrollment */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide px-1">
            Class Enrollment
          </h2>
          {profile.memberStatus === MemberStatus.Full ? (
            <DashboardSubscriptionCard />
          ) : (
            <DashboardIntroCourseCard disabled={!profile.profileComplete} />
          )}
        </div>

        {/* Section: Tools */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold tracking-wide px-1">
            My Tools
          </h2>
          <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
            <DashboardToolCard
              label="Pay for Drop In"
              icon="dollar-sign"
              disabled={dropInDisabled}
            />
            <DashboardToolCard label="My Payments" icon="credit-card" />
            <DashboardToolCard label="My Attendance" icon="calendar-check" />
          </div>
        </div>

        {/* Section: Last Check-in */}
        <LastCheckInCard />
      </div>
    </div>
  );
}
