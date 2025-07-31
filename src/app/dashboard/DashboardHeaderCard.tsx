import Image from "next/image";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import { MemberProfileFormInput } from "@/types/MemberProfileFormInput";

export function DashboardHeaderCard({ profile }: { profile: MemberProfileFormInput }) {
  const { user } = useUser();

  const displayName = profile.displayFirstName && profile.displayLastName
    ? `${profile.displayFirstName} ${profile.displayLastName}`
    : profile.personalInfo?.legalFirstName && profile.personalInfo?.legalLastName
    ? `${profile.personalInfo.legalFirstName} ${profile.personalInfo.legalLastName}`
    : "Member";

  const profileImage = user?.picture || "/default-avatar.png";

  return (
    <div className="flex flex-col items-center gap-3">

      <div className="bg-gradient-to-tr from-green-400 via-blue-500 to-pink-500 p-1 rounded-full">
        <div className="bg-white p-1 rounded-full">
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
        </div>
      </div>

      <h1 className="text-lg font-semibold text-gray-900">{displayName}</h1>

      <Link href="/profile">
        <button className="px-4 py-1 text-blue-600 border border-blue-600 rounded-md text-sm font-semibold hover:bg-blue-50 transition">
          VIEW PROFILE
        </button>
      </Link>
    </div>
  );
}
