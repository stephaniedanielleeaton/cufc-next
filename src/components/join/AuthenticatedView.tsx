"use client";

import { useMemberProfile } from "@/app/context/ProfileContext";
import Link from "next/link";

interface AuthenticatedViewProps {
  userName?: string;
}

export function AuthenticatedView({ userName }: AuthenticatedViewProps) {
  const { profile, loading, error } = useMemberProfile();
  const profileComplete = profile?.profileComplete ?? false;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medium-pink"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">Could not load your profile information. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!profileComplete) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Complete Your Profile</h1>
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h2 className="text-xl font-semibold mb-2">Profile Completion Required</h2>
            <p className="mb-4">
              Before you can continue, please complete your profile.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link 
              href="/profile"
              className="bg-medium-pink hover:bg-dark-red text-white font-bold py-2 px-6 rounded-md transition duration-300"
            >
              Complete Your Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Membership Application</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <p className="text-lg mb-4">
          Welcome, {userName}! This is a placeholder for the membership application form.
        </p>
        <p>
          In the future, this page will contain a form to complete your membership application.
        </p>
      </div>
    </div>
  );
}
