import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { getAllMemberProfiles } from "@/lib/services/member/memberProfileService";

export async function GET() {
  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const members = await getAllMemberProfiles();
  return NextResponse.json({ members });
}
