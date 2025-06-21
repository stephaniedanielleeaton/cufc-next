"use client";

import { useState } from "react";

export default function ProfileForm({ member }: { member: MemberProfileFormInput }) {
  const [formData, setFormData] = useState<MemberProfileFormInput>(member);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("personal_info.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          [key]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/members/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Profile updated!");
    } else {
      alert("Error updating profile.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        First Name:
        <input
          name="display_first_name"
          value={formData.display_first_name || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      <label className="block">
        Last Name:
        <input
          name="display_last_name"
          value={formData.display_last_name || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      <label className="block">
        Email:
        <input
          name="personal_info.email"
          value={formData.personal_info?.email || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save
      </button>
    </form>
  );
}

export interface MemberProfileFormInput {
    display_first_name?: string;
    display_last_name?: string;
    personal_info?: {
      email?: string;
      phone?: string;
    };
  }