"use client";

import React, { useState, useMemo } from "react";
import MemberCard from "@/components/admin/members/MemberCard";
import MemberDetailsInline from "@/components/admin/members/MemberDetailsInline";
import SearchBox from "@/components/admin/members/SearchBox";
import useSWR from "swr";
import type { MemberProfileDTO } from "@/types/MemberProfile";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const { data, error, isLoading, mutate } = useSWR("/api/members", (url) => fetch(url).then((res) => res.json()));
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

  const handleSave = (id: string) => async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const body = {
      displayFirstName: fd.get("displayFirstName"),
      displayLastName: fd.get("displayLastName"),
      personalInfo: {
        legalFirstName: fd.get("legalFirstName"),
        legalLastName: fd.get("legalLastName"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        dateOfBirth: fd.get("dateOfBirth") || null,
        address: {
          street: fd.get("street"),
          city: fd.get("city"),
          state: fd.get("state"),
          zip: fd.get("zip"),
          country: fd.get("country"),
        },
      },
      guardian: {
        firstName: fd.get("guardian.firstName"),
        lastName: fd.get("guardian.lastName"),
      },
      profileComplete: fd.get("profileComplete") === "on",
      isWaiverOnFile: fd.get("isWaiverOnFile") === "on",
      isPaymentWaived: fd.get("isPaymentWaived") === "on",
      isIntroCourseCompleted: fd.get("isIntroCourseCompleted") === "on",
      memberStatus: fd.get("memberStatus"),
      squareCustomerId: fd.get("squareCustomerId"),
      notes: fd.get("notes"),
    };

    setSaveStatus("saving");
    try {
      const res = await fetch(`/api/admin/members/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      await mutate();
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    } finally {
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
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
                  <MemberDetailsInline member={member} onSubmit={handleSave(id)} saveStatus={saveStatus} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
