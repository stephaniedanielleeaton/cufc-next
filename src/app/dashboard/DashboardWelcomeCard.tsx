import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { MemberProfileFormInput } from "@/types/MemberProfileFormInput";

export function DashboardWelcomeCard({ profile }: { profile: MemberProfileFormInput }) {
  const displayName = profile.displayFirstName && profile.displayLastName
    ? `${profile.displayFirstName} ${profile.displayLastName}`
    : profile.personalInfo?.legalFirstName && profile.personalInfo?.legalLastName
    ? `${profile.personalInfo.legalFirstName} ${profile.personalInfo.legalLastName}`
    : "Member";

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
          Welcome, {displayName}!
        </h1>
      </div>

      {!profile.profileComplete && (
        <div className="flex items-start gap-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-900 px-4 py-3 rounded-md">
          <AlertCircle className="text-yellow-500 mt-0.5" size={24} />
          <span className="text-sm">
            Your profile is incomplete.{" "}
            <Link
              href="/profile"
              className="underline font-medium hover:text-yellow-600"
            >
              Update your profile
            </Link>{" "}
            to continue.
          </span>
        </div>
      )}

      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>Email:</strong> {profile.personalInfo?.email || "—"}</p>
        <div className="text-right pt-2">
          <Link
            href="/profile"
            className="text-sm text-navy font-medium hover:underline inline-flex items-center gap-1"
          >
            <span>Go to Profile</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
