"use client";

import { useState } from "react";

export default function ProfileForm({ member }: { member: MemberProfileFormInput }) {
  const [formData, setFormData] = useState<MemberProfileFormInput>(member);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.display_first_name?.trim()) newErrors.display_first_name = "Display first name is required.";
    if (!formData.display_last_name?.trim()) newErrors.display_last_name = "Display last name is required.";
    if (!formData.personal_info?.legalFirstName?.trim()) newErrors.legalFirstName = "Legal first name is required.";
    if (!formData.personal_info?.legalLastName?.trim()) newErrors.legalLastName = "Legal last name is required.";
    if (!formData.personal_info?.email?.trim()) newErrors.email = "Email is required.";
    if (!formData.personal_info?.dateOfBirth?.trim()) newErrors.dateOfBirth = "Date of birth is required.";
    const address = formData.personal_info?.address || {};
    if (!address.street?.trim()) newErrors.street = "Street is required.";
    if (!address.city?.trim()) newErrors.city = "City is required.";
    if (!address.state?.trim()) newErrors.state = "State is required.";
    if (!address.zip?.trim()) newErrors.zip = "ZIP is required.";
    if (!address.country?.trim()) newErrors.country = "Country is required.";
    return newErrors;
  };

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
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      // Focus the first error field
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) (el as HTMLElement).focus();
      return;
    }

    let dataToSend = { ...formData, profileComplete: true };
    if (dataToSend.personal_info?.dateOfBirth) {
      dataToSend = {
        ...dataToSend,
        personal_info: {
          ...dataToSend.personal_info,
          dateOfBirth: new Date(dataToSend.personal_info.dateOfBirth).toISOString(),
        },
      };
    }
    dataToSend.profileComplete = true;
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
          className={`block w-full border p-2 rounded ${errors.display_first_name ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.display_first_name}
          aria-describedby={errors.display_first_name ? 'error-display_first_name' : undefined}
        />
        {errors.display_first_name && (
          <span id="error-display_first_name" className="text-red-600 text-sm">{errors.display_first_name}</span>
        )}
      </label>
      <label className="block">
        Display Last Name:
        <input
          name="display_last_name"
          value={formData.display_last_name || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.display_last_name ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.display_last_name}
          aria-describedby={errors.display_last_name ? 'error-display_last_name' : undefined}
        />
        {errors.display_last_name && (
          <span id="error-display_last_name" className="text-red-600 text-sm">{errors.display_last_name}</span>
        )}
      </label>

      {/* Legal Name Fields */}
      <label className="block">
        Legal First Name:
        <input
          name="personal_info.legalFirstName"
          value={formData.personal_info?.legalFirstName || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.legalFirstName ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.legalFirstName}
          aria-describedby={errors.legalFirstName ? 'error-legalFirstName' : undefined}
        />
        {errors.legalFirstName && (
          <span id="error-legalFirstName" className="text-red-600 text-sm">{errors.legalFirstName}</span>
        )}
      </label>
      <label className="block">
        Legal Last Name:
        <input
          name="personal_info.legalLastName"
          value={formData.personal_info?.legalLastName || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.legalLastName ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.legalLastName}
          aria-describedby={errors.legalLastName ? 'error-legalLastName' : undefined}
        />
        {errors.legalLastName && (
          <span id="error-legalLastName" className="text-red-600 text-sm">{errors.legalLastName}</span>
        )}
      </label>

      {/* Email and Phone */}
      <label className="block">
        Email:
        <input
          name="personal_info.email"
          value={formData.personal_info?.email || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.email ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'error-email' : undefined}
        />
        {errors.email && (
          <span id="error-email" className="text-red-600 text-sm">{errors.email}</span>
        )}
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
          className={`block w-full border p-2 rounded ${errors.dateOfBirth ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.dateOfBirth}
          aria-describedby={errors.dateOfBirth ? 'error-dateOfBirth' : undefined}
        />
        {errors.dateOfBirth && (
          <span id="error-dateOfBirth" className="text-red-600 text-sm">{errors.dateOfBirth}</span>
        )}
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
            className={`block w-full border p-2 rounded ${errors.street ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.street}
            aria-describedby={errors.street ? 'error-street' : undefined}
          />
          {errors.street && (
            <span id="error-street" className="text-red-600 text-sm">{errors.street}</span>
          )}
        </label>
        <label className="block">
          City:
          <input
            name="personal_info.address.city"
            value={formData.personal_info?.address?.city || ""}
            onChange={handleChange}
            className={`block w-full border p-2 rounded ${errors.city ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'error-city' : undefined}
          />
          {errors.city && (
            <span id="error-city" className="text-red-600 text-sm">{errors.city}</span>
          )}
        </label>
        <label className="block">
          State:
          <input
            name="personal_info.address.state"
            value={formData.personal_info?.address?.state || ""}
            onChange={handleChange}
            className={`block w-full border p-2 rounded ${errors.state ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'error-state' : undefined}
          />
          {errors.state && (
            <span id="error-state" className="text-red-600 text-sm">{errors.state}</span>
          )}
        </label>
        <label className="block">
          ZIP:
          <input
            name="personal_info.address.zip"
            value={formData.personal_info?.address?.zip || ""}
            onChange={handleChange}
            className={`block w-full border p-2 rounded ${errors.zip ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.zip}
            aria-describedby={errors.zip ? 'error-zip' : undefined}
          />
          {errors.zip && (
            <span id="error-zip" className="text-red-600 text-sm">{errors.zip}</span>
          )}
        </label>
        <label className="block">
          Country:
          <input
            name="personal_info.address.country"
            value={formData.personal_info?.address?.country || ""}
            onChange={handleChange}
            className={`block w-full border p-2 rounded ${errors.country ? 'border-red-500' : ''}`}
            aria-invalid={!!errors.country}
            aria-describedby={errors.country ? 'error-country' : undefined}
          />
          {errors.country && (
            <span id="error-country" className="text-red-600 text-sm">{errors.country}</span>
          )}
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