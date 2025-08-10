"use client";
import React, { useState, useMemo } from "react";
import MemberCard from "./MemberCard";
import SearchBox from "./SearchBox";
import useSWR from "swr";
import type { IMemberProfile } from "@/lib/models/MemberProfile";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR("/api/members", (url) => fetch(url).then(res => res.json()));
  const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading } = useSWR("/api/attendance/recent", (url) => fetch(url).then(res => res.json()));

  const lastCheckInMap = useMemo(() => {
    if (!attendanceData) return {};
    const map: Record<string, string | null> = {};
    attendanceData.forEach((item: { memberId: string; lastCheckIn: string | null }) => {
      map[item.memberId] = item.lastCheckIn;
    });
    return map;
  }, [attendanceData]);


  const filtered: IMemberProfile[] = useMemo(() => {
    const members: IMemberProfile[] = data?.members || [];
    const q = search.toLowerCase();
    return members.filter((m) => {
      const first = m.displayFirstName || "";
      const last = m.displayLastName || "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }, [data, search]);

  if (isLoading || attendanceLoading) return <div className="text-center py-8 text-gray-400">Loading members...</div>;
  if (error || attendanceError) return <div className="text-center py-8 text-red-500">Error loading members. Please try again later.</div>;

  return (
    <div>
      <div className="max-w-md mx-auto mb-6">
        <SearchBox searchQuery={search} onSearchChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-4">
        {filtered.map((member) => (
          <MemberCard
            key={String(member._id)}
            member={member}
            lastCheckIn={lastCheckInMap[String(member._id)] ?? null}
          />
        ))}
      </div>
    </div>
  );
}
