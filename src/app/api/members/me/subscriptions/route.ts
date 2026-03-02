import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { findOrCreateMemberProfile } from "@/lib/services/member/memberProfileService";
import { getMemberSubscriptions } from "@/lib/services/square/subscriptionService";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await findOrCreateMemberProfile(session.user);

  if (!member.squareCustomerId) {
    return NextResponse.json([]);
  }

  const subscriptions = await getMemberSubscriptions(member.squareCustomerId);
  return NextResponse.json(subscriptions);
}
