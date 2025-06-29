"use client";

import { useState } from "react";
import { useMemberProfile } from "@/app/context/ProfileContext";

export default function ProfileForm({ member }: { member: MemberProfileFormInput }) {
  const { refreshProfile } = useMemberProfile();
  const [formData, setFormData] = useState<MemberProfileFormInput>(member);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.displayFirstName?.trim()) newErrors.displayFirstName = "Display first name is required.";
    if (!formData.displayLastName?.trim()) newErrors.displayLastName = "Display last name is required.";
    if (!formData.personalInfo?.legalFirstName?.trim()) newErrors.legalFirstName = "Legal first name is required.";
    if (!formData.personalInfo?.legalLastName?.trim()) newErrors.legalLastName = "Legal last name is required.";
    if (!formData.personalInfo?.email?.trim()) newErrors.email = "Email is required.";
    if (!formData.personalInfo?.dateOfBirth?.trim()) newErrors.dateOfBirth = "Date of birth is required.";
    const address = formData.personalInfo?.address || {};
    if (!address.street?.trim()) newErrors.street = "Street is required.";
    if (!address.city?.trim()) newErrors.city = "City is required.";
    if (!address.state?.trim()) newErrors.state = "State is required.";
    if (!address.zip?.trim()) newErrors.zip = "ZIP is required.";
    if (!address.country?.trim()) newErrors.country = "Country is required.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("personalInfo.address.")) {
      const key = name.split(".")[2];
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          address: {
            ...prev.personalInfo?.address,
            [key]: value,
          },
        },
      }));
    } else if (name.startsWith("personalInfo.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
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
    if (dataToSend.personalInfo?.dateOfBirth) {
      dataToSend = {
        ...dataToSend,
        personalInfo: {
          ...dataToSend.personalInfo,
          dateOfBirth: new Date(dataToSend.personalInfo.dateOfBirth).toISOString(),
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
      await refreshProfile();
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
          name="displayFirstName"
          value={formData.displayFirstName || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.displayFirstName ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.displayFirstName}
          aria-describedby={errors.displayFirstName ? 'error-displayFirstName' : undefined}
        />
        {errors.displayFirstName && (
          <span id="error-displayFirstName" className="text-red-600 text-sm">{errors.displayFirstName}</span>
        )}
      </label>
      <label className="block">
        Display Last Name:
        <input
          name="displayLastName"
          value={formData.displayLastName || ""}
          onChange={handleChange}
          className={`block w-full border p-2 rounded ${errors.displayLastName ? 'border-red-500' : ''}`}
          aria-invalid={!!errors.displayLastName}
          aria-describedby={errors.displayLastName ? 'error-displayLastName' : undefined}
        />
        {errors.displayLastName && (
          <span id="error-displayLastName" className="text-red-600 text-sm">{errors.displayLastName}</span>
        )}
      </label>

      {/* Legal Name Fields */}
      <label className="block">
        Legal First Name:
        <input
          name="personalInfo.legalFirstName"
          value={formData.personalInfo?.legalFirstName || ""}
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
          name="personalInfo.legalLastName"
          value={formData.personalInfo?.legalLastName || ""}
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
          name="personalInfo.email"
          value={formData.personalInfo?.email || ""}
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
          name="personalInfo.phone"
          value={formData.personalInfo?.phone || ""}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
      </label>

      {/* Date of Birth */}
      <label className="block">
        Date of Birth:
        <input
          type="date"
          name="personalInfo.dateOfBirth"
          value={formData.personalInfo?.dateOfBirth ? formData.personalInfo.dateOfBirth.slice(0, 10) : ""}
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
            name="personalInfo.address.street"
            value={formData.personalInfo?.address?.street || ""}
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
            name="personalInfo.address.city"
            value={formData.personalInfo?.address?.city || ""}
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
            name="personalInfo.address.state"
            value={formData.personalInfo?.address?.state || ""}
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
            name="personalInfo.address.zip"
            value={formData.personalInfo?.address?.zip || ""}
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
            name="personalInfo.address.country"
            value={formData.personalInfo?.address?.country || ""}
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
  displayFirstName?: string;
  displayLastName?: string;
  profileComplete?: boolean;
  personalInfo?: {
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