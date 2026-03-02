import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getProfileForUser } from "@/lib/services/member/memberProfileService";
import { getMemberSubscriptions } from "@/lib/services/square/subscriptionService";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const profile = await getProfileForUser(auth0Id);
  if (!profile?.squareCustomerId) {
    return NextResponse.json([]);
  }

  const subscriptions = await getMemberSubscriptions(profile.squareCustomerId);
  return NextResponse.json(subscriptions);
}
