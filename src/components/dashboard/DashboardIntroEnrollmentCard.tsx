"use client";

import type { IntroEnrollment } from "@/app/api/members/me/intro-enrollment/route";

type Props = {
  enrollment: IntroEnrollment;
};

export function DashboardIntroEnrollmentCard({ enrollment }: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-2">
      <div>
        <span className="text-sm font-semibold text-gray-800">{enrollment.itemName}</span>
      </div>
      {enrollment.variationName && (
        <p className="text-sm text-gray-600">{enrollment.variationName}</p>
      )}
    </div>
  );
}
