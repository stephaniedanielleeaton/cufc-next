import React from "react";
import type { IMemberProfile } from "@/lib/models/MemberProfile";

interface MemberCardProps {
  member: IMemberProfile;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const name = [member.displayFirstName, member.displayLastName].filter(Boolean).join(" ") || (
    <span className="text-gray-400 italic">N/A</span>
  );
  
  // These properties might be added to the member object by the API or other code
  // We'll use type assertion to access them safely
  const memberWithExtras = member as IMemberProfile & {
    subscriptionStatus?: string;
    isSubscriptionActive?: boolean;
    role?: string;
  };
  
  const isSubscribed = memberWithExtras.subscriptionStatus === 'Active' || memberWithExtras.isSubscriptionActive;
  const role = memberWithExtras.role;
  const lastCheckIn = member.lastAttendanceCheckIn;
  const notes = member.notes;
  
  // Only show green check or red exclamation icon
  const subIcon = isSubscribed || (role && role === 'coach') ? (
    <i className="fas fa-check-circle text-green-500 text-xl" title="Active subscription" />
  ) : (
    <i className="fas fa-exclamation-circle text-red-500 text-xl" title="Not subscribed" />
  );
  
  const formatCheckInDate = (date?: Date) => {
    if (!date) return 'Never';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 p-6 flex flex-col sm:flex-row sm:items-center w-full"
    >
      {/* Name and Role */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-gray-900">{name}</div>
        {role && (
          <div className="text-sm text-gray-500">{role}</div>
        )}
      </div>
      {/* Subscription Status */}
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <div className="text-sm text-gray-600">Subscription Status</div>
        <div className="text-base text-gray-900">
          {!isSubscribed ? 'Not enrolled in a monthly plan' : 'Active'}
        </div>
      </div>
      {/* Last Check-In */}
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <div className="text-sm text-gray-600">Last Check-In</div>
        <div className="text-base text-gray-900">{formatCheckInDate(lastCheckIn)}</div>
      </div>
      {/* Notes (only if present) */}
      {notes && (
        <div className="flex-1 min-w-0 mt-2 sm:mt-0">
          <div className="text-sm text-gray-600">Notes</div>
          <div className="text-base text-gray-900">{notes}</div>
        </div>
      )}
      {/* Status Icon */}
      <div className="flex items-center justify-end min-w-[40px] ml-4">
        {subIcon}
      </div>
    </div>
  );
};

export default MemberCard;
