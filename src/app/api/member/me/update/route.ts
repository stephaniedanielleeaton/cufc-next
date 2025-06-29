import { auth0 } from "@/lib/auth/auth0";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile } from "@/lib/models/MemberProfile";

export async function POST(req: Request) {
  await dbConnect();
  const session = await auth0.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const auth0Id = session.user.sub;
  const body = await req.json();
  console.log("[PROFILE UPDATE] Incoming body:", JSON.stringify(body, null, 2));

  const updateObj = {
    $set: {
      displayFirstName: body.displayFirstName,
      displayLastName: body.displayLastName,
      "personalInfo.legalFirstName": body.personalInfo?.legalFirstName,
      "personalInfo.legalLastName": body.personalInfo?.legalLastName,
      "personalInfo.email": body.personalInfo?.email,
      "personalInfo.phone": body.personalInfo?.phone,
      "personalInfo.dateOfBirth": body.personalInfo?.dateOfBirth,
      "personalInfo.address.street": body.personalInfo?.address?.street,
      "personalInfo.address.city": body.personalInfo?.address?.city,
      "personalInfo.address.state": body.personalInfo?.address?.state,
      "personalInfo.address.zip": body.personalInfo?.address?.zip,
      "personalInfo.address.country": body.personalInfo?.address?.country,
      profileComplete: body.profileComplete
    }
  };
  console.log("[PROFILE UPDATE] Update object:", JSON.stringify(updateObj, null, 2));

  const updated = await MemberProfile.findOneAndUpdate(
    { auth0Id },
    updateObj,
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
