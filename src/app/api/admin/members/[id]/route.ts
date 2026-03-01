import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { updateMemberProfileById } from "@/lib/services/member/memberProfileService";
import { MemberUpdateData } from "@/types/MemberProfile";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const body: MemberUpdateData = await req.json();

  const updated = await updateMemberProfileById(id, body);

  if (!updated) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}