import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { getProfileForUser, updateMemberProfileById } from "@/lib/services/member/memberProfileService";
import { MemberUpdateData } from "@/types/MemberProfile";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const body: { data: MemberUpdateData } = await req.json();

  const existing = await getProfileForUser(auth0Id);
  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const updated = await updateMemberProfileById(existing._id, body.data);
  return NextResponse.json({ success: true, data: updated });
}
