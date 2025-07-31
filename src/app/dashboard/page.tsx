"use client";

import { useMemberProfile } from "@/app/context/ProfileContext";
import Link from "next/link";
import { AlertCircle, UserCircle } from "lucide-react";
import { SquareButton } from "@/components/common/SquareButton";
import { useEffect, useState } from "react";

function LastCheckInCard() {
  const [lastCheckIn, setLastCheckIn] = useState<null | { timestamp: string }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastCheckIn() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/member/last-checkin");
        const data = await res.json();
        if (res.ok && data.lastCheckIn) {
          setLastCheckIn(data.lastCheckIn);
        } else {
          setLastCheckIn(null);
        }
      } catch (err) {
        setError("Failed to load check-in history.");
      } finally {
        setLoading(false);
      }
    }
    fetchLastCheckIn();
  }, []);

  let content;
  if (loading) {
    content = <div className="text-gray-500">Loading...</div>;
  } else if (error) {
    content = <div className="text-red-600">{error}</div>;
  } else if (!lastCheckIn) {
    content = <div className="text-gray-500">No check-in records found.</div>;
  } else {
    const date = new Date(lastCheckIn.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    content = (
      <>
        <p>Date: <span className="font-medium">{dateStr}</span></p>
        <p>Time: <span className="font-medium">{timeStr}</span></p>
      </>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 pt-8">
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide mb-6">Last Check-In</h2>
      <div className="text-gray-700 space-y-2">
        {content}
      </div>
    </div>
  );
}


export default function MemberDashboard() {
  const { profile, loading, error } = useMemberProfile();

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!profile) return <div className="p-6 text-red-600">No profile found.</div>;

  const displayName = profile.displayFirstName && profile.displayLastName
    ? `${profile.displayFirstName} ${profile.displayLastName}`
    : profile.personalInfo?.legalFirstName && profile.personalInfo?.legalLastName
    ? `${profile.personalInfo.legalFirstName} ${profile.personalInfo.legalLastName}`
    : "Member";

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-6 space-y-10 divide-y divide-gray-200">
        <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900 tracking-wide">Welcome, {displayName}!</h1>
          </div>

          {!profile.profileComplete && (
            <div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 px-4 py-3 rounded-md">
              <AlertCircle className="text-yellow-500 mt-0.5" size={24} />
              <span className="text-sm">
                Your profile is incomplete. <Link href="/profile" className="underline font-medium hover:text-yellow-600">Update your profile to continue.</Link>
              </span>
            </div>
          )}

          <div>
            <SquareButton href="/profile" variant="navy">
              Update Profile
            </SquareButton>
          </div>
        </div>

        {profile.profileComplete && (
          profile.hasCompletedIntro ? (
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 pt-8">
              <h2 className="text-xl font-semibold text-gray-800 tracking-wide mb-6">Payment Options</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider">Drop-In Class</h3>
                  <SquareButton href="#" variant="white">
                    Drop-In
                  </SquareButton>
                </div>
                <div className="space-y-3">
                  <h3 className="text-md font-medium text-gray-700 uppercase tracking-wider">Monthly Membership</h3>
                  <SquareButton href="#" variant="navy">
                    Subscribe
                  </SquareButton>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-6">(Payment integration coming soon)</p>
            </div>
          ) : (
            <div className="bg-white border border-yellow-300 shadow-md rounded-lg p-6 pt-8 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                <AlertCircle className="text-yellow-500" size={24} />
                Complete Your Intro Course
              </h2>
              <p className="text-gray-700 mb-4">You must complete our Intro Course before you can pay for classes or sign up for membership.</p>
              <SquareButton href="#" variant="medium-pink" disabled>
                Enroll
              </SquareButton>
            </div>
          )
        )}

        <LastCheckInCard />
      </div>
    </div>
  );
}
