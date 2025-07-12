"use client";
import React, { useState, useMemo } from "react";
import MemberCard from "./MemberCard";
import SearchBox from "./SearchBox";
import { MemberProfile } from "@/lib/models/MemberProfile";

export default function MembersPageWrapper() {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetch("/api/members")
      .then((res) => res.json())
      .then((data) => setMembers(data.members || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const first = m.displayFirstName || m.display_first_name || "";
      const last = m.displayLastName || m.display_last_name || "";
      return `${first} ${last}`.toLowerCase().includes(q);
    });
  }, [members, search]);

  return (
    <div>
      <div className="max-w-md mx-auto mb-6">
        <SearchBox searchQuery={search} onSearchChange={e => setSearch(e.target.value)} />
      </div>
      <div className="space-y-4">
        {filtered.map((member: any) => (
          <MemberCard key={member._id} member={member} />
        ))}
      </div>
    </div>
  );
}
