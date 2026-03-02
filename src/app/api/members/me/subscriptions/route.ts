import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile, IMemberProfile } from "@/lib/models/MemberProfile";
import { UserProfileLink } from "@/lib/models/UserProfileLink";
import { getMemberSubscriptions } from "@/lib/services/square/subscriptionService";
import { Types } from "mongoose";

export async function GET(request: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const memberProfileId = request.nextUrl.searchParams.get("memberProfileId");
  if (!memberProfileId) {
    return NextResponse.json([]);
  }

  await dbConnect();

  const auth0Id = session.user.sub as string;
  const link = await UserProfileLink.findOne({
    auth0Id,
    profileId: new Types.ObjectId(memberProfileId),
  });
  if (!link) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const member = await MemberProfile.findById(memberProfileId).lean<IMemberProfile>();
  if (!member?.squareCustomerId) {
    return NextResponse.json([]);
  }

  const subscriptions = await getMemberSubscriptions(member.squareCustomerId as string);
  return NextResponse.json(subscriptions);
}
