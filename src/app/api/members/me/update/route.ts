import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { updateMemberProfileById } from "@/lib/services/member/memberProfileService";
import { UserProfileLink } from "@/lib/models/UserProfileLink";
import { MemberUpdateData } from "@/types/MemberProfile";
import { Types } from "mongoose";

export async function POST(req: Request) {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const auth0Id = session.user.sub as string;
  const body: { profileId: string; data: MemberUpdateData } = await req.json();

  const link = await UserProfileLink.findOne({
    auth0Id,
    profileId: new Types.ObjectId(body.profileId),
  });

  if (!link) {
    return NextResponse.json({ error: "Profile not found or access denied" }, { status: 403 });
  }

  const updated = await updateMemberProfileById(body.profileId, body.data);
  return NextResponse.json({ success: true, data: updated });
}
