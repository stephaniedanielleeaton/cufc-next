import { NextResponse } from "next/server";
import { MemberProfile } from "@/lib/models/MemberProfile";
import { dbConnect } from "@/lib/mongoose";
import { requireRole } from "@/lib/auth/requireRole";

export async function GET() {
  await dbConnect();

  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const members = await MemberProfile.find({});
  return NextResponse.json({ members });
}
