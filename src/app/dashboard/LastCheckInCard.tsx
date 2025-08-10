"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function LastCheckInCard() {
  const [lastCheckIn, setLastCheckIn] = useState<null | { timestamp: string }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLastCheckIn() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/member/last-checkin");
        const data = await res.json();
        if (res.ok && data.lastCheckIn) {
          setLastCheckIn(data.lastCheckIn);
        } else {
          setLastCheckIn(null);
        }
      } catch {
        setError("Failed to load check-in history.");
      } finally {
        setLoading(false);
      }
    }
    fetchLastCheckIn();
  }, []);

  let content;
  if (loading) {
    content = <p className="text-gray-500">Loading...</p>;
  } else if (error) {
    content = <p className="text-red-600">{error}</p>;
  } else if (!lastCheckIn) {
    content = <p className="text-gray-500">No check-in records found.</p>;
  } else {
    const date = new Date(lastCheckIn.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    content = (
      <div className="text-sm text-gray-800">
        <p className="font-semibold tracking-wide">
          {dateStr} at {timeStr}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 px-4 py-5 flex items-center gap-4">
      <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
        <Clock className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Last Check-In</h2>
        {content}
      </div>
    </div>
  );
}
