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

  // Desktop/tablet status icon (keeps green check)
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

  // Mobile: only show alert icons (no green check)
  const mobileAlertIcons = (
    <div className="flex items-center gap-2">
      {!isSubscribed && (
        <i
          className="fas fa-exclamation-circle text-red-500 text-lg"
          title="Not subscribed"
          aria-label="Not subscribed"
        />
      )}
      {member.isWaiverOnFile !== true && (
        <i
          className="fas fa-file-alt text-red-500 text-lg"
          title="Waiver not on file"
          aria-label="Waiver not on file"
        />
      )}
    </div>
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
      className={`text-left w-full bg-white rounded-lg shadow-sm border border-gray-200 mb-2 p-4 sm:p-6 hover:shadow transition-shadow ${
        isExpanded ? "ring-2 ring-blue-200" : ""
      }`}
    >
      {/* MOBILE: simple header (name + alert icons + chevron) */}
      <div className="sm:hidden space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="font-semibold text-lg text-gray-900 truncate">{name}</div>
          <div className="flex items-center gap-2">
            {mobileAlertIcons}
          </div>
        </div>

        {/* Only show this line on mobile when NOT subscribed */}
        {!isSubscribed && (
          <div className="text-sm text-gray-600">Not enrolled in a monthly plan</div>
        )}
      </div>

      {/* DESKTOP/TABLET: full info row */}
      <div className="hidden sm:flex sm:items-center sm:gap-4">
        {/* Name & role */}
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-lg text-gray-900 truncate">{name}</div>
          {role && <div className="text-sm text-gray-500">{role}</div>}
        </div>

        {/* Subscription Status */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600">Subscription Status</div>
          <div className="text-base text-gray-900">
            {!isSubscribed ? "Not enrolled in a monthly plan" : "Active"}
          </div>
        </div>

        {/* Last Check-In */}
        <div className="flex-1 min-w-0">
          <div className="text-sm text-gray-600">Last Check-In</div>
          <div className="text-base text-gray-900">{formatCheckInDate(checkInDate)}</div>
        </div>

        {/* Notes (only if present) */}
        {notes && (
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-600">Notes</div>
            <div className="text-base text-gray-900 truncate">{notes}</div>
          </div>
        )}

        {/* Icons */}
        <div className="flex items-center justify-end min-w-[40px] ml-2 space-x-2">
          {subIcon}
          {member.isWaiverOnFile !== true && (
            <i
              className="fas fa-file-alt text-red-500 text-xl"
              title="Waiver not on file"
              aria-label="Waiver not on file"
            />
          )}
        </div>
      </div>
    </button>
  );
};

export default MemberCard;
