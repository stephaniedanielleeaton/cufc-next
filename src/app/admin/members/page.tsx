"use client";

import React, { useState, useMemo } from "react";
import MemberCard from "@/components/admin/members/MemberCard";
import MemberDetailsInline from "@/components/admin/members/MemberDetailsInline";
import SearchBox from "@/components/admin/members/SearchBox";
import useSWR from "swr";
import type { MemberProfileDTO } from "@/lib/types/MemberProfile";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, error, isLoading } = useSWR("/api/members", (url) => fetch(url).then((res) => res.json()));
  const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading } =
    useSWR("/api/attendance/recent", (url) => fetch(url).then((res) => res.json()));

  const lastCheckInMap = useMemo(() => {
    if (!attendanceData) return {} as Record<string, string | null>;
    const map: Record<string, string | null> = {};
    attendanceData.forEach((item: { memberId: string; lastCheckIn: string | null }) => {
      map[item.memberId] = item.lastCheckIn;
    });
    return map;
  }, [attendanceData]);

  const filtered: MemberProfileDTO[] = useMemo(() => {
    const members: MemberProfileDTO[] = data?.members || [];
    const q = search.toLowerCase();
    return members.filter((m) => {
      const first = m.displayFirstName || "";
      const last = m.displayLastName || "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }, [data, search]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading || attendanceLoading) return <div className="text-center py-8 text-gray-400">Loading members...</div>;
  if (error || attendanceError) return <div className="text-center py-8 text-red-500">Error loading members. Please try again later.</div>;

  return (
    <div>
      <div className="max-w-md mx-auto mb-6">
        <SearchBox searchQuery={search} onSearchChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="space-y-4">
        {filtered.map((member) => {
          const id = String(member._id);
          const expanded = expandedId === id;

          return (
            <div key={id} className="w-full">
              <MemberCard
                member={member}
                lastCheckIn={lastCheckInMap[id] ?? null}
                onToggle={() => handleToggle(id)}
                isExpanded={expanded}
              />

              {expanded && (
                <div className="mt-2">
                  <MemberDetailsInline member={member} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
