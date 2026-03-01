"use client";

import { useMemberProfile } from "@/context/ProfileContext";
import { DashboardHeaderCard } from "../../components/dashboard/DashboardHeaderCard";
import { DashboardSubscriptionCard } from "../../components/dashboard/DashboardSubscriptionCard";
import { DashboardToolCard } from "../../components/dashboard/DashboardToolCard";
import { LastCheckInCard } from "../../components/dashboard/LastCheckInCard";
import { DashboardIntroCourseCard } from "../../components/dashboard/DashboardIntroCourseCard";
import { MemberStatus } from "@/types/MemberStatus";
import { useState } from "react";
import { IntroClassOfferings } from "@/components/intro-classes/IntroClassOfferings";
import ProfileForm from "@/components/profile/ProfileForm";

export default function MemberDashboard() {
  const { profile, loading, error } = useMemberProfile();
  const [showIntroClasses, setShowIntroClasses] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6 text-red-600">No profile found.</div>;

  const dropInDisabled = !profile.profileComplete || profile.memberStatus !== MemberStatus.New;
  
  const handleShowIntroClasses = () => {
    setShowIntroClasses(true);
    setShowProfileEdit(false);
  };
  
  const handleShowProfileEdit = () => {
    setShowProfileEdit(true);
    setShowIntroClasses(false);
  };
  
  const handleBackToDashboard = () => {
    setShowIntroClasses(false);
    setShowProfileEdit(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-md mx-auto px-4 space-y-6">
        <DashboardHeaderCard 
          profile={profile} 
          onEditProfile={handleShowProfileEdit}
        />
        
        {showIntroClasses ? (
          <>
            <div className="mb-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center text-sm text-navy hover:text-medium-pink transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            <IntroClassOfferings />
          </>
        ) : showProfileEdit ? (
          <>
            <div className="mb-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center text-sm text-navy hover:text-medium-pink transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </button>
            </div>
            <div className="space-y-6">
              <ProfileForm member={profile} />
            </div>
          </>
        ) : (
          <>
            {/* Section: Class Enrollment */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold tracking-wide px-1">
                Class Enrollment
              </h2>
              {profile.memberStatus === MemberStatus.Full ? (
                <DashboardSubscriptionCard />
              ) : (
                <DashboardIntroCourseCard 
                  disabled={!profile.profileComplete} 
                  onEnroll={handleShowIntroClasses}
                />
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
            <div className="space-y-2">
              <h2 className="text-sm font-semibold tracking-wide px-1">
                Last Check-in
              </h2>
              <LastCheckInCard />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
