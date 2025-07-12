"use client";
import React, { useState, useMemo } from "react";
import MemberCard from "./MemberCard";
import SearchBox from "./SearchBox";
import useSWR from "swr";
import type { IMemberProfile } from "@/lib/models/MemberProfile";

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading } = useSWR("/api/members", (url) => fetch(url).then(res => res.json()));
  const members: IMemberProfile[] = data?.members || [];

  const filtered: IMemberProfile[] = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const first = m.displayFirstName || "";
      const last = m.displayLastName || "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }, [members, search]);

  if (isLoading) return <div className="text-center py-8 text-gray-400">Loading members...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error loading members. Please try again later.</div>;

  return (
    <div>
      <div className="max-w-md mx-auto mb-6">
        <SearchBox searchQuery={search} onSearchChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-4">
        {filtered.map((member) => (
          <MemberCard key={String(member._id)} member={member} />
        ))}
      </div>
    </div>
  );
}
