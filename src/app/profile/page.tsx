// src/app/profile/page.tsx

import { auth0 } from "@/lib/auth0";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile } from "@/lib/models/MemberProfile";
import ProfileForm, { MemberProfileFormInput } from "@/components/ProfileForm";

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
      email: member.personalInfo?.email ?? "",
      phone: member.personalInfo?.phone ?? "",
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm member={formData} />
    </div>
  );
}
