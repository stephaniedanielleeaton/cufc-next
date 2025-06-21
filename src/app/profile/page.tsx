// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetch("/api/users/me")
        .then((res) => {
          if (!res.ok) throw new Error("Unauthorized or failed to fetch profile");
          return res.json();
        })
        .then((data) => setMember(data))
        .catch((err) => setError(err.message));
    }
  }, [user]);

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (!user) return <div className="p-4">Please log in to view your profile.</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!member) return <div className="p-4">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <ProfileForm member={member} />
    </div>
  );
}
