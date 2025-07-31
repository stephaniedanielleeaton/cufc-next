import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { SquareButton } from "@/components/common/SquareButton";
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
  );
}
