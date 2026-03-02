import { HydratedDocument } from "mongoose";
import { MemberProfile, IMemberProfile } from "@/lib/models/MemberProfile";
import { MemberProfileDTO, MemberUpdateData } from "@/types/MemberProfile";
import { dbConnect } from "@/lib/mongoose";

function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function mapMemberDocToDTO(doc: HydratedDocument<IMemberProfile>): MemberProfileDTO {
  return {
    _id: doc.id as string,
    displayFirstName: doc.displayFirstName,
    displayLastName: doc.displayLastName,
    personalInfo: doc.personalInfo
      ? {
          legalFirstName: doc.personalInfo.legalFirstName,
          legalLastName: doc.personalInfo.legalLastName,
          email: doc.personalInfo.email,
          phone: doc.personalInfo.phone,
          dateOfBirth: doc.personalInfo.dateOfBirth
            ? toISODateString(doc.personalInfo.dateOfBirth)
            : null,
          address: doc.personalInfo.address ?? undefined,
        }
      : undefined,
    guardian: doc.guardian ?? undefined,
    familyMembers: (doc.familyMembers ?? []).map((fm) => ({
      name: fm.name,
      relationship: fm.relationship,
      dateOfBirth: fm.dateOfBirth ? toISODateString(fm.dateOfBirth) : null,
    })),
    isWaiverOnFile: doc.isWaiverOnFile,
    isPaymentWaived: doc.isPaymentWaived,
    notes: doc.notes,
    lastAttendanceCheckIn: doc.lastAttendanceCheckIn
      ? doc.lastAttendanceCheckIn.toISOString()
      : null,
    profileComplete: doc.profileComplete,
    memberStatus: doc.memberStatus,
    squareCustomerId: doc.squareCustomerId,
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
  };
}

function buildMemberMongoUpdateSet(data: MemberUpdateData) {
  return {
    ...(data.displayFirstName !== undefined && { displayFirstName: data.displayFirstName }),
    ...(data.displayLastName !== undefined && { displayLastName: data.displayLastName }),
    ...(data.personalInfo?.legalFirstName !== undefined && { "personalInfo.legalFirstName": data.personalInfo.legalFirstName }),
    ...(data.personalInfo?.legalLastName !== undefined && { "personalInfo.legalLastName": data.personalInfo.legalLastName }),
    ...(data.personalInfo?.email !== undefined && { "personalInfo.email": data.personalInfo.email }),
    ...(data.personalInfo?.phone !== undefined && { "personalInfo.phone": data.personalInfo.phone }),
    ...(data.personalInfo?.dateOfBirth !== undefined && { "personalInfo.dateOfBirth": data.personalInfo.dateOfBirth || null }),
    ...(data.personalInfo?.address !== undefined && {
      "personalInfo.address.street": data.personalInfo.address?.street,
      "personalInfo.address.city": data.personalInfo.address?.city,
      "personalInfo.address.state": data.personalInfo.address?.state,
      "personalInfo.address.zip": data.personalInfo.address?.zip,
      "personalInfo.address.country": data.personalInfo.address?.country,
    }),
    ...(data.guardian !== undefined && {
      guardian: {
        firstName: data.guardian?.firstName ?? "",
        lastName: data.guardian?.lastName ?? "",
      },
    }),
    ...(data.profileComplete !== undefined && { profileComplete: data.profileComplete }),
    ...(data.isWaiverOnFile !== undefined && { isWaiverOnFile: data.isWaiverOnFile }),
    ...(data.isPaymentWaived !== undefined && { isPaymentWaived: data.isPaymentWaived }),
    ...(data.memberStatus !== undefined && { memberStatus: data.memberStatus }),
    ...(data.squareCustomerId !== undefined && { squareCustomerId: data.squareCustomerId }),
    ...(data.notes !== undefined && { notes: data.notes }),
  };
}

export async function getAllMemberProfiles(): Promise<MemberProfileDTO[]> {
  await dbConnect();
  const profiles = await MemberProfile.find({});
  return profiles.map(mapMemberDocToDTO);
}

export async function getAllMemberIds(): Promise<string[]> {
  await dbConnect();
  const profiles = await MemberProfile.find({}, { _id: 1 }).lean();
  return profiles.map((p) => String(p._id));
}

export async function updateMemberProfileById(
  id: string,
  data: MemberUpdateData
): Promise<MemberProfileDTO | null> {
  await dbConnect();
  const updated = await MemberProfile.findByIdAndUpdate(
    id,
    { $set: buildMemberMongoUpdateSet(data) },
    { new: true }
  );
  return updated ? mapMemberDocToDTO(updated) : null;
}

