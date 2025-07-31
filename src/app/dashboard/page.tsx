"use client";

import { useMemberProfile } from "@/app/context/ProfileContext";
import { DashboardHeaderCard } from "./DashboardHeaderCard";
import { DashboardSubscriptionCard } from "./DashboardSubscriptionCard";
import { DashboardToolCard } from "./DashboardToolCard";
import { LastCheckInCard } from "./LastCheckInCard";

export default function MemberDashboard() {
  const { profile, loading, error } = useMemberProfile();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6 text-red-600">No profile found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <DashboardHeaderCard profile={profile} />
        <DashboardSubscriptionCard />
        <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
          <DashboardToolCard label="My Payments" icon="credit-card" />
          <DashboardToolCard label="My Attendance" icon="calendar-check" />
        </div>
        <LastCheckInCard />
      </div>
    </div>
  );
}
