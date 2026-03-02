"use client";

import { useState } from "react";
import { useMemberProfile } from "@/context/ProfileContext";
import { AddProfileModal } from "@/components/dashboard/AddProfileModal";
import type { MemberProfileDTO } from "@/types/MemberProfile";

function profileLabel(p: MemberProfileDTO): string {
  const name = `${p.displayFirstName ?? ""} ${p.displayLastName ?? ""}`.trim();
  return name || "Unnamed Profile";
}

export function ProfileSwitcher() {
  const { profiles, activeProfileId, setActiveProfileId } = useMemberProfile();
  const [showAdd, setShowAdd] = useState(false);

  if (profiles.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {profiles.length > 1 && (
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Viewing:</span>
        )}
        <div className="flex gap-2 flex-wrap">
          {profiles.map((p) => {
            const id = String(p._id);
            const isActive = id === activeProfileId;
            return (
              <button
                key={id}
                onClick={() => setActiveProfileId(id)}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  isActive
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                }`}
              >
                {profileLabel(p)}
              </button>
            );
          })}
          <button
            onClick={() => setShowAdd(true)}
            className="px-3 py-1 text-sm rounded-full border border-dashed border-gray-400 text-gray-500 hover:border-gray-600 hover:text-gray-700 transition-colors"
          >
            + Add profile
          </button>
        </div>
      </div>
      {showAdd && <AddProfileModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
