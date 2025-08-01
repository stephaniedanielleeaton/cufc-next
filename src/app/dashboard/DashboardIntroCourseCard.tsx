"use client";

import { BookOpen, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";

export function DashboardIntroCourseCard({ disabled }: { disabled?: boolean }) {
  if (disabled) {
    return (
      <div className="bg-gradient-to-r from-green-100 via-blue-100 to-white border border-green-300 rounded-lg p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-400 text-white p-2 rounded-full">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700">Sign Up For An Intro Class</div>
            <div className="flex items-center text-xs text-red-600 mt-1 gap-1">
              <AlertTriangle className="w-4 h-4" />
              Complete your profile to enroll.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link
      href="/intro"
      className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-4 flex items-center justify-between shadow-md transition hover:brightness-105"
    >
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6" />
        <div className="text-sm font-semibold">Sign Up For An Intro Class</div>
      </div>
      <ChevronRight className="w-5 h-5 text-white" />
    </Link>
  );
}
