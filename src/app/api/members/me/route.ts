import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { findOrCreateMemberProfile } from "@/lib/services/member/memberProfileService";

export async function GET() {
  await dbConnect();
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await findOrCreateMemberProfile(session.user);

  return NextResponse.json({
    profileId: member._id,
    displayFirstName: member.displayFirstName,
    displayLastName: member.displayLastName,
    personalInfo: member.personalInfo,
    email: member.personalInfo?.email,
    profileComplete: member.profileComplete ?? false,
    memberStatus: member.memberStatus,
  });
}
