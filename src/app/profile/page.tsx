// src/app/profile/page.tsx

import { auth0 } from "@/lib/auth/auth0";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile } from "@/lib/models/MemberProfile";
import ProfileForm, { MemberProfileFormInput } from "@/components/ProfileForm";
import { ProfileProvider, useProfile } from "@/components/ProfileContext";

export default async function ProfilePage() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return (
      <div className="p-4">
        <p>Please log in to view your profile.</p>
        <a href="/auth/login" className="text-blue-600 underline">Log In</a>
      </div>
    );
  }

  await dbConnect();
  const member = await MemberProfile.findOne({ auth0Id: session.user.sub });

  if (!member) {
    return <div className="p-4 text-red-600">No profile found for your account.</div>;
  }

  const formData: MemberProfileFormInput = {
    display_first_name: member.displayFirstName ?? "",
    display_last_name: member.displayLastName ?? "",
    personal_info: {
      legalFirstName: member.personalInfo?.legalFirstName ?? "",
      legalLastName: member.personalInfo?.legalLastName ?? "",
      email: member.personalInfo?.email ?? "",
      phone: member.personalInfo?.phone ?? "",
      dateOfBirth: member.personalInfo?.dateOfBirth?.toISOString() ?? "",
      address: {
        street: member.personalInfo?.address?.street ?? "",
        city: member.personalInfo?.address?.city ?? "",
        state: member.personalInfo?.address?.state ?? "",
        zip: member.personalInfo?.address?.zip ?? "",
        country: member.personalInfo?.address?.country ?? "",
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm member={formData} />
    </div>
  );
}
