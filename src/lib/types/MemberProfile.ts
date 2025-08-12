import type { MemberStatus } from "@/lib/types/MemberStatus";

export type Address = {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
};

export type PersonalInfo = {
  legalFirstName?: string;
  legalLastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string | null;
  address?: Address;
};

export type FamilyMember = {
  name?: string;
  relationship?: string;
  dateOfBirth?: string | null;
};

export type Guardian = {
  firstName?: string;
  lastName?: string;
};

export type MemberProfileDTO = {
  _id: string;
  auth0Id: string;
  displayFirstName?: string;
  displayLastName?: string;
  personalInfo?: PersonalInfo;
  guardian?: Guardian;
  familyMembers?: FamilyMember[];
  isWaiverOnFile?: boolean;
  isPaymentWaived?: boolean;
  notes?: string;
  lastAttendanceCheckIn?: string | null;
  profileComplete?: boolean;
  checkedIn?: boolean;
  memberStatus?: MemberStatus;
  squareCustomerId?: string;
  createdAt?: string;
  updatedAt?: string;
  subscriptionStatus?: string;
  isSubscriptionActive?: boolean;
  role?: string;
};
