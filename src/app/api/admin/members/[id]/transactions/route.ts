import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/requireRole";
import { getMemberProfileById } from "@/lib/services/member/memberProfileService";
import { SquareService } from "@/lib/services/square/squareService";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const profile = await getMemberProfileById(id);
  if (!profile) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  console.log('[transactions] memberId:', id, 'squareCustomerId:', profile.squareCustomerId);

  if (!profile.squareCustomerId) {
    console.log('[transactions] No squareCustomerId, returning empty');
    return NextResponse.json({ transactions: [] });
  }

  const squareService = new SquareService();
  const orders = await squareService.getRecentOrdersForCustomer(profile.squareCustomerId);
  console.log('[transactions] Found', orders.length, 'orders for customer', profile.squareCustomerId);

  const transactions = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    state: order.state,
    totalMoney: order.totalMoney
      ? { amount: Number(order.totalMoney.amount), currency: order.totalMoney.currency }
      : undefined,
    lineItems: (order.lineItems ?? []).map((li) => ({
      name: li.name,
      variationName: li.variationName,
      quantity: li.quantity,
      totalMoney: li.totalMoney
        ? { amount: Number(li.totalMoney.amount), currency: li.totalMoney.currency }
        : undefined,
    })),
  }));

  return NextResponse.json({ transactions });
}
