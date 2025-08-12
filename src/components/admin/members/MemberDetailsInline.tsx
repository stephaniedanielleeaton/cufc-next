"use client";

import React from "react";
import type { MemberProfileDTO } from "@/lib/types/MemberProfile";
import { TextInput } from "@/components/common/TextInput";
import { Dropdown } from "@/components/common/Dropdown";

type Props = { member: MemberProfileDTO };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h4 className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
        {title}
      </h4>
      {children}
    </section>
  );
}

function Toggle({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-gray-800">{label}</span>
      <span className="relative inline-flex h-6 w-11 items-center">
        <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-blue-600 transition-colors"></span>
        <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow peer-checked:translate-x-5 transition-transform"></span>
      </span>
    </label>
  );
}

export default function MemberDetailsInline({ member }: Props) {
  const address = member.personalInfo?.address;
  const dobForInput =
    member.personalInfo?.dateOfBirth
      ? new Date(member.personalInfo.dateOfBirth).toISOString().slice(0, 10)
      : "";

  return (
    <div className="pb-5 w-full"> {/* removed outer horizontal padding */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden w-full">

        <div className="p-4 sm:p-6 space-y-8">
          <Section title="Display">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Display First Name" name="displayFirstName" defaultValue={member.displayFirstName ?? ""} />
              <TextInput label="Display Last Name" name="displayLastName" defaultValue={member.displayLastName ?? ""} />
            </div>
          </Section>

          <hr className="border-gray-100" />

          <Section title="Personal">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Legal First Name" name="legalFirstName" defaultValue={member.personalInfo?.legalFirstName ?? ""} />
              <TextInput label="Legal Last Name" name="legalLastName" defaultValue={member.personalInfo?.legalLastName ?? ""} />
              <TextInput label="Email" name="email" type="email" defaultValue={member.personalInfo?.email ?? ""} />
              <TextInput label="Phone" name="phone" defaultValue={member.personalInfo?.phone ?? ""} />
              <TextInput label="Date of Birth" name="dateOfBirth" type="date" defaultValue={dobForInput} />
            </div>
          </Section>

          <hr className="border-gray-100" />

          <Section title="Address">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="Street" name="street" defaultValue={address?.street ?? ""} />
              <TextInput label="City" name="city" defaultValue={address?.city ?? ""} />
              <TextInput label="State" name="state" defaultValue={address?.state ?? ""} />
              <TextInput label="ZIP" name="zip" defaultValue={address?.zip ?? ""} />
              <TextInput label="Country" name="country" defaultValue={address?.country ?? ""} />
            </div>
          </Section>

          <hr className="border-gray-100" />

          <Section title="Guardian">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextInput label="First Name" name="guardian.firstName" defaultValue={member.guardian?.firstName ?? ""} />
              <TextInput label="Last Name" name="guardian.lastName" defaultValue={member.guardian?.lastName ?? ""} />
            </div>
          </Section>

          <hr className="border-gray-100" />

          <Section title="Family Members">
            {(member.familyMembers ?? []).length === 0 && (
              <div className="text-sm text-gray-500">No family members listed.</div>
            )}
            <div className="space-y-3">
              {(member.familyMembers ?? []).map((fm, idx) => {
                const fmDob = fm.dateOfBirth ? new Date(fm.dateOfBirth).toISOString().slice(0, 10) : "";
                return (
                  <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <TextInput label="Name" name={`familyMembers.${idx}.name`} defaultValue={fm.name ?? ""} />
                      <TextInput label="Relationship" name={`familyMembers.${idx}.relationship`} defaultValue={fm.relationship ?? ""} />
                      <TextInput label="DOB" name={`familyMembers.${idx}.dateOfBirth`} type="date" defaultValue={fmDob} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>

          <hr className="border-gray-100" />

          <Section title="Status & Flags">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div className="space-y-3">
      <Toggle
        label="Profile complete"
        name="profileComplete"
        defaultChecked={member.profileComplete ?? false}
      />
      <Toggle
        label="Waiver on file"
        name="isWaiverOnFile"
        defaultChecked={member.isWaiverOnFile ?? false}
      />
      <Toggle
        label="Payment waived"
        name="isPaymentWaived"
        defaultChecked={member.isPaymentWaived ?? false}
      />
    </div>

    <div className="space-y-4">
      <Dropdown
        label="Member Status"
        name="memberStatus"
        defaultValue={member.memberStatus ?? "New"}
        options={[
          { value: "New", label: "New" },
          { value: "Full", label: "Full" },
        ]}
      />
      <TextInput
        label="Square Customer ID"
        name="squareCustomerId"
        defaultValue={member.squareCustomerId ?? ""}
      />
    </div>
  </div>
</Section>

          <hr className="border-gray-100" />

          <Section title="Notes">
            <div className="space-y-1">
              <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 tracking-wide">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                defaultValue={member.notes ?? ""}
                rows={5}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Notes…"
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
