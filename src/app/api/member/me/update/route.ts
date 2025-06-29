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
      displayFirstName: body.display_first_name,
      displayLastName: body.display_last_name,
      "personalInfo.legalFirstName": body.personal_info?.legalFirstName,
      "personalInfo.legalLastName": body.personal_info?.legalLastName,
      "personalInfo.email": body.personal_info?.email,
      "personalInfo.phone": body.personal_info?.phone,
      "personalInfo.dateOfBirth": body.personal_info?.dateOfBirth,
      "personalInfo.address.street": body.personal_info?.address?.street,
      "personalInfo.address.city": body.personal_info?.address?.city,
      "personalInfo.address.state": body.personal_info?.address?.state,
      "personalInfo.address.zip": body.personal_info?.address?.zip,
      "personalInfo.address.country": body.personal_info?.address?.country,
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
