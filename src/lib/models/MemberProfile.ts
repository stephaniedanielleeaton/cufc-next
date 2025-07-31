// models/MemberProfile.ts

import mongoose, { Schema, Document } from 'mongoose';

const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
}, { _id: false });

const PersonalInfoSchema = new Schema({
  legalFirstName: String,
  legalLastName: String,
  email: String,
  phone: String,
  dateOfBirth: Date,
  address: AddressSchema,
}, { _id: false });

const FamilyMemberSchema = new Schema({
  name: String,
  relationship: String,
  dateOfBirth: Date,
}, { _id: false });

const GuardianSchema = new Schema({
  firstName: String,
  lastName: String,
}, { _id: false });

import { MemberStatus } from "@/lib/types/MemberStatus";

export interface IMemberProfile extends Document {
  auth0Id: string;
  displayFirstName?: string;
  displayLastName?: string;
  personalInfo?: typeof PersonalInfoSchema;
  guardian?: typeof GuardianSchema;
  familyMembers?: typeof FamilyMemberSchema[];
  isWaiverOnFile?: boolean;
  isPaymentWaived?: boolean;
  notes?: string;
  lastAttendanceCheckIn?: Date;
  profileComplete?: boolean;
  checkedIn?: boolean;
  lastCheckInDate?: Date;
  memberStatus?: MemberStatus;
  createdAt?: Date;
  updatedAt?: Date;
  squareCustomerId?: string;
}

const MemberProfileSchema = new Schema<IMemberProfile>({
  auth0Id: { type: String, required: true, unique: true },
  displayFirstName: String,
  displayLastName: String,
  personalInfo: PersonalInfoSchema,
  guardian: GuardianSchema,
  familyMembers: [FamilyMemberSchema],
  isWaiverOnFile: Boolean,
  isPaymentWaived: { type: Boolean, default: false },
  notes: String,
  lastAttendanceCheckIn: Date,
  memberStatus: { type: String, enum: ['New', 'Full'], default: 'New' },
  profileComplete: { type: Boolean, default: false },
  checkedIn: { type: Boolean, default: false },
  lastCheckInDate: Date,
  squareCustomerId: String,
}, { timestamps: true });

export const MemberProfile = mongoose.models.MemberProfile || mongoose.model<IMemberProfile>('MemberProfile', MemberProfileSchema);
