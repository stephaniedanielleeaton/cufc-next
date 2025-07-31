import { MemberStatus } from "@/lib/types/MemberStatus";

export interface MemberProfileFormInput {
    displayFirstName?: string;
    displayLastName?: string;
    profileComplete?: boolean;
    memberStatus?: MemberStatus;
    personalInfo?: {
      legalFirstName?: string;
      legalLastName?: string;
      email?: string;
      phone?: string;
      dateOfBirth?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
      };
    };
  }
  