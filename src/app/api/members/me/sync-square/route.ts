import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { getProfileForUser, updateMemberProfileById } from "@/lib/services/member/memberProfileService";
import { SquareService } from "@/lib/services/square/squareService";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub as string;
  const profile = await getProfileForUser(auth0Id);
  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.squareCustomerId) {
    return NextResponse.json({ status: "already_linked" });
  }

  const email = profile.personalInfo?.email;
  if (!email) {
    return NextResponse.json({ status: "no_email" });
  }

  const squareService = new SquareService();
  const customers = await squareService.searchCustomersByEmail(email);

  if (customers.length === 0) {
    return NextResponse.json({ status: "not_found" });
  }

  if (customers.length > 1) {
    return NextResponse.json({ status: "ambiguous", count: customers.length });
  }

  await updateMemberProfileById(profile._id, { squareCustomerId: customers[0].id });

  return NextResponse.json({ status: "linked", squareCustomerId: customers[0].id });
}
