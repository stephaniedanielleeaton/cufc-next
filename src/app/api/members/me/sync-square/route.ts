import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth/auth0";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile, IMemberProfile } from "@/lib/models/MemberProfile";
import { UserProfileLink } from "@/lib/models/UserProfileLink";
import { SquareService } from "@/lib/services/square/squareService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { memberProfileId } = await req.json();
  if (!memberProfileId) {
    return NextResponse.json({ error: "memberProfileId is required" }, { status: 400 });
  }

  await dbConnect();

  const auth0Id = session.user.sub as string;
  const link = await UserProfileLink.findOne({ auth0Id, profileId: memberProfileId });
  if (!link) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await MemberProfile.findById(memberProfileId).lean<IMemberProfile>();
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

  await MemberProfile.updateOne(
    { _id: memberProfileId },
    { $set: { squareCustomerId: customers[0].id } }
  );

  return NextResponse.json({ status: "linked", squareCustomerId: customers[0].id });
}
