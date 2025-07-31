"use client";

import { useState } from "react";
import { useMemberProfile } from "@/app/context/ProfileContext";
import { MemberProfileFormInput } from "@/types/MemberProfileFormInput";
import { TextInput } from "@/components/common/TextInput";
import { SquareButton } from "@/components/common/SquareButton";

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
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white px-8 py-8 space-y-4"
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
          label="Display First Name"
          name="displayFirstName"
          value={formData.displayFirstName || ""}
          onChange={handleChange}
          error={errors.displayFirstName}
        />
        <TextInput
          label="Display Last Name"
          name="displayLastName"
          value={formData.displayLastName || ""}
          onChange={handleChange}
          error={errors.displayLastName}
        />
        <TextInput
          label="Legal First Name"
          name="personalInfo.legalFirstName"
          value={formData.personalInfo?.legalFirstName || ""}
          onChange={handleChange}
          error={errors.legalFirstName}
        />
        <TextInput
          label="Legal Last Name"
          name="personalInfo.legalLastName"
          value={formData.personalInfo?.legalLastName || ""}
          onChange={handleChange}
          error={errors.legalLastName}
        />
        <TextInput
          label="Email"
          type="email"
          name="personalInfo.email"
          value={formData.personalInfo?.email || ""}
          onChange={handleChange}
          error={errors.email}
        />
        <TextInput
          label="Phone"
          name="personalInfo.phone"
          value={formData.personalInfo?.phone || ""}
          onChange={handleChange}
        />
        <TextInput
          label="Date of Birth"
          type="date"
          name="personalInfo.dateOfBirth"
          value={formData.personalInfo?.dateOfBirth?.slice(0, 10) || ""}
          onChange={handleChange}
          error={errors.dateOfBirth}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium text-gray-800 border-b pb-2 mb-4 tracking-wide">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextInput
            label="Street"
            name="personalInfo.address.street"
            value={formData.personalInfo?.address?.street || ""}
            onChange={handleChange}
            error={errors.street}
          />
          <TextInput
            label="City"
            name="personalInfo.address.city"
            value={formData.personalInfo?.address?.city || ""}
            onChange={handleChange}
            error={errors.city}
          />
          <TextInput
            label="State"
            name="personalInfo.address.state"
            value={formData.personalInfo?.address?.state || ""}
            onChange={handleChange}
            error={errors.state}
          />
          <TextInput
            label="ZIP"
            name="personalInfo.address.zip"
            value={formData.personalInfo?.address?.zip || ""}
            onChange={handleChange}
            error={errors.zip}
          />
          <TextInput
            label="Country"
            name="personalInfo.address.country"
            value={formData.personalInfo?.address?.country || ""}
            onChange={handleChange}
            error={errors.country}
          />
        </div>
      </div>

      <div className="pt-6 flex justify-center">
        <SquareButton 
          type="submit" 
          variant="white"
        >
          SAVE
        </SquareButton>
      </div>
    </form>
  );
}
