"use client";

import { useState } from "react";

export default function ProfileForm({ member }: { member: MemberProfileFormInput }) {
  const [formData, setFormData] = useState<MemberProfileFormInput>(member);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("personal_info.address.")) {
      const key = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        personal_info: {
          ...prev.personal_info,
          address: {
            ...prev.personal_info?.address,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith("personal_info.")) {
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
    let dataToSend = { ...formData };
    if (dataToSend.personal_info?.dateOfBirth) {
      dataToSend = {
        ...dataToSend,
        personal_info: {
          ...dataToSend.personal_info,
          dateOfBirth: new Date(dataToSend.personal_info.dateOfBirth).toISOString(),
        },
      };
    }
    const res = await fetch("/api/member/me/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });
    if (res.ok) {
      alert("Profile updated!");
    } else {
      alert("Error updating profile.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Display Name Fields */}
      <label className="block">
        Display First Name:
        <input
          name="display_first_name"
          value={formData.display_first_name || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>
      <label className="block">
        Display Last Name:
        <input
          name="display_last_name"
          value={formData.display_last_name || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Legal Name Fields */}
      <label className="block">
        Legal First Name:
        <input
          name="personal_info.legalFirstName"
          value={formData.personal_info?.legalFirstName || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>
      <label className="block">
        Legal Last Name:
        <input
          name="personal_info.legalLastName"
          value={formData.personal_info?.legalLastName || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Email and Phone */}
      <label className="block">
        Email:
        <input
          name="personal_info.email"
          value={formData.personal_info?.email || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>
      <label className="block">
        Phone:
        <input
          name="personal_info.phone"
          value={formData.personal_info?.phone || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Date of Birth */}
      <label className="block">
        Date of Birth:
        <input
          type="date"
          name="personal_info.dateOfBirth"
          value={formData.personal_info?.dateOfBirth ? formData.personal_info.dateOfBirth.slice(0, 10) : ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Address Fields */}
      <fieldset className="border p-4 rounded">
        <legend className="font-semibold">Address</legend>
        <label className="block">
          Street:
          <input
            name="personal_info.address.street"
            value={formData.personal_info?.address?.street || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label className="block">
          City:
          <input
            name="personal_info.address.city"
            value={formData.personal_info?.address?.city || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label className="block">
          State:
          <input
            name="personal_info.address.state"
            value={formData.personal_info?.address?.state || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label className="block">
          ZIP:
          <input
            name="personal_info.address.zip"
            value={formData.personal_info?.address?.zip || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
        <label className="block">
          Country:
          <input
            name="personal_info.address.country"
            value={formData.personal_info?.address?.country || ""}
            onChange={handleChange}
            className="block w-full border p-2 rounded"
          />
        </label>
      </fieldset>

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
    legalFirstName?: string;
    legalLastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
}