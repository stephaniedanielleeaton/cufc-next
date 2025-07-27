/**
 * Shared type for member check-in data used by both frontend and backend
 */
export interface MemberCheckIn {
  id: string;
  displayFirstName?: string;
  displayLastName?: string;
  isCheckedIn: boolean;
}
