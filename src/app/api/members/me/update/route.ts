import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { updateMemberProfileByAuth0Id } from "@/lib/services/member/memberProfileService";
import { MemberUpdateData } from "@/types/MemberProfile";

export async function POST(req: Request) {
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: MemberUpdateData = await req.json();
  const updated = await updateMemberProfileByAuth0Id(session.user.sub, body);

  return NextResponse.json({ success: true, data: updated });
}
