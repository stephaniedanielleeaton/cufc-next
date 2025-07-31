import { useEffect, useState } from "react";

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
      } catch (err) {
        setError("Failed to load check-in history.");
      } finally {
        setLoading(false);
      }
    }
    fetchLastCheckIn();
  }, []);

  let content;
  if (loading) {
    content = <div className="text-gray-500">Loading...</div>;
  } else if (error) {
    content = <div className="text-red-600">{error}</div>;
  } else if (!lastCheckIn) {
    content = <div className="text-gray-500">No check-in records found.</div>;
  } else {
    const date = new Date(lastCheckIn.timestamp);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    content = (
      <>
        <p>Date: <span className="font-medium">{dateStr}</span></p>
        <p>Time: <span className="font-medium">{timeStr}</span></p>
      </>
    );
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6 pt-8">
      <h2 className="text-xl font-semibold text-gray-800 tracking-wide mb-6">Last Check-In</h2>
      <div className="text-gray-700 space-y-2">
        {content}
      </div>
    </div>
  );
}
