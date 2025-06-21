import { auth0 } from "@/lib/auth0";
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

  const updated = await MemberProfile.findOneAndUpdate(
    { auth0Id },                      // filter
    {
      $set: {
        displayFirstName: body.display_first_name,
        displayLastName: body.display_last_name,
        "personalInfo.email": body.personal_info?.email
      }
    },
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
