"use client";

import React, { useState, useMemo } from "react";
import MemberCard from "@/components/admin/members/MemberCard";
import MemberDetailsInline from "@/components/admin/members/MemberDetailsInline";
import SearchBox from "@/components/admin/members/SearchBox";
import useSWR from "swr";
import type { MemberProfileDTO } from "@/types/MemberProfile";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [checkedInOnly, setCheckedInOnly] = useState(false);
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

  const todayStr = new Date().toDateString();

  const filtered: MemberProfileDTO[] = useMemo(() => {
    const members: MemberProfileDTO[] = data?.members || [];
    const q = search.toLowerCase();
    return members.filter((m) => {
      const first = m.displayFirstName || "";
      const last = m.displayLastName || "";
      const matchesSearch = `${first} ${last}`.toLowerCase().includes(q);
      const lastCheckIn = lastCheckInMap[String(m._id)];
      const isCheckedInToday = !!lastCheckIn && new Date(lastCheckIn).toDateString() === todayStr;
      const matchesCheckedIn = !checkedInOnly || isCheckedInToday;
      return matchesSearch && matchesCheckedIn;
    });
  }, [data, search, checkedInOnly, lastCheckInMap, todayStr]);

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/members/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setExpandedId(null);
      await mutate();
    } catch {
      alert("Failed to delete member. Please try again.");
    }
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
      <div className="max-w-2xl mx-auto mb-6 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex-1">
          <SearchBox searchQuery={search} onSearchChange={(e) => setSearch(e.target.value)} />
        </div>
        <button
          onClick={() => setCheckedInOnly((prev) => !prev)}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-colors whitespace-nowrap ${
            checkedInOnly
              ? "bg-gray-200 text-gray-700 border-gray-400"
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
          }`}
        >
          {checkedInOnly && <i className="fas fa-check text-xs" />}
          Show checked in
        </button>
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
                  <MemberDetailsInline
                    member={member}
                    onSubmit={handleSave(id)}
                    onDelete={() => handleDelete(id)}
                    saveStatus={saveStatus}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
