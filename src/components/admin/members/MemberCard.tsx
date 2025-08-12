import React from "react";
import type { MemberProfileDTO } from "@/lib/types/MemberProfile";

interface MemberCardProps {
  member: MemberProfileDTO;
  lastCheckIn?: Date | string | null;
  onToggle?: () => void;
  isExpanded?: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ member, lastCheckIn, onToggle, isExpanded }) => {
  const name =
    [member.displayFirstName, member.displayLastName].filter(Boolean).join(" ") || (
      <span className="text-gray-400 italic">N/A</span>
    );

  const memberWithExtras = member as MemberProfileDTO & {
    subscriptionStatus?: string;
    isSubscriptionActive?: boolean;
    role?: string;
  };

  const isSubscribed =
    memberWithExtras.subscriptionStatus === "Active" || memberWithExtras.isSubscriptionActive;
  const role = memberWithExtras.role;

  let checkInDate: Date | undefined = undefined;
  if (lastCheckIn) {
    checkInDate = typeof lastCheckIn === "string" ? new Date(lastCheckIn) : lastCheckIn;
  }
  const notes = member.notes;

  const subIcon =
    isSubscribed || (role && role === "coach") ? (
      <i className="fas fa-check-circle text-green-500 text-xl" title="Active subscription" />
    ) : (
      <i
        className="fas fa-exclamation-circle text-red-500 text-xl"
        title="Not subscribed"
        aria-label="Not subscribed"
      />
    );

  const formatCheckInDate = (date?: Date) => {
    if (!date) return "Never";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!!isExpanded}
      className={`text-left w-full bg-white rounded-lg shadow-sm border border-gray-200 mb-2 p-6 flex flex-col sm:flex-row sm:items-center hover:shadow transition-shadow ${
        isExpanded ? "ring-2 ring-blue-200" : ""
      }`}
    >
      {/* Name and Role */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-lg text-gray-900">{name}</div>
        {role && <div className="text-sm text-gray-500">{role}</div>}
      </div>

      {/* Subscription Status */}
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <div className="text-sm text-gray-600">Subscription Status</div>
        <div className="text-base text-gray-900">
          {!isSubscribed ? "Not enrolled in a monthly plan" : "Active"}
        </div>
      </div>

      {/* Last Check-In */}
      <div className="flex-1 min-w-0 mt-2 sm:mt-0">
        <div className="text-sm text-gray-600">Last Check-In</div>
        <div className="text-base text-gray-900">{formatCheckInDate(checkInDate)}</div>
      </div>

      {/* Notes (only if present) */}
      {notes && (
        <div className="flex-1 min-w-0 mt-2 sm:mt-0">
          <div className="text-sm text-gray-600">Notes</div>
          <div className="text-base text-gray-900">{notes}</div>
        </div>
      )}

      {/* Status Icon and Waiver Icon */}
      <div className="flex items-center justify-end min-w-[40px] ml-4 space-x-2">
        {subIcon}
        {member.isWaiverOnFile !== true && (
          <i
            className="fas fa-file-alt text-red-500 text-xl"
            title="Waiver not on file"
            aria-label="Waiver not on file"
          />
        )}
        <i
          className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-gray-400 text-lg`}
          aria-hidden
        />
      </div>
    </button>
  );
};

export default MemberCard;
