import mongoose, { Schema, Document, Types } from "mongoose";

export type ProfileRelationship = "self" | "guardian" | "family";

export interface IUserProfileLink extends Document {
  auth0Id: string;
  profileId: Types.ObjectId;
  relationship: ProfileRelationship;
  isPrimary: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserProfileLinkSchema = new Schema<IUserProfileLink>(
  {
    auth0Id: { type: String, required: true, index: true },
    profileId: { type: Schema.Types.ObjectId, ref: "MemberProfile", required: true },
    relationship: {
      type: String,
      enum: ["self", "guardian", "family"],
      required: true,
    },
    isPrimary: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserProfileLinkSchema.index({ auth0Id: 1, profileId: 1 }, { unique: true });
UserProfileLinkSchema.index({ auth0Id: 1, isPrimary: 1 });

export const UserProfileLink =
  mongoose.models.UserProfileLink ||
  mongoose.model<IUserProfileLink>("UserProfileLink", UserProfileLinkSchema);
