import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { getAllMemberProfiles } from "@/lib/services/member/memberProfileService";
import { SquareService } from "@/lib/services/square/squareService";

export async function GET() {
  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const members = await getAllMemberProfiles();

  const customerIds = members
    .map((m) => m.squareCustomerId)
    .filter((id): id is string => !!id);

  const squareService = new SquareService();
  const activeCustomerIds = await squareService.getActiveSubscriptionsForCustomers(customerIds);

  const enriched = members.map((m) => ({
    ...m,
    isSubscriptionActive: !!m.squareCustomerId && activeCustomerIds.has(m.squareCustomerId),
  }));

  return NextResponse.json({ members: enriched });
}
