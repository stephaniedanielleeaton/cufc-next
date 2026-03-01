import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongoose";
import { MemberProfile } from "@/lib/models/MemberProfile";
import { requireRole } from "@/lib/auth/requireRole";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();

  const authResult = await requireRole("club-admin");
  if ("error" in authResult) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status });
  }

  const { id } = await params;
  const body = await req.json();

  const updated = await MemberProfile.findByIdAndUpdate(
    id,
    {
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
        guardian: {
          firstName: body.guardian?.firstName ?? "",
          lastName: body.guardian?.lastName ?? "",
        },
        profileComplete: body.profileComplete,
        isWaiverOnFile: body.isWaiverOnFile,
        isPaymentWaived: body.isPaymentWaived,
        isIntroCourseCompleted: body.isIntroCourseCompleted,
        memberStatus: body.memberStatus,
        squareCustomerId: body.squareCustomerId,
        notes: body.notes,
      },
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: updated });
}