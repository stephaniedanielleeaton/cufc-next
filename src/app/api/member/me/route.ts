import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile } from "@/lib/models/MemberProfile";

export async function GET() {
  await dbConnect();
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub;
  const member = await MemberProfile.findOne({ auth0Id });

  if (!member) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Only return personal info fields
  return NextResponse.json({
    displayFirstName: member.displayFirstName,
    displayLastName: member.displayLastName,
    personalInfo: member.personalInfo,
    email: member.personalInfo?.email,
  });
}
