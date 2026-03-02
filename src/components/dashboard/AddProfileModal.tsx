"use client";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useMemberProfile } from "@/context/ProfileContext";
import type { ProfileRelationship } from "@/lib/models/UserProfileLink";


type Props = {
  onClose: () => void;
};

const relationshipOptions: { value: ProfileRelationship; label: string; description: string }[] = [
  { value: "self", label: "Myself", description: "This profile is for me" },
  { value: "guardian", label: "My child / dependent", description: "I am managing this profile on their behalf" },
  { value: "family", label: "Family member", description: "Another family member I manage" },
];

export function AddProfileModal({ onClose }: Props) {
  const { user } = useUser();
  const { refreshProfile } = useMemberProfile();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [relationship, setRelationship] = useState<ProfileRelationship>("self");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (relationship === "self" && user) {
      setFirstName(user.given_name ?? user.name?.split(" ")[0] ?? "");
      setLastName(user.family_name ?? user.name?.split(" ").slice(1).join(" ") ?? "");
      setEmail(user.email ?? "");
    } else if (relationship !== "self") {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [relationship, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/members/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relationship,
          displayFirstName: firstName.trim(),
          displayLastName: lastName.trim(),
          ...(email.trim() ? { personalInfo: { email: email.trim() } } : {}),
        }),
      });
      if (!res.ok) throw new Error("Failed to create profile");
      await refreshProfile();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Add a profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">First name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                placeholder="Jane"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-1">Last name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-navy"
              placeholder="jane@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Who is this profile for?</label>
            <div className="space-y-2">
              {relationshipOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    relationship === opt.value ? "border-navy bg-light-navy" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="relationship"
                    value={opt.value}
                    checked={relationship === opt.value}
                    onChange={() => setRelationship(opt.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.description}</div>
                    {opt.value !== "self" && relationship === opt.value && (
                      <div className="text-xs text-amber-600 mt-1">
                        The fencer must be at least 16 years old to participate.
                      </div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 text-sm font-semibold rounded-lg bg-navy text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? "Adding..." : "Add profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
