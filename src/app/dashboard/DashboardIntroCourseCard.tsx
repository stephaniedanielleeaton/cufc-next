"use client";

import { BookOpen, AlertTriangle } from "lucide-react";
import Link from "next/link";

export function DashboardIntroCourseCard({ disabled }: { disabled?: boolean }) {
  return (
    <div className="bg-gradient-to-r from-yellow-200 via-yellow-100 to-white border border-yellow-300 rounded-lg px-4 py-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-yellow-300 text-white p-2 rounded-full">
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="text-sm text-gray-800">
          <p className="font-semibold">Intro Course Required</p>
          <p className="text-xs text-gray-600 mt-1">
            Start with our beginner-friendly class to unlock full access.
          </p>
          {disabled && (
            <div className="mt-2 flex items-center text-xs text-red-600 gap-1">
              <AlertTriangle className="w-4 h-4" />
              Complete your profile to enroll.
            </div>
          )}
        </div>
      </div>

      {disabled ? (
        <button
          disabled
          className="text-xs font-semibold text-gray-400 border border-gray-300 px-3 py-1 rounded-md cursor-not-allowed"
        >
          View Options
        </button>
      ) : (
        <Link
          href="/intro"
          className="text-xs font-semibold text-yellow-700 border border-yellow-500 px-3 py-1 rounded-md hover:bg-yellow-100 transition"
        >
          View Options
        </Link>
      )}
    </div>
  );
}
