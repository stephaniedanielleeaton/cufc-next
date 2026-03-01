import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { findOrCreateMemberProfile } from "@/lib/services/member/memberProfileService";

export async function GET() {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const member = await findOrCreateMemberProfile(session.user);
  return NextResponse.json(member);
}
