export interface MemberProfileFormInput {
    displayFirstName?: string;
    displayLastName?: string;
    profileComplete?: boolean;
    hasCompletedIntro?: boolean;
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
  